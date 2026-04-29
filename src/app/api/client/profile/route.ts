import { NextRequest } from 'next/server';
import { getFirestore } from "@/lib/legacy-stubs";
import { requireClient, AuthError, createAuthErrorResponse } from '@/lib/server/requireClient';

/**
 * Client Profile API Route
 * 
 * Allows authenticated clients to view and update their own profile information.
 * Only safe fields are exposed/editable: name, company, phone.
 * Critical fields like email, status, tier, billing_sku are read-only.
 */

// Safe fields that clients can read
const SAFE_READ_FIELDS = ['email', 'name', 'company', 'phone', 'status'];

// Fields that clients can update
const EDITABLE_FIELDS = ['name', 'company', 'phone'];

interface ProfileUpdateData {
  name?: string;
  company?: string;
  phone?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate the client and get their email
    const userEmail = await requireClient(request);

    // Get Firestore instance
    const db = getFirestore();

    // Fetch customer profile from Firestore
    const customerDoc = await db.collection('customers').doc(userEmail).get();
    
    if (!customerDoc.exists) {
      return Response.json({
        ok: false,
        error: 'profile_not_found'
      }, { status: 404 });
    }

    const customerData = customerDoc.data();
    
    // Filter to only safe fields
    const safeProfile: any = {};
    SAFE_READ_FIELDS.forEach(field => {
      if (customerData && customerData[field] !== undefined) {
        safeProfile[field] = customerData[field];
      }
    });

    return Response.json({
      ok: true,
      customer: safeProfile,
    });

  } catch (error) {
    console.error('Client profile GET error:', error);
    
    // Handle authentication errors
    if (error instanceof AuthError) {
      return createAuthErrorResponse(error);
    }
    
    return Response.json({ 
      ok: false, 
      error: 'internal_server_error' 
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Authenticate the client and get their email
    const userEmail = await requireClient(request);

    // Parse and validate request body
    let updateData: ProfileUpdateData;
    try {
      updateData = await request.json();
    } catch {
      return Response.json({
        ok: false,
        error: 'invalid_json'
      }, { status: 400 });
    }

    // Validate that only editable fields are provided
    const providedFields = Object.keys(updateData);
    const invalidFields = providedFields.filter(field => !EDITABLE_FIELDS.includes(field));
    
    if (invalidFields.length > 0) {
      return Response.json({
        ok: false,
        error: 'invalid_fields',
        details: `Fields not allowed: ${invalidFields.join(', ')}`
      }, { status: 400 });
    }

    // Validate field types
    const validationErrors: string[] = [];
    
    if (updateData.name !== undefined && (typeof updateData.name !== 'string' || updateData.name.trim().length === 0)) {
      validationErrors.push('name must be a non-empty string');
    }
    
    if (updateData.company !== undefined && typeof updateData.company !== 'string') {
      validationErrors.push('company must be a string');
    }
    
    if (updateData.phone !== undefined && typeof updateData.phone !== 'string') {
      validationErrors.push('phone must be a string');
    }

    if (validationErrors.length > 0) {
      return Response.json({
        ok: false,
        error: 'validation_failed',
        details: validationErrors.join(', ')
      }, { status: 400 });
    }

    // Prepare update data with timestamp
    const updatePayload = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // Get Firestore instance
    const db = getFirestore();

    // Update the customer document
    const customerRef = db.collection('customers').doc(userEmail);
    await customerRef.set(updatePayload, { merge: true });

    // Fetch the updated document
    const updatedDoc = await customerRef.get();
    const updatedData = updatedDoc.data();
    
    // Filter to only safe fields for response
    const safeProfile: any = {};
    SAFE_READ_FIELDS.forEach(field => {
      if (updatedData && updatedData[field] !== undefined) {
        safeProfile[field] = updatedData[field];
      }
    });

    return Response.json({
      ok: true,
      customer: safeProfile,
      updated_fields: Object.keys(updateData)
    });

  } catch (error) {
    console.error('Client profile PATCH error:', error);
    
    // Handle authentication errors
    if (error instanceof AuthError) {
      return createAuthErrorResponse(error);
    }
    
    return Response.json({ 
      ok: false, 
      error: 'internal_server_error' 
    }, { status: 500 });
  }
}