import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Agent Testbed on Vercel',
  description: '用于验证 Agent 的多格式文件 IO、Web UI 交互、安全能力和 MCP/Skill 访问的测试网站'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
