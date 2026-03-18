import { NextResponse } from 'next/server';
import { testCases } from '@/lib/site-data';

export async function GET() {
  return NextResponse.json(testCases);
}
