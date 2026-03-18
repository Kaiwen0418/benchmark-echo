'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import type { RunRecord } from '@/lib/benchmark-types';
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

  useEffect(() => {
    let active = true;

    async function loadRuns() {
      try {
        const response = await fetch('/api/runs');

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const payload = (await response.json()) as RunsResponse;

        if (active) {
          setRuns(payload.runs);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      }
    }

    loadRuns();

    return () => {
      active = false;
    };
  }, []);

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
