import { NextResponse } from 'next/server';
import epmConfig from '@/config/epm.json';
import { upsertMailerLiteSubscriber } from '@/lib/integrations/mailerlite';

const WAITLIST_GROUP_BY_TAG = new Map(
  epmConfig.comingSoon.map((entry) => [entry.waitlistTag, entry.waitlistGroupId])
);

// Pragmatic email check — rejects obvious garbage without trying to be RFC 5322.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  try {
    return NextResponse.json(epmConfig);
  } catch (error) {
    console.error('Error loading EPM config:', error);
    return NextResponse.json(
      { error: 'Failed to load EPM configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { email, waitlistTag } = await request.json();

    if (!email || !waitlistTag) {
      return NextResponse.json(
        { error: 'Email and waitlist tag are required' },
        { status: 400 }
      );
    }

    const normalizedEmail =
      typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!EMAIL_RE.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (typeof waitlistTag !== 'string' || !WAITLIST_GROUP_BY_TAG.has(waitlistTag)) {
      return NextResponse.json(
        { error: 'Unknown waitlist tag' },
        { status: 400 }
      );
    }

    const groupId = WAITLIST_GROUP_BY_TAG.get(waitlistTag);
    if (!groupId || groupId.startsWith('REPLACE_WITH_')) {
      console.error('[epm-waitlist] Group ID not configured for tag:', waitlistTag);
      return NextResponse.json(
        { error: 'Waitlist enrollment is not yet configured' },
        { status: 503 }
      );
    }

    const result = await upsertMailerLiteSubscriber({
      email: normalizedEmail,
      groupId,
    });

    if (!result.ok) {
      console.error('[epm-waitlist] Enrollment failed:', result);
      return NextResponse.json(
        { error: 'Failed to enroll in waitlist' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully joined EPM waitlist',
    });
  } catch (error) {
    console.error('Error processing EPM waitlist signup:', error);
    return NextResponse.json(
      { error: 'Failed to process waitlist signup' },
      { status: 500 }
    );
  }
}
