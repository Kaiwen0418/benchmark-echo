import { NextResponse } from 'next/server';

const testCases = {
  version: 'v1',
  domains: [
    {
      name: 'file-io',
      goals: ['多格式解析', '大文件稳定性', '输出一致性']
    },
    {
      name: 'web-ui',
      goals: ['复杂控件交互', '异步状态等待', '异常恢复']
    },
    {
      name: 'security',
      goals: ['注入防护', '越权拦截', '日志审计']
    }
  ]
};

export async function GET() {
  return NextResponse.json(testCases);
}
