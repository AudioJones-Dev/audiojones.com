import { NextResponse } from 'next/server';
import epmConfig from '@/config/epm.json';
import { upsertMailerLiteSubscriber } from '@/lib/integrations/mailerlite';

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

    await upsertMailerLiteSubscriber({ email, tag: waitlistTag });

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