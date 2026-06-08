import { NextResponse } from 'next/server';
import artistHubConfig from '@/config/artistHub.json';

export async function GET() {
  try {
    return NextResponse.json(artistHubConfig);
  } catch (error) {
    console.error('Error loading artist hub config:', error);
    return NextResponse.json(
      { error: 'Failed to load artist hub configuration' },
      { status: 500 }
    );
  }
}
