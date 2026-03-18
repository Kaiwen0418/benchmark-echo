import { NextResponse } from 'next/server';

import { roadmapPayload } from '@/lib/site-data';

export async function GET() {
  return NextResponse.json(roadmapPayload);
}
