/**
 * Multi-Tenant Organizations Admin API
 * Handles CRUD operations for organizations, members, and API keys
 */

import { NextRequest, NextResponse } from 'next/server';
import { multiTenantEngine } from '@/lib/multitenant/MultiTenantEngine';

export async function GET(request: NextRequest) {
  try {
    const { checkAdmin } = await import('@/lib/server/requireAdmin');
    const adminResponse = checkAdmin(request);
    if (adminResponse) {
      return adminResponse;
    }
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'dashboard': {
        console.log('📊 Getting multi-tenant dashboard metrics');
        const metrics = await multiTenantEngine.getMetrics();
        
        return NextResponse.json({
          success: true,
          data: {
            metrics,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'organizations': {
        console.log('🏢 Getting organizations list');
        const db = (await import('@/lib/server/firebaseAdmin')).getDb();
        
        const orgsSnapshot = await db
          .collection('organizations')
          .orderBy('created_at', 'desc')
          .limit(50)
          .get();

        const organizations = orgsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        return NextResponse.json({
          success: true,
          data: {
            organizations,
            total: orgsSnapshot.size
          }
        });
      }

      case 'organization': {
        const orgId = searchParams.get('org_id');
        if (!orgId) {
          return NextResponse.json({
            success: false,
            error: 'Organization ID required'
          }, { status: 400 });
        }

        console.log(`🏢 Getting organization details: ${orgId}`);
        const organization = await multiTenantEngine.getOrganization(orgId);

        // Get members
        const db = (await import('@/lib/server/firebaseAdmin')).getDb();
        const membersSnapshot = await db
          .collection('organization_members')
          .where('org_id', '==', orgId)
          .where('status', '==', 'active')
          .get();

        const members = membersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Get API keys
        const apiKeysSnapshot = await db
          .collection('scoped_api_keys')
          .where('org_id', '==', orgId)
          .where('status', '==', 'active')
          .get();

        const apiKeys = apiKeysSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        return NextResponse.json({
          success: true,
          data: {
            organization,
            members,
            api_keys: apiKeys
          }
        });
      }

      case 'members': {
        const orgId = searchParams.get('org_id');
        if (!orgId) {
          return NextResponse.json({
            success: false,
            error: 'Organization ID required'
          }, { status: 400 });
        }

        console.log(`👥 Getting members for organization: ${orgId}`);
        const db = (await import('@/lib/server/firebaseAdmin')).getDb();
        
        const membersSnapshot = await db
          .collection('organization_members')
          .where('org_id', '==', orgId)
          .orderBy('joined_at', 'desc')
          .get();

        const members = membersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        return NextResponse.json({
          success: true,
          data: { members }
        });
      }

      case 'api_keys': {
        const orgId = searchParams.get('org_id');
        if (!orgId) {
          return NextResponse.json({
            success: false,
            error: 'Organization ID required'
          }, { status: 400 });
        }

        console.log(`🔑 Getting API keys for organization: ${orgId}`);
        const db = (await import('@/lib/server/firebaseAdmin')).getDb();
        
        const apiKeysSnapshot = await db
          .collection('scoped_api_keys')
          .where('org_id', '==', orgId)
          .orderBy('created_at', 'desc')
          .get();

        const apiKeys = apiKeysSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        return NextResponse.json({
          success: true,
          data: { api_keys: apiKeys }
        });
      }

      case 'audit_log': {
        const orgId = searchParams.get('org_id');
        const limit = parseInt(searchParams.get('limit') || '50');

        console.log(`📋 Getting audit log${orgId ? ` for org ${orgId}` : ''}`);
        const db = (await import('@/lib/server/firebaseAdmin')).getDb();
        
        let auditSnapshot;
        
        if (orgId) {
          auditSnapshot = await db.collection('organization_audit_log')
            .where('org_id', '==', orgId)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();
        } else {
          auditSnapshot = await db.collection('organization_audit_log')
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();
        }

        const auditLog = auditSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        return NextResponse.json({
          success: true,
          data: { audit_log: auditLog }
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Multi-tenant API GET error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { checkAdmin } = await import('@/lib/server/requireAdmin');
    const adminResponse = checkAdmin(request);
    if (adminResponse) {
      return adminResponse;
    }
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'initialize': {
        console.log('🚀 Initializing multi-tenant system');
        await multiTenantEngine.initialize();

        return NextResponse.json({
          success: true,
          message: 'Multi-tenant system initialized successfully'
        });
      }

      case 'create_organization': {
        const { name, slug, description, plan, features } = body;
        
        if (!name || !slug) {
          return NextResponse.json({
            success: false,
            error: 'Name and slug are required'
          }, { status: 400 });
        }

        console.log(`🏢 Creating organization: ${name} (${slug})`);
        const organization = await multiTenantEngine.createOrganization(
          name,
          slug,
          'admin-system',
          { description, plan, features }
        );

        return NextResponse.json({
          success: true,
          data: { organization },
          message: `Organization '${name}' created successfully`
        });
      }

      case 'add_member': {
        const { org_id, user_id, email, role } = body;
        
        if (!org_id || !user_id || !role) {
          return NextResponse.json({
            success: false,
            error: 'org_id, user_id, and role are required'
          }, { status: 400 });
        }

        console.log(`👤 Adding member ${user_id} to organization ${org_id}`);
        const member = await multiTenantEngine.addMemberToOrganization(
          org_id,
          user_id,
          role,
          'admin-system',
          email
        );

        return NextResponse.json({
          success: true,
          data: { member },
          message: `Member added successfully`
        });
      }

      case 'create_api_key': {
        const { org_id, name, scopes, expires_at, rate_limits } = body;
        
        if (!org_id || !name || !scopes || !Array.isArray(scopes)) {
          return NextResponse.json({
            success: false,
            error: 'org_id, name, and scopes array are required'
          }, { status: 400 });
        }

        console.log(`🔑 Creating API key: ${name} for org ${org_id}`);
        const result = await multiTenantEngine.createScopedApiKey(
          org_id,
          name,
          scopes,
          'admin-system',
          {
            expiresAt: expires_at ? new Date(expires_at) : undefined,
            rateLimits: rate_limits
          }
        );

        return NextResponse.json({
          success: true,
          data: {
            api_key: result.apiKey,
            raw_key: result.rawKey // Only returned once!
          },
          message: `API key '${name}' created successfully`
        });
      }

      case 'revoke_api_key': {
        const { api_key_id } = body;
        
        if (!api_key_id) {
          return NextResponse.json({
            success: false,
            error: 'api_key_id is required'
          }, { status: 400 });
        }

        console.log(`🔐 Revoking API key: ${api_key_id}`);
        const db = (await import('@/lib/server/firebaseAdmin')).getDb();
        
        // Update API key status
        await db.collection('scoped_api_keys').doc(api_key_id).update({
          status: 'revoked',
          revoked_at: new Date(),
          revoked_by: 'admin-system'
        });

        // Get org_id for audit log
        const apiKeyDoc = await db.collection('scoped_api_keys').doc(api_key_id).get();
        const apiKeyData = apiKeyDoc.data();
        
        if (apiKeyData) {
          // Update organization metadata
          await db.collection('organizations').doc(apiKeyData.org_id).update({
            'metadata.total_api_keys': (await import('@/lib/legacy-stubs')).FieldValue.increment(-1),
            updated_at: new Date()
          });

          // Log activity
          await db.collection('organization_audit_log').add({
            timestamp: new Date(),
            org_id: apiKeyData.org_id,
            user_id: 'admin-system',
            action: 'api_key_revoked',
            metadata: {
              api_key_id,
              api_key_name: apiKeyData.name
            },
            success: true
          });
        }

        return NextResponse.json({
          success: true,
          message: 'API key revoked successfully'
        });
      }

      case 'update_member_role': {
        const { member_id, new_role } = body;
        
        if (!member_id || !new_role) {
          return NextResponse.json({
            success: false,
            error: 'member_id and new_role are required'
          }, { status: 400 });
        }

        console.log(`👤 Updating member ${member_id} role to ${new_role}`);
        const db = (await import('@/lib/server/firebaseAdmin')).getDb();
        
        // Define role-based permissions
        const rolePermissions: Record<string, string[]> = {
          owner: ['*'],
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

        // Update member
        await db.collection('organization_members').doc(member_id).update({
          role: new_role,
          permissions: rolePermissions[new_role] || [],
          updated_at: new Date(),
          updated_by: 'admin-system'
        });

        // Get member data for audit log
        const memberDoc = await db.collection('organization_members').doc(member_id).get();
        const memberData = memberDoc.data();
        
        if (memberData) {
          // Log activity
          await db.collection('organization_audit_log').add({
            timestamp: new Date(),
            org_id: memberData.org_id,
            user_id: 'admin-system',
            action: 'member_role_updated',
            metadata: {
              member_id,
              member_email: memberData.email,
              old_role: memberData.role,
              new_role
            },
            success: true
          });
        }

        return NextResponse.json({
          success: true,
          message: 'Member role updated successfully'
        });
      }

      case 'remove_member': {
        const { member_id } = body;
        
        if (!member_id) {
          return NextResponse.json({
            success: false,
            error: 'member_id is required'
          }, { status: 400 });
        }

        console.log(`👤 Removing member: ${member_id}`);
        const db = (await import('@/lib/server/firebaseAdmin')).getDb();
        
        // Get member data before removal
        const memberDoc = await db.collection('organization_members').doc(member_id).get();
        const memberData = memberDoc.data();
        
        if (!memberData) {
          return NextResponse.json({
            success: false,
            error: 'Member not found'
          }, { status: 404 });
        }

        // Update member status instead of deleting
        await db.collection('organization_members').doc(member_id).update({
          status: 'removed',
          removed_at: new Date(),
          removed_by: 'admin-system'
        });

        // Update organization metadata
        await db.collection('organizations').doc(memberData.org_id).update({
          'metadata.total_users': (await import('@/lib/legacy-stubs')).FieldValue.increment(-1),
          updated_at: new Date()
        });

        // Log activity
        await db.collection('organization_audit_log').add({
          timestamp: new Date(),
          org_id: memberData.org_id,
          user_id: 'admin-system',
          action: 'member_removed',
          metadata: {
            member_id,
            member_email: memberData.email,
            member_role: memberData.role
          },
          success: true
        });

        return NextResponse.json({
          success: true,
          message: 'Member removed successfully'
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Multi-tenant API POST error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}