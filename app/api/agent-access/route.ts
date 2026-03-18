import { NextResponse } from 'next/server';
import { agentAccessManifest } from '@/lib/site-data';

export async function GET() {
  return NextResponse.json(agentAccessManifest);
}
