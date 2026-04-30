/**
 * Multi-Tenant Organizations Engine
 * Handles tenant isolation, role-based access control, and scoped API keys
 */

import { getDb, getAdminAuth } from '@/lib/server/firebaseAdmin';
import crypto from 'crypto';
import { FieldValue } from "@/lib/legacy-stubs";

interface Organization {
  id: string;
  name: string;
  slug: string; // URL-friendly identifier
  description?: string;
  created_at: Date;
  updated_at: Date;
  created_by: string; // User ID who created the org
  settings: {
    billing_enabled: boolean;
    api_access_enabled: boolean;
    webhook_enabled: boolean;
    max_users: number;
    max_api_keys: number;
    data_retention_days: number;
    features: string[]; // Feature flags for this org
  };
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'inactive' | 'suspended';
    billing_email?: string;
    expires_at?: Date;
  };
  metadata: {
    total_users: number;
    total_api_keys: number;
    last_activity: Date;
    data_usage_bytes: number;
  };
}

interface OrganizationMember {
  id: string;
  org_id: string;
  user_id: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions: string[]; // Specific permissions within the org
  joined_at: Date;
  last_active: Date;
  invited_by?: string;
  status: 'active' | 'pending' | 'suspended';
}

interface ScopedApiKey {
  id: string;
  name: string;
  key_hash: string; // SHA-256 hash of the actual key
  key_prefix: string; // First 8 chars for identification
  org_id: string;
  created_by: string;
  created_at: Date;
  expires_at?: Date;
  last_used?: Date;
  scopes: string[]; // What this key can access
  rate_limits: {
    requests_per_minute: number;
    requests_per_hour: number;
    requests_per_day: number;
  };
  usage_stats: {
    total_requests: number;
    requests_today: number;
    last_request_at?: Date;
    last_request_ip?: string;
  };
  status: 'active' | 'revoked' | 'expired';
}

interface TenantDataAccess {
  org_id: string;
  collection: string;
  permissions: ('read' | 'write' | 'delete')[];
  filters?: Record<string, any>; // Additional filtering rules
}

interface OrganizationMetrics {
  total_orgs: number;
  active_orgs: number;
  total_members: number;
  total_api_keys: number;
  avg_members_per_org: number;
  data_usage_total_gb: number;
  api_requests_24h: number;
  top_orgs_by_activity: Array<{ org_id: string; name: string; activity_score: number }>;
}

export class MultiTenantEngine {
  /**
   * Initialize multi-tenant system with default configurations
   */
  async initialize(): Promise<void> {
    console.log('🏢 Initializing Multi-Tenant Organizations Engine...');

    const db = getDb();

    // Create default organization for existing users (migration)
    const defaultOrg: Omit<Organization, 'id'> = {
      name: 'AudioJones Default Organization',
      slug: 'audiojones-default',
      description: 'Default organization for existing users',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'system',
      settings: {
        billing_enabled: true,
        api_access_enabled: true,
        webhook_enabled: true,
        max_users: 50,
        max_api_keys: 10,
        data_retention_days: 365,
        features: ['basic_analytics', 'webhook_access', 'api_access']
      },
      subscription: {
        plan: 'enterprise',
        status: 'active',
        billing_email: 'admin@audiojones.com'
      },
      metadata: {
        total_users: 0,
        total_api_keys: 0,
        last_activity: new Date(),
        data_usage_bytes: 0
      }
    };

    // Create default organization
    const defaultOrgRef = await db.collection('organizations').add(defaultOrg);
    console.log(`✅ Created default organization: ${defaultOrgRef.id}`);

    // Initialize system collections with indexes
    await db.collection('organization_audit_log').add({
      timestamp: new Date(),
      action: 'system_initialized',
      details: 'Multi-tenant system initialized with default organization',
      org_id: defaultOrgRef.id,
      user_id: 'system',
      success: true,
      metadata: {
        default_org_id: defaultOrgRef.id,
        initialization_complete: true
      }
    });

    console.log('✅ Multi-tenant organizations system initialized');
  }

  /**
   * Create a new organization
   */
  async createOrganization(
    name: string,
    slug: string,
    createdBy: string,
    options: {
      description?: string;
      plan?: 'free' | 'pro' | 'enterprise';
      features?: string[];
    } = {}
  ): Promise<Organization> {
    console.log(`🏢 Creating organization: ${name} (${slug})`);

    const db = getDb();

    // Check if slug is already taken
    const existingOrgQuery = await db
      .collection('organizations')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (!existingOrgQuery.empty) {
      throw new Error(`Organization slug '${slug}' is already taken`);
    }

    // Set default settings based on plan
    const plan = options.plan || 'free';
    const planSettings = {
      free: {
        max_users: 5,
        max_api_keys: 2,
        data_retention_days: 30,
        features: ['basic_analytics']
      },
      pro: {
        max_users: 25,
        max_api_keys: 5,
        data_retention_days: 90,
        features: ['basic_analytics', 'advanced_analytics', 'webhook_access']
      },
      enterprise: {
        max_users: 100,
        max_api_keys: 20,
        data_retention_days: 365,
        features: ['basic_analytics', 'advanced_analytics', 'webhook_access', 'api_access', 'slo_monitoring', 'backup_restore']
      }
    };

    const settings = planSettings[plan];

    const organization: Omit<Organization, 'id'> = {
      name,
      slug,
      description: options.description,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: createdBy,
      settings: {
        billing_enabled: plan !== 'free',
        api_access_enabled: plan === 'enterprise',
        webhook_enabled: plan !== 'free',
        max_users: settings.max_users,
        max_api_keys: settings.max_api_keys,
        data_retention_days: settings.data_retention_days,
        features: options.features || settings.features
      },
      subscription: {
        plan,
        status: 'active'
      },
      metadata: {
        total_users: 1, // Creator becomes first member
        total_api_keys: 0,
        last_activity: new Date(),
        data_usage_bytes: 0
      }
    };

    // Create organization
    const orgRef = await db.collection('organizations').add(organization);
    const orgId = orgRef.id;

    // Add creator as owner
    await this.addMemberToOrganization(orgId, createdBy, 'owner', createdBy);

    // Log creation
    await this.logOrganizationActivity(orgId, createdBy, 'organization_created', {
      organization_name: name,
      plan: plan,
      features: organization.settings.features
    });

    const createdOrg: Organization = {
      id: orgId,
      ...organization
    };

    console.log(`✅ Organization created: ${name} (${orgId})`);
    return createdOrg;
  }

  /**
   * Add a member to an organization
   */
  async addMemberToOrganization(
    orgId: string,
    userId: string,
    role: OrganizationMember['role'],
    invitedBy: string,
    email?: string
  ): Promise<OrganizationMember> {
    console.log(`👤 Adding member ${userId} to organization ${orgId} as ${role}`);

    const db = getDb();

    // Get user details if email not provided
    if (!email) {
      try {
        const userRecord = await getAdminAuth().getUser(userId);
        email = userRecord.email || `user-${userId}@unknown.com`;
      } catch (error) {
        email = `user-${userId}@unknown.com`;
      }
    }

    // Check if user is already a member
    const existingMemberQuery = await db
      .collection('organization_members')
      .where('org_id', '==', orgId)
      .where('user_id', '==', userId)
      .limit(1)
      .get();

    if (!existingMemberQuery.empty) {
      throw new Error(`User ${userId} is already a member of organization ${orgId}`);
    }

    // Check organization limits
    const org = await this.getOrganization(orgId);
    if (org.metadata.total_users >= org.settings.max_users) {
      throw new Error(`Organization has reached maximum user limit (${org.settings.max_users})`);
    }

    // Define role-based permissions
    const rolePermissions: Record<OrganizationMember['role'], string[]> = {
      owner: ['*'], // All permissions
      admin: [
        'org.read', 'org.update', 'org.members.read', 'org.members.add', 'org.members.remove',
        'org.apikeys.read', 'org.apikeys.create', 'org.apikeys.revoke',
        'data.read', 'data.write', 'webhooks.read', 'webhooks.write'
      ],
      member: [
        'org.read', 'org.members.read',
        'data.read', 'data.write', 'webhooks.read'
      ],
      viewer: [
        'org.read', 'org.members.read', 'data.read'
      ]
    };

    const member: Omit<OrganizationMember, 'id'> = {
      org_id: orgId,
      user_id: userId,
      email: email!,
      role,
      permissions: rolePermissions[role],
      joined_at: new Date(),
      last_active: new Date(),
      invited_by: invitedBy,
      status: 'active'
    };

    // Add member
    const memberRef = await db.collection('organization_members').add(member);

    // Update organization metadata
    await db.collection('organizations').doc(orgId).update({
      'metadata.total_users': FieldValue.increment(1),
      updated_at: new Date()
    });

    // Log activity
    await this.logOrganizationActivity(orgId, invitedBy, 'member_added', {
      new_member_id: userId,
      new_member_email: email,
      role: role
    });

    const createdMember: OrganizationMember = {
      id: memberRef.id,
      ...member
    };

    console.log(`✅ Member added: ${email} (${role})`);
    return createdMember;
  }

  /**
   * Create a scoped API key for an organization
   */
  async createScopedApiKey(
    orgId: string,
    name: string,
    scopes: string[],
    createdBy: string,
    options: {
      expiresAt?: Date;
      rateLimits?: ScopedApiKey['rate_limits'];
    } = {}
  ): Promise<{ apiKey: ScopedApiKey; rawKey: string }> {
    console.log(`🔑 Creating scoped API key: ${name} for org ${orgId}`);

    const db = getDb();

    // Check organization limits
    const org = await this.getOrganization(orgId);
    if (org.metadata.total_api_keys >= org.settings.max_api_keys) {
      throw new Error(`Organization has reached maximum API key limit (${org.settings.max_api_keys})`);
    }

    // Verify user has permission to create API keys
    const member = await this.getOrganizationMember(orgId, createdBy);
    if (!this.hasPermission(member, 'org.apikeys.create')) {
      throw new Error('User does not have permission to create API keys');
    }

    // Generate API key
    const rawKey = this.generateApiKey(orgId);
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const keyPrefix = rawKey.substring(0, 8);

    const defaultRateLimits = {
      requests_per_minute: 100,
      requests_per_hour: 1000,
      requests_per_day: 10000
    };

    const apiKey: Omit<ScopedApiKey, 'id'> = {
      name,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      org_id: orgId,
      created_by: createdBy,
      created_at: new Date(),
      expires_at: options.expiresAt,
      scopes,
      rate_limits: options.rateLimits || defaultRateLimits,
      usage_stats: {
        total_requests: 0,
        requests_today: 0
      },
      status: 'active'
    };

    // Create API key
    const apiKeyRef = await db.collection('scoped_api_keys').add(apiKey);

    // Update organization metadata
    await db.collection('organizations').doc(orgId).update({
      'metadata.total_api_keys': FieldValue.increment(1),
      updated_at: new Date()
    });

    // Log activity
    await this.logOrganizationActivity(orgId, createdBy, 'api_key_created', {
      api_key_name: name,
      api_key_id: apiKeyRef.id,
      scopes: scopes
    });

    const createdApiKey: ScopedApiKey = {
      id: apiKeyRef.id,
      ...apiKey
    };

    console.log(`✅ API key created: ${name} (${keyPrefix}...)`);
    return { apiKey: createdApiKey, rawKey };
  }

  /**
   * Validate and authenticate a scoped API key
   */
  async validateApiKey(rawKey: string): Promise<{
    valid: boolean;
    apiKey?: ScopedApiKey;
    organization?: Organization;
    error?: string;
  }> {
    try {
      const db = getDb();
      const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

      // Find API key by hash
      const apiKeyQuery = await db
        .collection('scoped_api_keys')
        .where('key_hash', '==', keyHash)
        .where('status', '==', 'active')
        .limit(1)
        .get();

      if (apiKeyQuery.empty) {
        return { valid: false, error: 'Invalid API key' };
      }

      const apiKeyDoc = apiKeyQuery.docs[0];
      const apiKey = { id: apiKeyDoc.id, ...apiKeyDoc.data() } as ScopedApiKey;

      // Check expiration
      if (apiKey.expires_at && apiKey.expires_at.getTime() < Date.now()) {
        // Mark as expired
        await apiKeyDoc.ref.update({ status: 'expired' });
        return { valid: false, error: 'API key has expired' };
      }

      // Get organization
      const organization = await this.getOrganization(apiKey.org_id);
      if (organization.subscription?.status !== 'active') {
        return { valid: false, error: 'Organization subscription is not active' };
      }

      // Update usage stats
      await apiKeyDoc.ref.update({
        last_used: new Date(),
        'usage_stats.total_requests': FieldValue.increment(1),
        'usage_stats.requests_today': FieldValue.increment(1),
        'usage_stats.last_request_at': new Date()
      });

      return { valid: true, apiKey, organization };

    } catch (error) {
      console.error('API key validation error:', error);
      return { valid: false, error: 'Internal validation error' };
    }
  }

  /**
   * Check if API key has specific scope
   */
  hasApiKeyScope(apiKey: ScopedApiKey, requiredScope: string): boolean {
    return apiKey.scopes.includes('*') || apiKey.scopes.includes(requiredScope);
  }

  /**
   * Get organization by ID
   */
  async getOrganization(orgId: string): Promise<Organization> {
    const db = getDb();
    const orgDoc = await db.collection('organizations').doc(orgId).get();
    
    if (!orgDoc.exists) {
      throw new Error(`Organization ${orgId} not found`);
    }

    return { id: orgDoc.id, ...orgDoc.data() } as Organization;
  }

  /**
   * Get organization member
   */
  async getOrganizationMember(orgId: string, userId: string): Promise<OrganizationMember> {
    const db = getDb();
    const memberQuery = await db
      .collection('organization_members')
      .where('org_id', '==', orgId)
      .where('user_id', '==', userId)
      .where('status', '==', 'active')
      .limit(1)
      .get();

    if (memberQuery.empty) {
      throw new Error(`User ${userId} is not a member of organization ${orgId}`);
    }

    const memberDoc = memberQuery.docs[0];
    return { id: memberDoc.id, ...memberDoc.data() } as OrganizationMember;
  }

  /**
   * Check if member has specific permission
   */
  hasPermission(member: OrganizationMember, permission: string): boolean {
    return member.permissions.includes('*') || member.permissions.includes(permission);
  }

  /**
   * Generate tenant-scoped data filters
   */
  getTenantDataFilters(orgId: string, collection: string): Record<string, any> {
    // Define which collections are tenant-scoped
    const tenantScopedCollections = [
      'client_contracts',
      'slo_credit_applications',
      'backup_jobs',
      'secret_rotation_jobs',
      'organization_audit_log'
    ];

    if (tenantScopedCollections.includes(collection)) {
      return { org_id: orgId };
    }

    // Global collections (not tenant-scoped)
    return {};
  }

  /**
   * Get multi-tenant metrics
   */
  async getMetrics(): Promise<OrganizationMetrics> {
    const db = getDb();

    // Get organization counts
    const orgsSnapshot = await db.collection('organizations').get();
    const totalOrgs = orgsSnapshot.size;
    
    const activeOrgs = orgsSnapshot.docs.filter((doc: any) => {
      const org = doc.data();
      return org.subscription?.status === 'active';
    }).length;

    // Get member counts
    const membersSnapshot = await db.collection('organization_members').where('status', '==', 'active').get();
    const totalMembers = membersSnapshot.size;

    // Get API key counts
    const apiKeysSnapshot = await db.collection('scoped_api_keys').where('status', '==', 'active').get();
    const totalApiKeys = apiKeysSnapshot.size;

    // Calculate averages
    const avgMembersPerOrg = totalOrgs > 0 ? Math.round((totalMembers / totalOrgs) * 100) / 100 : 0;

    // Calculate data usage (simplified)
    let dataUsageTotal = 0;
    orgsSnapshot.docs.forEach((doc: any) => {
      const org = doc.data();
      dataUsageTotal += org.metadata?.data_usage_bytes || 0;
    });
    const dataUsageTotalGb = Math.round((dataUsageTotal / (1024 * 1024 * 1024)) * 100) / 100;

    // Get API requests in last 24h (simplified)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentApiRequestsQuery = await db
      .collection('scoped_api_keys')
      .where('usage_stats.last_request_at', '>=', yesterday)
      .get();

    let apiRequests24h = 0;
    recentApiRequestsQuery.docs.forEach((doc: any) => {
      const apiKey = doc.data();
      apiRequests24h += apiKey.usage_stats?.requests_today || 0;
    });

    // Get top organizations by activity
    const topOrgsByActivity = orgsSnapshot.docs
      .map((doc: any) => ({
        org_id: doc.id,
        name: doc.data().name,
        activity_score: doc.data().metadata?.total_users * 10 + doc.data().metadata?.total_api_keys * 5
      }))
      .sort((a: any, b: any) => b.activity_score - a.activity_score)
      .slice(0, 5);

    return {
      total_orgs: totalOrgs,
      active_orgs: activeOrgs,
      total_members: totalMembers,
      total_api_keys: totalApiKeys,
      avg_members_per_org: avgMembersPerOrg,
      data_usage_total_gb: dataUsageTotalGb,
      api_requests_24h: apiRequests24h,
      top_orgs_by_activity: topOrgsByActivity
    };
  }

  /**
   * Generate a secure API key
   */
  private generateApiKey(orgId: string): string {
    const orgPrefix = orgId.substring(0, 4);
    const timestamp = Date.now().toString(36);
    const randomBytes = crypto.randomBytes(32).toString('base64url');
    return `aj_${orgPrefix}_${timestamp}_${randomBytes}`;
  }

  /**
   * Log organization activity
   */
  private async logOrganizationActivity(
    orgId: string,
    userId: string,
    action: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const db = getDb();
    await db.collection('organization_audit_log').add({
      timestamp: new Date(),
      org_id: orgId,
      user_id: userId,
      action,
      metadata,
      success: true
    });
  }
}

export const multiTenantEngine = new MultiTenantEngine();