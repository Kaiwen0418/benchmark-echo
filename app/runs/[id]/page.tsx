'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import type { RunRecord } from '@/lib/benchmark-types';
import { fixtures, testCasesDetailed } from '@/lib/site-data';

type Locale = 'zh' | 'en' | 'ja';

const copy = {
  zh: {
    eyebrow: '运行详情',
    titleFallback: '加载中...',
    introBefore: '当前原型 run 详情页，基于 ',
    introAfter: '，展示关联测试用例、评估说明和输入载荷。',
    openReport: '打开评估报告',
    backToRuns: '返回 Runs',
    loading: '正在加载运行详情...',
    failedPrefix: '加载运行详情失败：',
    noLinked: '没有找到关联测试用例。',
    domain: '领域',
    difficulty: '难度',
    score: '分数',
    started: '开始',
    finished: '完成',
    pending: '待定',
    na: 'N/A',
    output: 'Agent 输出',
    outputEmpty: '当前还没有记录输出。',
    input: '运行输入',
    notes: '评估说明',
    notesEmpty: '当前还没有评估说明。',
    signals: '期望信号',
    signalsEmpty: '当前没有配置期望信号。',
    fixtures: '关联 Fixtures',
    fixturesEmpty: '没有关联 fixtures。',
    status: {
      queued: '排队中',
      running: '运行中',
      passed: '已通过',
      failed: '失败'
    }
  },
  en: {
    eyebrow: 'Run Detail',
    titleFallback: 'Loading...',
    introBefore: 'Detail view for the current prototype run record. This page is backed by ',
    introAfter: ' and shows the linked test case, evaluator notes, and input payload.',
    openReport: 'Open Evaluation Report',
    backToRuns: 'Back To Runs',
    loading: 'Loading run detail...',
    failedPrefix: 'Failed to load run detail: ',
    noLinked: 'No linked test case found.',
    domain: 'Domain',
    difficulty: 'Difficulty',
    score: 'Score',
    started: 'Started',
    finished: 'Finished',
    pending: 'Pending',
    na: 'N/A',
    output: 'Agent Output',
    outputEmpty: 'No output has been recorded yet.',
    input: 'Run Input',
    notes: 'Evaluator Notes',
    notesEmpty: 'No evaluator notes yet.',
    signals: 'Expected Signals',
    signalsEmpty: 'No expected signals configured.',
    fixtures: 'Linked Fixtures',
    fixturesEmpty: 'No fixtures linked.',
    status: {
      queued: 'Queued',
      running: 'Running',
      passed: 'Passed',
      failed: 'Failed'
    }
  },
  ja: {
    eyebrow: '実行詳細',
    titleFallback: '読み込み中...',
    introBefore: '現在の試作 run 詳細画面です。 ',
    introAfter: ' を基に、関連テストケース、評価メモ、入力を表示します。',
    openReport: '評価レポートを開く',
    backToRuns: 'Runs に戻る',
    loading: '実行詳細を読み込み中...',
    failedPrefix: '実行詳細の読み込みに失敗しました: ',
    noLinked: '関連するテストケースが見つかりません。',
    domain: '領域',
    difficulty: '難度',
    score: 'スコア',
    started: '開始',
    finished: '完了',
    pending: '保留',
    na: 'N/A',
    output: 'Agent 出力',
    outputEmpty: 'まだ出力は記録されていません。',
    input: '実行入力',
    notes: '評価メモ',
    notesEmpty: 'まだ評価メモはありません。',
    signals: '期待シグナル',
    signalsEmpty: '期待シグナルは未設定です。',
    fixtures: '関連 Fixtures',
    fixturesEmpty: '関連 fixtures はありません。',
    status: {
      queued: '待機中',
      running: '実行中',
      passed: '成功',
      failed: '失敗'
    }
  }
} as const;

export default function RunDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const embed = searchParams.get('embed') === '1';
  const requestedLang = searchParams.get('lang');
  const initialLocale =
    requestedLang === 'zh' || requestedLang === 'en' || requestedLang === 'ja'
      ? requestedLang
      : 'en';

  const runId = params.id;
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [run, setRun] = useState<RunRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const text = useMemo(() => copy[locale], [locale]);

  useEffect(() => {
    try {
      const storedLang = window.localStorage.getItem('uiLang');
      if (storedLang === 'zh' || storedLang === 'en' || storedLang === 'ja') {
        setLocale(storedLang);
        return;
      }
    } catch {}
    setLocale(initialLocale);
  }, [initialLocale]);

  useEffect(() => {
    let active = true;

    async function loadRun() {
      if (!runId) return;
      try {
        const response = await fetch(`/api/runs/${runId}`);
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
  }, [runId]);

  const testCase = run ? testCasesDetailed.find((item) => item.id === run.testCaseId) : null;
  const relatedFixtures = testCase
    ? fixtures.filter((fixture) => testCase.fixtureIds.includes(fixture.id))
    : [];

  return (
    <main className={`container runs-page office-subpage ${embed ? 'office-embed' : ''}`}>
      <section className="page-banner office-banner">
        <div>
          <p className="eyebrow">{text.eyebrow}</p>
          <h1>{runId || text.titleFallback}</h1>
          <p>
            {text.introBefore}
            <code>/api/runs/:id</code>
            {text.introAfter}
          </p>
        </div>
        {!embed ? (
          <div className="page-actions">
            <Link
              href={embed ? `/reports/${runId}?embed=1&lang=${locale}` : `/reports/${runId}`}
              className="link-button office-link-button"
            >
              {text.openReport}
            </Link>
            <Link href="/runs" className="link-button office-link-button ghost">
              {text.backToRuns}
            </Link>
          </div>
        ) : null}
      </section>

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

      {!loading && !error && run ? (
        <div className="detail-layout">
          <section className="panel office-panel detail-main">
            <div className="run-card-top">
              <span className={`run-status ${run.status}`}>{text.status[run.status]}</span>
              <span className="run-id">{run.id}</span>
            </div>
            <h2>{testCase?.title ?? run.testCaseId}</h2>
            <p className="run-objective">{testCase?.objective ?? text.noLinked}</p>

            <dl className="detail-meta">
              <div>
                <dt>{text.domain}</dt>
                <dd>{testCase?.domain ?? 'unknown'}</dd>
              </div>
              <div>
                <dt>{text.difficulty}</dt>
                <dd>{testCase?.difficulty ?? text.na}</dd>
              </div>
              <div>
                <dt>{text.score}</dt>
                <dd>{run.score ?? text.pending}</dd>
              </div>
              <div>
                <dt>{text.started}</dt>
                <dd>{run.startedAt ?? text.na}</dd>
              </div>
              <div>
                <dt>{text.finished}</dt>
                <dd>{run.finishedAt ?? text.na}</dd>
              </div>
            </dl>

            <div className="detail-section">
              <h3>{text.output}</h3>
              <pre className="run-output">{run.agentOutput ?? text.outputEmpty}</pre>
            </div>

            <div className="detail-section">
              <h3>{text.input}</h3>
              <pre className="run-output">{JSON.stringify(run.input, null, 2)}</pre>
            </div>
          </section>

          <aside className="detail-side">
            <section className="panel office-panel">
              <h3>{text.notes}</h3>
              <ul className="side-list">
                {(run.evaluatorNotes ?? [text.notesEmpty]).map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>

            <section className="panel office-panel">
              <h3>{text.signals}</h3>
              <ul className="side-list">
                {(testCase?.expectedSignals ?? [text.signalsEmpty]).map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </section>

            <section className="panel office-panel">
              <h3>{text.fixtures}</h3>
              <ul className="side-list">
                {relatedFixtures.length > 0 ? (
                  relatedFixtures.map((fixture) => (
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
