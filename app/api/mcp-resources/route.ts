import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    resources: [
      { id: 'test-cases', uri: '/api/test-cases', protocol: 'http+json' },
      { id: 'agent-access', uri: '/api/agent-access', protocol: 'http+json' },
      { id: 'file-io', uri: '/api/file-io', protocol: 'http+multipart' },
      { id: 'security-check', uri: '/api/security-check', protocol: 'http+json' }
    ],
    skillHooks: [
      { name: 'io-validator', entrypoint: '/api/file-io' },
      { name: 'security-prober', entrypoint: '/api/security-check' }
    ]
  });
}
