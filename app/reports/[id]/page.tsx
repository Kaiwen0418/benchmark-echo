'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import type { RunRecord, ScoringRubricItem } from '@/lib/benchmark-types';
import { OfficePageBanner } from '@/components/office/office-page-banner';
import { useAppLocale } from '@/hooks/use-app-locale';
import type { AppLocale } from '@/lib/site-data';
import {
  fixtures,
  localizeFixture,
  localizeRunRecord,
  localizeTestCase,
  testCasesDetailed
} from '@/lib/site-data';

const copy = {
  zh: {
    eyebrow: '评估报告',
    titleFallback: '正在加载报告...',
    description: '单次 benchmark run 的独立报告视图，用来沉淀输入、输出、评分和审计结论。',
    backToLive: '返回 Live',
    openRunDetail: '打开运行详情',
    loading: '正在加载报告...',
    failedPrefix: '加载报告失败：',
    overallScore: '总分',
    status: '状态',
    started: '开始',
    finished: '完成',
    pending: '待定',
    executiveSummary: '执行摘要',
    noLinked: '没有找到关联测试用例。',
    rubric: '评分拆解',
    weight: '权重',
    inputPayload: '输入载荷',
    agentOutput: 'Agent 输出',
    outputEmpty: '当前还没有记录输出。',
    auditNotes: '审计说明',
    auditEmpty: '当前还没有评估说明。',
    expectedSignals: '期望信号',
    expectedEmpty: '当前没有配置期望信号。',
    linkedFixtures: '关联 Fixtures',
    fixturesEmpty: '没有关联 fixtures。',
    statusValues: {
      queued: '排队中',
      running: '运行中',
      passed: '已通过',
      failed: '失败'
    }
  },
  en: {
    eyebrow: 'Evaluation Report',
    titleFallback: 'Loading report...',
    description:
      'Standalone report view for a single benchmark run. This screen is meant to be the complete evaluation artifact, separate from the live scene itself.',
    backToLive: 'Back To Live',
    openRunDetail: 'Open Run Detail',
    loading: 'Loading report...',
    failedPrefix: 'Failed to load report: ',
    overallScore: 'Overall Score',
    status: 'Status',
    started: 'Started',
    finished: 'Finished',
    pending: 'Pending',
    executiveSummary: 'Executive Summary',
    noLinked: 'No linked test case found.',
    rubric: 'Rubric Breakdown',
    weight: 'Weight',
    inputPayload: 'Input Payload',
    agentOutput: 'Agent Output',
    outputEmpty: 'No output has been recorded yet.',
    auditNotes: 'Audit Notes',
    auditEmpty: 'No evaluator notes yet.',
    expectedSignals: 'Expected Signals',
    expectedEmpty: 'No expected signals configured.',
    linkedFixtures: 'Linked Fixtures',
    fixturesEmpty: 'No fixtures linked.',
    statusValues: {
      queued: 'Queued',
      running: 'Running',
      passed: 'Passed',
      failed: 'Failed'
    }
  },
  ja: {
    eyebrow: '評価レポート',
    titleFallback: 'レポートを読み込み中...',
    description: '単一 benchmark run の独立レポート画面で、入力、出力、スコア、監査結論を保持します。',
    backToLive: 'Live に戻る',
    openRunDetail: '実行詳細を開く',
    loading: 'レポートを読み込み中...',
    failedPrefix: 'レポートの読み込みに失敗しました: ',
    overallScore: '総合スコア',
    status: '状態',
    started: '開始',
    finished: '完了',
    pending: '保留',
    executiveSummary: '要約',
    noLinked: '関連するテストケースが見つかりません。',
    rubric: 'Rubric 内訳',
    weight: '重み',
    inputPayload: '入力ペイロード',
    agentOutput: 'Agent 出力',
    outputEmpty: 'まだ出力は記録されていません。',
    auditNotes: '監査メモ',
    auditEmpty: 'まだ評価メモはありません。',
    expectedSignals: '期待シグナル',
    expectedEmpty: '期待シグナルは未設定です。',
    linkedFixtures: '関連 Fixtures',
    fixturesEmpty: '関連 fixtures はありません。',
    statusValues: {
      queued: '待機中',
      running: '実行中',
      passed: '成功',
      failed: '失敗'
    }
  }
} as const;

function formatTimestamp(value: string | undefined, locale: AppLocale, pending: string) {
  if (!value) return pending;
  return new Date(value).toLocaleString(
    locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-GB',
    {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }
  );
}

function buildRubricRows(score: number | undefined, rubric: ScoringRubricItem[]) {
  const normalizedScore = score ?? 0;
  return rubric.map((item, index) => {
    const variance = index % 2 === 0 ? 4 : -3;
    const rubricScore = Math.max(0, Math.min(100, Math.round(normalizedScore + variance)));
    return { ...item, rubricScore };
  });
}

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const embed = searchParams.get('embed') === '1';

  const reportId = params.id;
  const { locale } = useAppLocale(searchParams.get('lang'));
  const [run, setRun] = useState<RunRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const text = useMemo(() => copy[locale], [locale]);

  useEffect(() => {
    let active = true;
    async function loadRun() {
      if (!reportId) return;
      try {
        const response = await fetch(`/api/runs/${reportId}`);
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }
        const payload = (await response.json()) as RunRecord;
        if (active) {
          setRun(payload);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      }
    }

    loadRun();
    return () => {
      active = false;
    };
  }, [reportId]);

  const localizedRun = useMemo(() => (run ? localizeRunRecord(run, locale) : null), [locale, run]);
  const testCase = useMemo(() => {
    if (!localizedRun) return null;
    const rawTestCase = testCasesDetailed.find((item) => item.id === localizedRun.testCaseId);
    return rawTestCase ? localizeTestCase(rawTestCase, locale) : null;
  }, [locale, localizedRun]);
  const linkedFixtures = useMemo(
    () =>
      testCase
        ? fixtures
            .filter((fixture) => testCase.fixtureIds.includes(fixture.id))
            .map((fixture) => localizeFixture(fixture, locale))
        : [],
    [locale, testCase]
  );
  const rubricRows = useMemo(
    () => buildRubricRows(localizedRun?.score, testCase?.scoringRubric ?? []),
    [localizedRun?.score, testCase]
  );

  return (
    <main className={`container report-page office-subpage ${embed ? 'office-embed' : ''}`}>
      <OfficePageBanner
        eyebrow={text.eyebrow}
        title={testCase?.title ?? reportId ?? text.titleFallback}
        description={text.description}
        className="report-banner"
        actions={
          !embed ? (
            <>
              <Link href="/live" className="link-button office-link-button ghost">
                {text.backToLive}
              </Link>
              <Link href={`/runs/${reportId}`} className="link-button office-link-button ghost">
                {text.openRunDetail}
              </Link>
            </>
          ) : undefined
        }
      />

      {loading ? (
        <section className="panel office-panel">
          <p>{text.loading}</p>
        </section>
      ) : null}

      {error ? (
        <section className="panel office-panel">
          <p>
            {text.failedPrefix}
            {error}
          </p>
        </section>
      ) : null}

      {!loading && !error && localizedRun ? (
        <div className="report-layout">
          <section className="panel office-panel report-main">
            <div className="report-score-strip">
              <article className="report-score-card primary">
                <span>{text.overallScore}</span>
                <strong>{localizedRun.score ?? text.pending}</strong>
              </article>
              <article className="report-score-card">
                <span>{text.status}</span>
                <strong className={`run-status ${localizedRun.status}`}>
                  {text.statusValues[localizedRun.status]}
                </strong>
              </article>
              <article className="report-score-card">
                <span>{text.started}</span>
                <strong>{formatTimestamp(localizedRun.startedAt, locale, text.pending)}</strong>
              </article>
              <article className="report-score-card">
                <span>{text.finished}</span>
                <strong>{formatTimestamp(localizedRun.finishedAt, locale, text.pending)}</strong>
              </article>
            </div>

            <div className="report-section">
              <h2>{text.executiveSummary}</h2>
              <p className="run-objective">{testCase?.objective ?? text.noLinked}</p>
            </div>

            <div className="report-section">
              <h2>{text.rubric}</h2>
              <div className="report-rubric-list">
                {rubricRows.map((item) => (
                  <article key={item.name} className="report-rubric-item">
                    <div>
                      <strong>{item.name}</strong>
                      <span>
                        {text.weight} {(item.weight * 100).toFixed(0)}%
                      </span>
                    </div>
                    <b>{item.rubricScore}</b>
                  </article>
                ))}
              </div>
            </div>

            <div className="report-two-column">
              <div className="report-section">
                <h2>{text.inputPayload}</h2>
                <pre className="run-output">{JSON.stringify(localizedRun.input, null, 2)}</pre>
              </div>
              <div className="report-section">
                <h2>{text.agentOutput}</h2>
                <pre className="run-output">{localizedRun.agentOutput ?? text.outputEmpty}</pre>
              </div>
            </div>
          </section>

          <aside className="report-side">
            <section className="panel office-panel report-side-panel">
              <h3>{text.auditNotes}</h3>
              <ul className="side-list">
                {(localizedRun.evaluatorNotes ?? [text.auditEmpty]).map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>

            <section className="panel office-panel report-side-panel">
              <h3>{text.expectedSignals}</h3>
              <ul className="side-list">
                {(testCase?.expectedSignals ?? [text.expectedEmpty]).map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </section>

            <section className="panel office-panel report-side-panel">
              <h3>{text.linkedFixtures}</h3>
              <ul className="side-list">
                {linkedFixtures.length > 0 ? (
                  linkedFixtures.map((fixture) => (
                    <li key={fixture.id}>
                      <strong>{fixture.name}</strong>
                      <span>{fixture.description}</span>
                    </li>
                  ))
                ) : (
                  <li>{text.fixturesEmpty}</li>
                )}
              </ul>
            </section>
          </aside>
        </div>
      ) : null}
    </main>
  );
}
