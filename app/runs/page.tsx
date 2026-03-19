'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import type { CreateRunRequest, RunRecord } from '@/lib/benchmark-types';
import { testCasesDetailed } from '@/lib/site-data';

type RunsResponse = {
  version: string;
  runs: RunRecord[];
};

const statusLabel: Record<RunRecord['status'], string> = {
  queued: 'Queued',
  running: 'Running',
  passed: 'Passed',
  failed: 'Failed'
};

export default function RunsPage() {
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState(testCasesDetailed[0]?.id ?? '');
  const [inputJson, setInputJson] = useState('{\n  "source": "manual-form"\n}');
  const [submitState, setSubmitState] = useState<'idle' | 'submitting'>('idle');
  const [formMessage, setFormMessage] = useState<string | null>(null);

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
      if (!active) {
        return;
      }

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
        setFormMessage('Input payload must be valid JSON.');
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as RunRecord | { error?: string };

      if (!response.ok) {
        throw new Error('error' in result && result.error ? result.error : `Request failed with ${response.status}`);
      }

      setFormMessage(`Run created: ${(result as RunRecord).id}`);
      setInputJson('{\n  "source": "manual-form"\n}');
      await loadRuns();
    } catch (err) {
      setFormMessage(err instanceof Error ? err.message : 'Failed to create run.');
    } finally {
      setSubmitState('idle');
    }
  }

  return (
    <main className="container runs-page">
      <section className="page-banner">
        <div>
          <p className="eyebrow">Runs</p>
          <h1>Benchmark Runs</h1>
          <p>
            Current prototype records are loaded from <code>/api/runs</code>. This is still
            in-memory data, but the page now exposes run status, linked test cases, score, and
            input payloads.
          </p>
        </div>
        <div className="page-actions">
          <Link href="/" className="link-button ghost">
            Back Home
          </Link>
        </div>
      </section>

      <section className="panel run-form-panel">
        <div className="run-form-heading">
          <div>
            <p className="eyebrow">Create Run</p>
            <h2>Prototype Run Creator</h2>
            <p>
              Submit a test case id and JSON input to create a new in-memory run record through{' '}
              <code>POST /api/runs</code>.
            </p>
          </div>
        </div>

        <form className="run-form" onSubmit={handleCreateRun}>
          <label className="form-field">
            <span>Test Case</span>
            <select
              value={selectedTestCaseId}
              onChange={(event) => setSelectedTestCaseId(event.target.value)}
            >
              {testCasesDetailed.map((testCase) => (
                <option key={testCase.id} value={testCase.id}>
                  {testCase.title} ({testCase.id})
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Input JSON</span>
            <textarea
              value={inputJson}
              onChange={(event) => setInputJson(event.target.value)}
              rows={8}
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="link-button" disabled={submitState === 'submitting'}>
              {submitState === 'submitting' ? 'Creating...' : 'Create Run'}
            </button>
            {formMessage ? <p className="form-message">{formMessage}</p> : null}
          </div>
        </form>
      </section>

      {loading ? (
        <section className="panel">
          <p>Loading runs...</p>
        </section>
      ) : null}

      {error ? (
        <section className="panel">
          <p>Failed to load runs: {error}</p>
        </section>
      ) : null}

      {!loading && !error ? (
        <section className="runs-grid">
          {runs.map((run) => {
            const testCase = testCasesDetailed.find((item) => item.id === run.testCaseId);

            return (
              <article key={run.id} className="run-card">
                <div className="run-card-top">
                  <span className={`run-status ${run.status}`}>{statusLabel[run.status]}</span>
                  <span className="run-id">{run.id}</span>
                </div>
                <h2>{testCase?.title ?? run.testCaseId}</h2>
                <p className="run-objective">{testCase?.objective ?? 'No test case description.'}</p>
                <dl className="run-meta">
                  <div>
                    <dt>Domain</dt>
                    <dd>{testCase?.domain ?? 'unknown'}</dd>
                  </div>
                  <div>
                    <dt>Score</dt>
                    <dd>{run.score ?? 'Pending'}</dd>
                  </div>
                  <div>
                    <dt>Started</dt>
                    <dd>{run.startedAt ?? 'N/A'}</dd>
                  </div>
                </dl>
                <pre className="run-input-preview">
                  {JSON.stringify(run.input, null, 2)}
                </pre>
                <Link href={`/runs/${run.id}`} className="link-button">
                  View Run Detail
                </Link>
              </article>
            );
          })}
        </section>
      ) : null}
    </main>
  );
}
