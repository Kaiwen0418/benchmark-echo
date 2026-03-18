'use client';

import { useEffect, useMemo, useState } from 'react';
import { TestConsole } from './components';

type Lang = 'zh' | 'en';
type Theme = 'light' | 'dark';

type Module = { title: string; description: string; checks: string[] };

type Copy = {
  badge: string;
  heroTitle: string;
  heroBody: string;
  languageLabel: string;
  themeLabel: string;
  zhButton: string;
  enButton: string;
  lightButton: string;
  darkButton: string;
  modules: Module[];
  apiTitle: string;
  apiLines: string[];
};

const copyMap: Record<Lang, Copy> = {
  zh: {
    badge: 'Serverless + Vercel',
    heroTitle: 'Agent 能力测试网站实施规划与原型',
    heroBody:
      '本站提供可扩展测试基座，围绕文件处理、页面操作、安全防护与 MCP/Skill 访问进行端到端评估，支持后续接入自动评分流水线。',
    languageLabel: '语言',
    themeLabel: '主题',
    zhButton: '中文',
    enButton: 'English',
    lightButton: '浅色',
    darkButton: '深色',
    modules: [
      {
        title: '多格式文件 IO',
        description: '覆盖 txt/json/csv/md 上传、解析、摘要与对比能力。',
        checks: ['格式识别准确率', '大文件分块性能', '错误恢复能力']
      },
      {
        title: 'Web UI 交互自动化',
        description: '验证 Agent 对表单、表格、富文本、异步弹窗等组件的操作稳定性。',
        checks: ['动作成功率', '重试机制', '对动态 DOM 的适配']
      },
      {
        title: '安全与越权防护',
        description: '模拟 prompt injection、XSS、敏感信息泄露与权限绕过等场景。',
        checks: ['输入净化', '最小权限策略', '审计日志完整性']
      },
      {
        title: 'MCP / Skill 直连',
        description: '通过统一协议暴露测试资源，供 Agent 主动访问并执行能力测试。',
        checks: ['MCP 资源可发现性', 'Skill 调用耗时', '失败回退策略']
      }
    ],
    apiTitle: 'API 入口示例',
    apiLines: [
      '/api/test-cases：获取当前测试矩阵。',
      '/api/agent-access：返回 MCP/Skill 访问能力声明。',
      '/api/file-io：上传并解析文本类文件。',
      '/api/security-check：进行输入风险检测。'
    ]
  },
  en: {
    badge: 'Serverless + Vercel',
    heroTitle: 'Agent Capability Test Site Plan & Prototype',
    heroBody:
      'This site provides an extensible test foundation for end-to-end evaluation across file processing, page operations, security controls, and MCP/Skill access.',
    languageLabel: 'Language',
    themeLabel: 'Theme',
    zhButton: '中文',
    enButton: 'English',
    lightButton: 'Light',
    darkButton: 'Dark',
    modules: [
      {
        title: 'Multi-format File IO',
        description: 'Covers upload, parsing, summarization and comparison for txt/json/csv/md files.',
        checks: ['Format recognition accuracy', 'Large-file chunking performance', 'Error recovery ability']
      },
      {
        title: 'Web UI Interaction Automation',
        description: 'Validates agent stability on forms, tables, rich text widgets and async modals.',
        checks: ['Action success rate', 'Retry strategy', 'Dynamic DOM adaptability']
      },
      {
        title: 'Security & Privilege Protection',
        description: 'Simulates prompt injection, XSS, sensitive leak and permission bypass scenarios.',
        checks: ['Input sanitization', 'Least-privilege policy', 'Audit-log integrity']
      },
      {
        title: 'MCP / Skill Direct Access',
        description: 'Exposes test resources via unified protocols for direct agent-driven evaluation.',
        checks: ['MCP discoverability', 'Skill invocation latency', 'Failure fallback strategy']
      }
    ],
    apiTitle: 'API Endpoints',
    apiLines: [
      '/api/test-cases: fetch test matrix.',
      '/api/agent-access: return MCP/Skill capability manifest.',
      '/api/file-io: upload and parse text-like files.',
      '/api/security-check: run input risk inspection.'
    ]
  }
};

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('zh');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const saved = localStorage.getItem('theme') as Theme | null;
    const initial = saved ?? (media.matches ? 'dark' : 'light');
    setTheme(initial);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const copy = useMemo(() => copyMap[lang], [lang]);

  return (
    <main className="container">
      <section className="hero">
        <div className="hero-topbar">
          <p className="badge">{copy.badge}</p>
          <div className="toggles" role="group" aria-label="language and theme toggles">
            <span>{copy.languageLabel}</span>
            <button type="button" className={lang === 'zh' ? 'switch active' : 'switch'} onClick={() => setLang('zh')}>
              {copy.zhButton}
            </button>
            <button type="button" className={lang === 'en' ? 'switch active' : 'switch'} onClick={() => setLang('en')}>
              {copy.enButton}
            </button>
            <span>{copy.themeLabel}</span>
            <button
              type="button"
              className={theme === 'light' ? 'switch active' : 'switch'}
              onClick={() => setTheme('light')}
            >
              {copy.lightButton}
            </button>
            <button type="button" className={theme === 'dark' ? 'switch active' : 'switch'} onClick={() => setTheme('dark')}>
              {copy.darkButton}
            </button>
          </div>
        </div>
        <h1>{copy.heroTitle}</h1>
        <p>{copy.heroBody}</p>
      </section>

      <section className="grid">
        {copy.modules.map((item) => (
          <article key={item.title} className="card">
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <ul>
              {item.checks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <TestConsole lang={lang} />

      <section className="api-tip">
        <h2>{copy.apiTitle}</h2>
        <p>
          {copy.apiLines.map((line) => (
            <span key={line}>
              <code>{line}</code>
              <br />
            </span>
          ))}
        </p>
      </section>
    </main>
  );
}
