import { NextResponse } from 'next/server';

const manifest = {
  mcp: {
    enabled: true,
    discovery: '/api/mcp-resources',
    resources: ['test-cases', 'fixtures', 'security-scenarios'],
    auth: 'token + scoped roles'
  },
  skill: {
    enabled: true,
    examples: ['io-validator', 'ui-runner', 'security-prober'],
    fallback: 'disable-and-log'
  }
};

export async function GET() {
  return NextResponse.json(manifest);
}
