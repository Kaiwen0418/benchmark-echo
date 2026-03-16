import { NextResponse } from 'next/server';

type Domain = 'form-fill' | 'table-filter' | 'modal-confirm';

const matrix: Record<Domain, { actions: string[]; expected: string }> = {
  'form-fill': {
    actions: ['focus input', 'type text', 'submit form'],
    expected: '表单校验通过并进入成功页'
  },
  'table-filter': {
    actions: ['open filters', 'select status=active', 'apply filter'],
    expected: '仅显示 active 行且保留分页状态'
  },
  'modal-confirm': {
    actions: ['click delete', 'wait modal', 'confirm'],
    expected: '弹窗关闭，删除动作落库并记录审计日志'
  }
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { domain?: Domain };
  const domain = body.domain ?? 'form-fill';

  if (!(domain in matrix)) {
    return NextResponse.json({ error: 'unknown domain' }, { status: 400 });
  }

  return NextResponse.json({
    domain,
    ...matrix[domain as Domain],
    hints: ['对动态 DOM 使用可重试选择器', '为异步请求设置超时与回退逻辑']
  });
}
