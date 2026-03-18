'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { modules, nearTermTasks, roadmap } from '@/lib/site-data';

type Locale = 'zh' | 'en';
type Theme = 'light' | 'dark';

const copy = {
  zh: {
    badge: 'Serverless + Vercel',
    title: 'Agent 能力测试网站实施规划',
    description:
      '本站提供可扩展测试基座，围绕文件处理、页面操作、安全防护与 MCP/Skill 访问进行端到端评估，支持后续接入自动评分流水线。',
    metrics: ['一级测试域', '阶段里程碑', '规划阶段', '基础能力接口'],
    moduleTitles: ['多格式文件 IO', 'Web UI 交互自动化', '安全与越权防护', 'MCP / Skill 直连'],
    moduleDescriptions: [
      '覆盖 txt/json/csv/md/pdf 上传、解析、摘要与对比能力。',
      '验证 Agent 对表单、表格、富文本、异步弹窗等组件的操作稳定性。',
      '模拟 prompt injection、XSS、敏感信息泄露与权限绕过等场景。',
      '通过统一协议暴露测试资源，供 Agent 主动访问并执行能力测试。'
    ],
    moduleChecks: [
      ['格式识别准确率', '大文件分块性能', '错误恢复能力'],
      ['动作成功率', '重试机制', '对动态 DOM 的适配'],
      ['输入净化', '最小权限策略', '审计日志完整性'],
      ['MCP 资源可发现性', 'Skill 调用耗时', '失败回退策略']
    ],
    moduleSamples: [
      '样例场景：上传 PDF 合同并提取关键字段，校验结构化结果完整度。',
      '样例场景：在多步骤表单中填写数据、处理异步提示并提交。',
      '样例场景：向 Agent 注入越权指令，验证是否拒绝访问受限资源。',
      '样例场景：发现测试资源后调用 skill，记录失败回退与耗时。'
    ],
    roadmapEyebrow: 'Roadmap',
    roadmapTitle: '下一阶段应该交付什么',
    roadmapDescription: '页面不只展示方向，还明确标注阶段目标、当前状态和交付物。',
    roadmapStatuses: ['进行中', '进行中', '规划中'],
    roadmapTitles: ['测试基线成型', '最小可执行闭环', '评分与审计系统'],
    roadmapGoals: [
      '统一测试矩阵、阶段规划与能力声明，形成可读的基准测试骨架。',
      '接入上传、任务创建和结果查询，让单次测试可以真正跑通。',
      '建立跨模型、跨版本的可比较评分与审计能力。'
    ],
    roadmapDeliverables: [
      ['测试用例 schema', 'roadmap 展示页', '静态 fixtures 清单'],
      ['上传接口', '任务状态接口', '结果存储与报告原型'],
      ['评分规则', '聚合报告', '日志与可观测埋点']
    ],
    actionsEyebrow: 'Next Actions',
    actionsTitle: '最近两轮迭代建议',
    nearTermTasks: [
      '为每个领域补充更多 fixture 与评分细则，扩展用例覆盖面。',
      '将 runs 接口接到持久化存储，替换当前内存原型。',
      '新增前端任务详情页，展示 RunRecord 的状态、输入和评分。',
      '按领域拆分 fixtures、test cases 和 evaluator 配置。'
    ],
    apiTitle: 'API 入口示例',
    apiItems: [
      '/api/test-cases：获取当前测试矩阵。',
      '/api/agent-access：返回 MCP/Skill 访问能力声明。',
      '/api/roadmap：返回阶段规划与近期任务。',
      '/api/fixtures：返回 fixture 清单。',
      '/api/runs：返回运行记录或创建原型任务。'
    ],
    themeLabel: '主题',
    languageLabel: '语言',
    light: '浅色 Light',
    dark: '深色 Dark',
    chinese: '中文',
    english: '英文 English',
    runsCta: '查看运行记录',
    runsHint: '进入 runs 列表页，查看原型任务记录与详情。'
  },
  en: {
    badge: 'Serverless + Vercel',
    title: 'Agent Benchmark Site Roadmap',
    description:
      'This site provides an extensible benchmark base for end-to-end evaluation across file handling, page automation, security controls, and MCP/Skill access, with room for an automated scoring pipeline.',
    metrics: ['Test Domains', 'Milestones', 'Roadmap Phases', 'Core APIs'],
    moduleTitles: ['Multi-format File IO', 'Web UI Automation', 'Security and Access Control', 'MCP / Skill Connectivity'],
    moduleDescriptions: [
      'Covers upload, parsing, summarization, and comparison for txt/json/csv/md/pdf inputs.',
      'Validates how reliably an agent handles forms, tables, rich text, and async dialogs.',
      'Simulates prompt injection, XSS, sensitive data leaks, and permission bypass scenarios.',
      'Exposes benchmark resources through a unified protocol for direct agent access and execution.'
    ],
    moduleChecks: [
      ['Format detection accuracy', 'Large-file chunking performance', 'Error recovery'],
      ['Action success rate', 'Retry behavior', 'Dynamic DOM adaptation'],
      ['Input sanitization', 'Least-privilege policy', 'Audit trail completeness'],
      ['MCP discoverability', 'Skill latency', 'Fallback strategy']
    ],
    moduleSamples: [
      'Sample: upload a PDF contract, extract key fields, and verify structured output completeness.',
      'Sample: complete a multi-step form, handle async prompts, and submit successfully.',
      'Sample: inject an escalation prompt and verify the agent refuses restricted resources.',
      'Sample: discover resources, call a skill, and record timing plus fallback behavior.'
    ],
    roadmapEyebrow: 'Roadmap',
    roadmapTitle: 'What The Next Phase Should Deliver',
    roadmapDescription: 'The page should not just list directions. It should expose milestones, status, and concrete deliverables.',
    roadmapStatuses: ['In Progress', 'In Progress', 'Planned'],
    roadmapTitles: ['Baseline Definition', 'Minimum Executable Loop', 'Scoring and Audit System'],
    roadmapGoals: [
      'Unify the benchmark matrix, phase plan, and capability manifest into a readable baseline.',
      'Add uploads, run creation, and result retrieval so a single benchmark run can complete end to end.',
      'Establish comparable scoring and auditability across models and versions.'
    ],
    roadmapDeliverables: [
      ['Test case schema', 'Roadmap page', 'Static fixture catalog'],
      ['Upload API', 'Run status API', 'Stored result prototype'],
      ['Scoring rules', 'Aggregate report', 'Logging and observability']
    ],
    actionsEyebrow: 'Next Actions',
    actionsTitle: 'Recommended Near-term Iterations',
    nearTermTasks: [
      'Add more fixtures and scoring details for each domain to widen scenario coverage.',
      'Replace the in-memory runs prototype with persistent storage.',
      'Build a run detail page to show RunRecord status, input, and score.',
      'Split fixtures, test cases, and evaluator config by domain.'
    ],
    apiTitle: 'API Examples',
    apiItems: [
      '/api/test-cases: returns the active benchmark matrix.',
      '/api/agent-access: returns the MCP/Skill capability manifest.',
      '/api/roadmap: returns phase planning and near-term tasks.',
      '/api/fixtures: returns the fixture catalog.',
      '/api/runs: returns run records or creates a prototype run.'
    ],
    themeLabel: 'Theme',
    languageLabel: 'Language',
    light: 'Light',
    dark: 'Dark',
    chinese: 'Chinese',
    english: 'English',
    runsCta: 'Open Runs',
    runsHint: 'Go to the runs list page to inspect prototype records and detail views.'
  }
} as const;

const metricValues = [4, 3, 3, 5];

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>('zh');
  const [theme, setTheme] = useState<Theme>('light');
  const text = copy[locale];

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale === 'zh' ? 'zh-CN' : 'en';
    root.dataset.theme = theme;
  }, [locale, theme]);

  return (
    <main className="container">
      <section className="hero">
        <div className="hero-topbar">
          <p className="badge">{text.badge}</p>
          <div className="controls">
            <div className="toggle-group" aria-label={text.themeLabel}>
              <span>{text.themeLabel}</span>
              <button
                type="button"
                className={theme === 'light' ? 'toggle active' : 'toggle'}
                onClick={() => setTheme('light')}
              >
                {text.light}
              </button>
              <button
                type="button"
                className={theme === 'dark' ? 'toggle active' : 'toggle'}
                onClick={() => setTheme('dark')}
              >
                {text.dark}
              </button>
            </div>
            <div className="toggle-group" aria-label={text.languageLabel}>
              <span>{text.languageLabel}</span>
              <button
                type="button"
                className={locale === 'zh' ? 'toggle active' : 'toggle'}
                onClick={() => setLocale('zh')}
              >
                {text.chinese}
              </button>
              <button
                type="button"
                className={locale === 'en' ? 'toggle active' : 'toggle'}
                onClick={() => setLocale('en')}
              >
                {text.english}
              </button>
            </div>
          </div>
        </div>

        <h1>{text.title}</h1>
        <p>{text.description}</p>
        <div className="hero-metrics">
          {text.metrics.map((label, index) => (
            <div key={label}>
              <strong>{metricValues[index]}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="hero-links">
          <Link href="/runs" className="link-button">
            {text.runsCta}
          </Link>
          <p>{text.runsHint}</p>
        </div>
      </section>

      <section className="grid">
        {modules.map((item, index) => (
          <article key={item.title} className="card">
            <h2>{text.moduleTitles[index]}</h2>
            <p>{text.moduleDescriptions[index]}</p>
            <ul>
              {text.moduleChecks[index].map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
            <p className="sample">{text.moduleSamples[index]}</p>
          </article>
        ))}
      </section>

      <section className="roadmap">
        <div className="section-heading">
          <p className="eyebrow">{text.roadmapEyebrow}</p>
          <h2>{text.roadmapTitle}</h2>
          <p>{text.roadmapDescription}</p>
        </div>
        <div className="timeline">
          {roadmap.map((item, index) => (
            <article key={item.phase} className="timeline-card">
              <div className="timeline-top">
                <span className="phase">{item.phase}</span>
                <span className="status">{text.roadmapStatuses[index]}</span>
              </div>
              <h3>{text.roadmapTitles[index]}</h3>
              <p>{text.roadmapGoals[index]}</p>
              <ul>
                {text.roadmapDeliverables[index].map((deliverable) => (
                  <li key={deliverable}>{deliverable}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="next-actions">
        <div className="section-heading">
          <p className="eyebrow">{text.actionsEyebrow}</p>
          <h2>{text.actionsTitle}</h2>
        </div>
        <ol>
          {nearTermTasks.map((task, index) => (
            <li key={task}>{text.nearTermTasks[index]}</li>
          ))}
        </ol>
      </section>

      <section className="api-tip">
        <h2>{text.apiTitle}</h2>
        <p>
          {text.apiItems.map((item) => (
            <span key={item} className="api-line">
              <code>{item.split('：')[0].split(':')[0]}</code>
              {item.includes('：') ? `：${item.split('：').slice(1).join('：')}` : `: ${item.split(':').slice(1).join(':').trim()}`}
            </span>
          ))}
        </p>
      </section>
    </main>
  );
}
