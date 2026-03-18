import { NextResponse } from 'next/server';

import { getRunRecordById } from '@/lib/site-data';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const record = getRunRecordById(id);

  if (!record) {
    return NextResponse.json(
      {
        error: 'Run not found'
      },
      { status: 404 }
    );
  }

  return NextResponse.json(record);
}
