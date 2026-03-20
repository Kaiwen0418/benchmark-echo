'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { OfficeLanguageSwitch } from '@/components/office/office-language-switch';
import { OfficePageBanner } from '@/components/office/office-page-banner';
import { useAppLocale } from '@/hooks/use-app-locale';

const copy = {
  zh: {
    badge: 'Benchmark Brief',
    title: '把 Agent 能力测试做成可浏览、可运行、可审计的网站',
    description:
      '这里是平台说明页。Live 地图负责实时演示执行现场，任务页负责创建与浏览运行记录，报告页负责沉淀评估结果。',
    languageLabel: '语言',
    chinese: '中文',
    english: '英文 English',
    japanese: '日文 Japanese',
    primaryCta: '打开 Runs',
    secondaryCta: '查看示例报告',
    metrics: [
      { value: '4', label: '测试域' },
      { value: '3', label: '核心页面' },
      { value: '1', label: '实时地图' }
    ],
    featureEyebrow: 'Platform',
    featureTitle: '当前站点由三块界面构成',
    features: [
      {
        title: 'Live Office',
        body: '原版 Phaser 像素办公室作为主入口，承载地图、状态和弹窗导航。'
      },
      {
        title: 'Runs',
        body: '创建测试、查看运行列表、进入单条 run 的详细上下文。'
      },
      {
        title: 'Reports',
        body: '查看评分、rubric、输入输出和审计说明。'
      }
    ]
  },
  en: {
    badge: 'Benchmark Brief',
    title: 'Turn agent evaluation into a browsable, runnable, and auditable website',
    description:
      'This is the platform overview. The Live office handles the real-time scene, the runs page handles task creation and listing, and reports preserve evaluation artifacts.',
    languageLabel: 'Language',
    chinese: 'Chinese',
    english: 'English',
    japanese: 'Japanese',
    primaryCta: 'Open Runs',
    secondaryCta: 'View Sample Report',
    metrics: [
      { value: '4', label: 'Domains' },
      { value: '3', label: 'Core Views' },
      { value: '1', label: 'Live Scene' }
    ],
    featureEyebrow: 'Platform',
    featureTitle: 'The current site is split into three surfaces',
    features: [
      {
        title: 'Live Office',
        body: 'The imported Phaser pixel office acts as the primary entry and hosts scene navigation through modals.'
      },
      {
        title: 'Runs',
        body: 'Create benchmark tasks, browse run records, and inspect single-run context.'
      },
      {
        title: 'Reports',
        body: 'Review scores, rubric rows, input/output, and audit notes.'
      }
    ]
  },
  ja: {
    badge: 'Benchmark Brief',
    title: 'Agent 評価を、閲覧できて、実行できて、監査できる Web サイトにする',
    description:
      'ここはプラットフォーム概要です。Live オフィスがリアルタイムのシーンを担当し、Runs が実行管理を担当し、Reports が評価結果を保存します。',
    languageLabel: '言語',
    chinese: '中国語',
    english: '英語',
    japanese: '日本語',
    primaryCta: 'Runs を開く',
    secondaryCta: 'サンプルレポートを見る',
    metrics: [
      { value: '4', label: '領域' },
      { value: '3', label: '主要画面' },
      { value: '1', label: 'Live シーン' }
    ],
    featureEyebrow: 'Platform',
    featureTitle: '現在のサイトは 3 つの面で構成されています',
    features: [
      {
        title: 'Live Office',
        body: '導入した Phaser ピクセルオフィスが主入口となり、モーダル経由で各画面へ移動します。'
      },
      {
        title: 'Runs',
        body: 'ベンチマークタスクの作成、実行記録の確認、単体 run の詳細確認を行います。'
      },
      {
        title: 'Reports',
        body: 'スコア、rubric、入力出力、監査メモを確認します。'
      }
    ]
  }
} as const;

export default function LandingPage() {
  const searchParams = useSearchParams();
  const embed = searchParams.get('embed') === '1';
  const { locale, setLocale } = useAppLocale(searchParams.get('lang'));
  const text = useMemo(() => copy[locale], [locale]);

  return (
    <main className={`container office-subpage landing-page ${embed ? 'office-embed' : ''}`}>
      <OfficePageBanner
        eyebrow={text.badge}
        title={text.title}
        description={text.description}
        actions={
          <div className="office-inline-actions">
            <OfficeLanguageSwitch
              locale={locale}
              onChange={setLocale}
              ariaLabel={text.languageLabel}
              labels={{ zh: text.chinese, en: text.english, ja: text.japanese }}
            />
          </div>
        }
      />

      <section className="panel office-panel office-summary-panel">
        <div className="landing-hero-grid office-hero-grid">
          <div className="landing-copy">
            <div className="hero-links">
              <Link href={embed ? '/runs?embed=1' : '/runs'} className="link-button office-link-button">
                {text.primaryCta}
              </Link>
              <Link
                href={embed ? '/reports/run-demo-001?embed=1' : '/reports/run-demo-001'}
                className="link-button office-link-button ghost"
              >
                {text.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="landing-preview-card office-preview-card">
            <div className="landing-preview-header">
              <span>Live</span>
              <span>Runs</span>
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
            <article key={feature.title} className="panel office-panel landing-card office-card">
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
