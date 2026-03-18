import { NextResponse } from 'next/server';

const patterns = [
  { id: 'prompt-injection', rule: /(ignore.*instruction|忽略.*规则)/i, level: 'high' },
  { id: 'xss', rule: /<script\b[^>]*>/i, level: 'high' },
  { id: 'secret-exfiltration', rule: /(api[_-]?key|token|password|密钥)/i, level: 'medium' }
] as const;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { input?: string };
  const input = body.input ?? '';

  const matches = patterns
    .filter((item) => item.rule.test(input))
    .map((item) => ({ id: item.id, level: item.level }));

  return NextResponse.json({
    inputLength: input.length,
    riskScore: matches.length * 35,
    verdict: matches.length > 0 ? 'blocked' : 'pass',
    matches,
    advice:
      matches.length > 0
        ? '建议触发人工复核、脱敏和最小权限执行策略。'
        : '未命中高风险规则，可进入下一步自动评测。'
  });
}
