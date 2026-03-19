'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Locale = 'zh' | 'en';
type Theme = 'light' | 'dark';

const copy = {
  zh: {
    badge: 'Local Skill + Online Benchmark',
    title: '把 Agent 能力测试做成可浏览、可运行、可审计的网站',
    description:
      '首页负责解释平台能力，Live 地图负责实时演示执行现场，独立报告页负责沉淀单次评估的输入、输出、评分与审计结论。',
    themeLabel: '主题',
    languageLabel: '语言',
    light: '浅色 Light',
    dark: '深色 Dark',
    chinese: '中文',
    english: '英文 English',
    primaryCta: '打开 Live 控制室',
    secondaryCta: '查看示例报告',
    metrics: [
      { value: '4', label: '测试域' },
      { value: '3', label: '核心页面' },
      { value: '1', label: '实时地图' }
    ],
    featureEyebrow: 'What It Does',
    featureTitle: '一套站点，分成三个清晰界面',
    features: [
      {
        title: 'Landing Page',
        body: '讲清平台定位、测试范围、执行链路和入口，而不是把首页做成文档堆叠。'
      },
      {
        title: 'Live Phaser Scene',
        body: '用原版 Phaser 方式播放 spritesheet，把授权地图素材作为实时运行场景。'
      },
      {
        title: 'Evaluation Report',
        body: '每个 run 都有单独报告界面，集中展示分数、rubric、审计说明、输入输出和 fixture。'
      }
    ],
    scenarioEyebrow: 'Benchmark Flow',
    scenarioTitle: '本地 Skill 与在线网站如何配合',
    steps: [
      '本地 skill 或 agent 执行测试任务并上报状态。',
      '在线网站在 Live 页面显示 Phaser 场景和当前运行态。',
      '单次运行完成后，评估结果沉淀成独立报告页面。'
    ],
    pageEyebrow: 'Pages',
    pageTitle: '当前页面分工',
    pages: [
      {
        title: '/',
        body: '产品入口页，解释功能和能力边界。',
        cta: '回到首页'
      },
      {
        title: '/live',
        body: 'Phaser 实时地图，当前阶段优先复刻原版表现。',
        cta: '进入 Live'
      },
      {
        title: '/reports/[id]',
        body: '完整评估报告，查看样例运行的详细结论。',
        cta: '打开报告'
      }
    ]
  },
  en: {
    badge: 'Local Skill + Online Benchmark',
    title: 'Turn agent evaluation into a browsable, live, and auditable website',
    description:
      'The landing page explains the platform, the Live map shows the execution floor, and the standalone report page captures input, output, scoring, and audit conclusions for each run.',
    themeLabel: 'Theme',
    languageLabel: 'Language',
    light: 'Light',
    dark: 'Dark',
    chinese: 'Chinese',
    english: 'English',
    primaryCta: 'Open Live Command Center',
    secondaryCta: 'View Sample Report',
    metrics: [
      { value: '4', label: 'Test Domains' },
      { value: '3', label: 'Core Views' },
      { value: '1', label: 'Live Map' }
    ],
    featureEyebrow: 'What It Does',
    featureTitle: 'One product, split into three clear surfaces',
    features: [
      {
        title: 'Landing Page',
        body: 'Explain the product position, benchmark scope, execution loop, and entry points instead of turning the homepage into stacked docs.'
      },
      {
        title: 'Live Phaser Scene',
        body: 'Use the original Phaser spritesheet workflow so the authorized map assets behave like a live operations scene.'
      },
      {
        title: 'Evaluation Report',
        body: 'Every run gets a dedicated report view for score, rubric, audit reasoning, input/output, and linked fixtures.'
      }
    ],
    scenarioEyebrow: 'Benchmark Flow',
    scenarioTitle: 'How local skills and the online site work together',
    steps: [
      'A local skill or agent executes a benchmark task and pushes runtime state.',
      'The online site renders the current execution floor in the Live Phaser page.',
      'When a run finishes, the result is preserved as a standalone evaluation report.'
    ],
    pageEyebrow: 'Pages',
    pageTitle: 'Current page responsibilities',
    pages: [
      {
        title: '/',
        body: 'Product-facing entry page that explains scope and capabilities.',
        cta: 'Back Home'
      },
      {
        title: '/live',
        body: 'Real-time Phaser map focused on reproducing the original scene behavior.',
        cta: 'Open Live'
      },
      {
        title: '/reports/[id]',
        body: 'Full evaluation report for a single benchmark run.',
        cta: 'Open Report'
      }
    ]
  }
} as const;

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
    <main className="container landing-page">
      <section className="hero landing-hero">
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

        <div className="landing-hero-grid">
          <div className="landing-copy">
            <h1>{text.title}</h1>
            <p>{text.description}</p>
            <div className="hero-links">
              <Link href="/live" className="link-button">
                {text.primaryCta}
              </Link>
              <Link href="/reports/run-demo-001" className="link-button ghost light-ghost">
                {text.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="landing-preview-card">
            <div className="landing-preview-header">
              <span>Live</span>
              <span>Report</span>
            </div>
            <div className="landing-preview-body">
              {text.metrics.map((metric) => (
                <article key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-heading">
          <p className="eyebrow">{text.featureEyebrow}</p>
          <h2>{text.featureTitle}</h2>
        </div>
        <div className="landing-card-grid">
          {text.features.map((feature) => (
            <article key={feature.title} className="card landing-card">
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="section-heading">
          <p className="eyebrow">{text.scenarioEyebrow}</p>
          <h2>{text.scenarioTitle}</h2>
        </div>
        <ol className="landing-flow">
          {text.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="landing-section">
        <div className="section-heading">
          <p className="eyebrow">{text.pageEyebrow}</p>
          <h2>{text.pageTitle}</h2>
        </div>
        <div className="landing-card-grid">
          {text.pages.map((page) => {
            const href =
              page.title === '/live'
                ? '/live'
                : page.title === '/reports/[id]'
                  ? '/reports/run-demo-001'
                  : '/';

            return (
              <article key={page.title} className="card landing-card page-card">
                <code>{page.title}</code>
                <p>{page.body}</p>
                <Link href={href} className="link-button ghost">
                  {page.cta}
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
