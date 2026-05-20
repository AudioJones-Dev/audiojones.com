import { NextResponse } from 'next/server';
import epmConfig from '@/config/epm.json';
import { upsertMailerLiteSubscriber } from '@/lib/integrations/mailerlite';

const ALLOWED_WAITLIST_TAGS = new Set(
  epmConfig.comingSoon.map((entry) => entry.waitlistTag)
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

    if (typeof waitlistTag !== 'string' || !ALLOWED_WAITLIST_TAGS.has(waitlistTag)) {
      return NextResponse.json(
        { error: 'Unknown waitlist tag' },
        { status: 400 }
      );
    }

    await upsertMailerLiteSubscriber({ email: normalizedEmail, tag: waitlistTag });

    return NextResponse.json({
      success: true,
      message: 'Successfully joined EPM waitlist'
    });
  } catch (error) {
    console.error('Error processing EPM waitlist signup:', error);
    return NextResponse.json(
      { error: 'Failed to process waitlist signup' },
      { status: 500 }
    );
  }
}