import { NextResponse } from 'next/server';

const allowedExtensions = ['txt', 'md', 'json', 'csv'];

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'missing file' }, { status: 400 });
  }

  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!allowedExtensions.includes(extension)) {
    return NextResponse.json(
      { error: `unsupported format: ${extension || 'unknown'}`, allowedExtensions },
      { status: 400 }
    );
  }

  const text = await file.text();
  const preview = text.slice(0, 180);
  const lines = text.split(/\r?\n/).length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return NextResponse.json({
    filename: file.name,
    extension,
    size: file.size,
    stats: { lines, words, characters: text.length },
    preview,
    checks: {
      parseSuccess: true,
      largeFileHint: file.size > 1_000_000 ? '建议走分块/流式处理' : '当前可直接处理'
    }
  });
}
