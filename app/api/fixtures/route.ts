import { NextResponse } from 'next/server';

import { fixtures } from '@/lib/site-data';

export async function GET() {
  return NextResponse.json({
    version: 'v1',
    fixtures
  });
}
