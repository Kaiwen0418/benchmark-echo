import { NextResponse } from 'next/server';

import { createRunRecord, runRecords } from '@/lib/site-data';
import type { CreateRunRequest } from '@/lib/benchmark-types';
import { getSupabaseConfigSummary } from '@/lib/supabase-config';

export async function GET() {
  return NextResponse.json({
    version: 'v1',
    persistence: getSupabaseConfigSummary(),
    runs: runRecords
  });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<CreateRunRequest>;

  if (!payload.testCaseId || typeof payload.testCaseId !== 'string') {
    return NextResponse.json(
      {
        error: 'testCaseId is required'
      },
      { status: 400 }
    );
  }

  const record = createRunRecord({
    testCaseId: payload.testCaseId,
    input: payload.input
  });

  if (!record) {
    return NextResponse.json(
      {
        error: 'Unknown testCaseId'
      },
      { status: 404 }
    );
  }

  return NextResponse.json(record, { status: 201 });
}
