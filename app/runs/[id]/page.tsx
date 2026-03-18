'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { RunRecord } from '@/lib/benchmark-types';
import { fixtures, testCasesDetailed } from '@/lib/site-data';

const statusLabel: Record<RunRecord['status'], string> = {
  queued: 'Queued',
  running: 'Running',
  passed: 'Passed',
  failed: 'Failed'
};

export default function RunDetailPage() {
  const params = useParams<{ id: string }>();
  const runId = params.id;
  const [run, setRun] = useState<RunRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadRun() {
      if (!runId) {
        return;
      }

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
    <main className="container runs-page">
      <section className="page-banner">
        <div>
          <p className="eyebrow">Run Detail</p>
          <h1>{runId || 'Loading...'}</h1>
          <p>
            Detail view for the current prototype run record. This page is backed by{' '}
            <code>/api/runs/:id</code> and shows the linked test case, evaluator notes, and input
            payload.
          </p>
        </div>
        <div className="page-actions">
          <Link href="/runs" className="link-button ghost">
            Back To Runs
          </Link>
        </div>
      </section>

      {loading ? (
        <section className="panel">
          <p>Loading run detail...</p>
        </section>
      ) : null}

      {error ? (
        <section className="panel">
          <p>Failed to load run detail: {error}</p>
        </section>
      ) : null}

      {!loading && !error && run ? (
        <div className="detail-layout">
          <section className="panel detail-main">
            <div className="run-card-top">
              <span className={`run-status ${run.status}`}>{statusLabel[run.status]}</span>
              <span className="run-id">{run.id}</span>
            </div>
            <h2>{testCase?.title ?? run.testCaseId}</h2>
            <p className="run-objective">{testCase?.objective ?? 'No linked test case found.'}</p>

            <dl className="detail-meta">
              <div>
                <dt>Domain</dt>
                <dd>{testCase?.domain ?? 'unknown'}</dd>
              </div>
              <div>
                <dt>Difficulty</dt>
                <dd>{testCase?.difficulty ?? 'N/A'}</dd>
              </div>
              <div>
                <dt>Score</dt>
                <dd>{run.score ?? 'Pending'}</dd>
              </div>
              <div>
                <dt>Started</dt>
                <dd>{run.startedAt ?? 'N/A'}</dd>
              </div>
              <div>
                <dt>Finished</dt>
                <dd>{run.finishedAt ?? 'N/A'}</dd>
              </div>
            </dl>

            <div className="detail-section">
              <h3>Agent Output</h3>
              <pre className="run-output">{run.agentOutput ?? 'No output has been recorded yet.'}</pre>
            </div>

            <div className="detail-section">
              <h3>Run Input</h3>
              <pre className="run-output">{JSON.stringify(run.input, null, 2)}</pre>
            </div>
          </section>

          <aside className="detail-side">
            <section className="panel">
              <h3>Evaluator Notes</h3>
              <ul className="side-list">
                {(run.evaluatorNotes ?? ['No evaluator notes yet.']).map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>

            <section className="panel">
              <h3>Expected Signals</h3>
              <ul className="side-list">
                {(testCase?.expectedSignals ?? ['No expected signals configured.']).map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </section>

            <section className="panel">
              <h3>Linked Fixtures</h3>
              <ul className="side-list">
                {relatedFixtures.length > 0 ? (
                  relatedFixtures.map((fixture) => (
                    <li key={fixture.id}>
                      <strong>{fixture.name}</strong>
                      <span>{fixture.description}</span>
                    </li>
                  ))
                ) : (
                  <li>No fixtures linked.</li>
                )}
              </ul>
            </section>
          </aside>
        </div>
      ) : null}
    </main>
  );
}
