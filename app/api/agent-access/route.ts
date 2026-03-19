import { NextResponse } from 'next/server';
import { agentAccessManifest } from '@/lib/site-data';
import { getSupabaseConfigSummary } from '@/lib/supabase-config';

export async function GET() {
  return NextResponse.json({
    ...agentAccessManifest,
    persistence: getSupabaseConfigSummary()
  });
}
