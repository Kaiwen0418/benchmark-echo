'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import type { CreateRunRequest, RunRecord } from '@/lib/benchmark-types';
import type { AppLocale } from '@/lib/site-data';
import { localizeTestCase, testCasesDetailed } from '@/lib/site-data';
type RunsResponse = {
  version: string;
  runs: RunRecord[];
};

const copy = {
  zh: {
    eyebrow: '运行',
    title: 'Benchmark Runs',
    introBefore: '当前原型记录来自 ',
    introAfter: '。虽然仍是内存数据，但已经能展示运行状态、关联用例、分数和输入载荷。',
    backToLive: '返回 Live',
    createEyebrow: '创建运行',
    createTitle: '原型任务创建器',
    createBefore: '提交测试用例 id 和 JSON 输入，通过 ',
    createAfter: ' 创建新的内存 run 记录。',
    testCase: '测试用例',
    inputJson: '输入 JSON',
    creating: '创建中...',
    createRun: '创建运行',
    loading: '正在加载 runs...',
    failedPrefix: '加载 runs 失败：',
    noTestCase: '没有测试用例说明。',
    domain: '领域',
    score: '分数',
    started: '开始时间',
    pending: '待定',
    na: 'N/A',
    viewRunDetail: '查看运行详情',
    invalidJson: '输入载荷必须是有效 JSON。',
    runCreated: 'Run 已创建：',
    createFailed: '创建 run 失败。',
    status: {
      queued: '排队中',
      running: '运行中',
      passed: '已通过',
      failed: '失败'
    }
  },
  en: {
    eyebrow: 'Runs',
    title: 'Benchmark Runs',
    introBefore: 'Current prototype records are loaded from ',
    introAfter:
      '. This is still in-memory data, but the page now exposes run status, linked test cases, score, and input payloads.',
    backToLive: 'Back To Live',
    createEyebrow: 'Create Run',
    createTitle: 'Prototype Run Creator',
    createBefore: 'Submit a test case id and JSON input to create a new in-memory run record through ',
    createAfter: '.',
    testCase: 'Test Case',
    inputJson: 'Input JSON',
    creating: 'Creating...',
    createRun: 'Create Run',
    loading: 'Loading runs...',
    failedPrefix: 'Failed to load runs: ',
    noTestCase: 'No test case description.',
    domain: 'Domain',
    score: 'Score',
    started: 'Started',
    pending: 'Pending',
    na: 'N/A',
    viewRunDetail: 'View Run Detail',
    invalidJson: 'Input payload must be valid JSON.',
    runCreated: 'Run created: ',
    createFailed: 'Failed to create run.',
    status: {
      queued: 'Queued',
      running: 'Running',
      passed: 'Passed',
      failed: 'Failed'
    }
  },
  ja: {
    eyebrow: '実行',
    title: 'Benchmark Runs',
    introBefore: '現在の試作レコードは ',
    introAfter: ' から読み込まれます。まだメモリ実装ですが、実行状態、関連ケース、スコア、入力を確認できます。',
    backToLive: 'Live に戻る',
    createEyebrow: '実行作成',
    createTitle: 'プロトタイプ実行作成',
    createBefore: 'テストケース id と JSON 入力を送信し、',
    createAfter: ' で新しいメモリ run レコードを作成します。',
    testCase: 'テストケース',
    inputJson: '入力 JSON',
    creating: '作成中...',
    createRun: '実行を作成',
    loading: 'runs を読み込み中...',
    failedPrefix: 'runs の読み込みに失敗しました: ',
    noTestCase: 'テストケースの説明はありません。',
    domain: '領域',
    score: 'スコア',
    started: '開始',
    pending: '保留',
    na: 'N/A',
    viewRunDetail: '詳細を見る',
    invalidJson: '入力ペイロードは有効な JSON である必要があります。',
    runCreated: 'Run を作成しました: ',
    createFailed: 'Run の作成に失敗しました。',
    status: {
      queued: '待機中',
      running: '実行中',
      passed: '成功',
      failed: '失敗'
    }
  }
} as const;

export default function RunsPage() {
  const searchParams = useSearchParams();
  const embed = searchParams.get('embed') === '1';
  const requestedLang = searchParams.get('lang');
  const initialLocale =
    requestedLang === 'zh' || requestedLang === 'en' || requestedLang === 'ja'
      ? requestedLang
      : 'en';

  const [locale, setLocale] = useState<AppLocale>(initialLocale);
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState(testCasesDetailed[0]?.id ?? '');
  const [inputJson, setInputJson] = useState('{\n  "source": "manual-form"\n}');
  const [submitState, setSubmitState] = useState<'idle' | 'submitting'>('idle');
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const text = useMemo(() => copy[locale], [locale]);
  const localizedTestCases = useMemo(
    () => testCasesDetailed.map((testCase) => localizeTestCase(testCase, locale)),
    [locale]
  );

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

  async function loadRuns() {
    try {
      const response = await fetch('/api/runs');
      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }
      const payload = (await response.json()) as RunsResponse;
      setRuns(payload.runs);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    async function boot() {
      if (!active) return;
      await loadRuns();
    }
    boot();
    return () => {
      active = false;
    };
  }, []);

  async function handleCreateRun(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage(null);

    let parsedInput: Record<string, unknown> | undefined;

    if (inputJson.trim()) {
      try {
        parsedInput = JSON.parse(inputJson) as Record<string, unknown>;
      } catch {
        setFormMessage(text.invalidJson);
        return;
      }
    }

    setSubmitState('submitting');

    try {
      const payload: CreateRunRequest = {
        testCaseId: selectedTestCaseId,
        input: parsedInput
      };

      const response = await fetch('/api/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as RunRecord | { error?: string };

      if (!response.ok) {
        throw new Error(
          'error' in result && result.error ? result.error : `Request failed with ${response.status}`
        );
      }

      setFormMessage(`${text.runCreated}${(result as RunRecord).id}`);
      setInputJson('{\n  "source": "manual-form"\n}');
      await loadRuns();
    } catch (err) {
      setFormMessage(err instanceof Error ? err.message : text.createFailed);
    } finally {
      setSubmitState('idle');
    }
  }

  return (
    <main className={`container runs-page office-subpage ${embed ? 'office-embed' : ''}`}>
      <section className="page-banner office-banner">
        <div>
          <p className="eyebrow">{text.eyebrow}</p>
          <h1>{text.title}</h1>
          <p>
            {text.introBefore}
            <code>/api/runs</code>
            {text.introAfter}
          </p>
        </div>
        {!embed ? (
          <div className="page-actions">
            <Link href="/live" className="link-button office-link-button ghost">
              {text.backToLive}
            </Link>
          </div>
        ) : null}
      </section>

      <section className="panel office-panel run-form-panel">
        <div className="run-form-heading">
          <div>
            <p className="eyebrow">{text.createEyebrow}</p>
            <h2>{text.createTitle}</h2>
            <p>
              {text.createBefore}
              <code>POST /api/runs</code>
              {text.createAfter}
            </p>
          </div>
        </div>

        <form className="run-form" onSubmit={handleCreateRun}>
          <label className="form-field">
            <span>{text.testCase}</span>
            <select
              value={selectedTestCaseId}
              onChange={(event) => setSelectedTestCaseId(event.target.value)}
            >
              {localizedTestCases.map((testCase) => (
                <option key={testCase.id} value={testCase.id}>
                  {testCase.title} ({testCase.id})
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>{text.inputJson}</span>
            <textarea
              value={inputJson}
              onChange={(event) => setInputJson(event.target.value)}
              rows={8}
            />
          </label>

          <div className="form-actions">
            <button
              type="submit"
              className="link-button office-link-button"
              disabled={submitState === 'submitting'}
            >
              {submitState === 'submitting' ? text.creating : text.createRun}
            </button>
            {formMessage ? <p className="form-message">{formMessage}</p> : null}
          </div>
        </form>
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

      {!loading && !error ? (
        <section className="runs-grid">
          {runs.map((run) => {
            const rawTestCase = testCasesDetailed.find((item) => item.id === run.testCaseId);
            const testCase = rawTestCase ? localizeTestCase(rawTestCase, locale) : null;

            return (
              <article key={run.id} className="run-card office-panel">
                <div className="run-card-top">
                  <span className={`run-status ${run.status}`}>{text.status[run.status]}</span>
                  <span className="run-id">{run.id}</span>
                </div>
                <h2>{testCase?.title ?? run.testCaseId}</h2>
                <p className="run-objective">{testCase?.objective ?? text.noTestCase}</p>
                <dl className="run-meta">
                  <div>
                    <dt>{text.domain}</dt>
                    <dd>{testCase?.domain ?? 'unknown'}</dd>
                  </div>
                  <div>
                    <dt>{text.score}</dt>
                    <dd>{run.score ?? text.pending}</dd>
                  </div>
                  <div>
                    <dt>{text.started}</dt>
                    <dd>{run.startedAt ?? text.na}</dd>
                  </div>
                </dl>
                <pre className="run-input-preview">{JSON.stringify(run.input, null, 2)}</pre>
                <Link
                  href={embed ? `/runs/${run.id}?embed=1&lang=${locale}` : `/runs/${run.id}`}
                  className="link-button office-link-button"
                >
                  {text.viewRunDetail}
                </Link>
              </article>
            );
          })}
        </section>
      ) : null}
    </main>
  );
}
