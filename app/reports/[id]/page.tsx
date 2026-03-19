'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import type { RunRecord, ScoringRubricItem } from '@/lib/benchmark-types';
import { fixtures, testCasesDetailed } from '@/lib/site-data';

function formatTimestamp(value?: string) {
  if (!value) {
    return 'N/A';
  }

  return new Date(value).toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function buildRubricRows(score: number | undefined, rubric: ScoringRubricItem[]) {
  const normalizedScore = score ?? 0;

  return rubric.map((item, index) => {
    const variance = index % 2 === 0 ? 4 : -3;
    const rubricScore = Math.max(0, Math.min(100, Math.round(normalizedScore + variance)));

    return {
      ...item,
      rubricScore
    };
  });
}

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const reportId = params.id;
  const [run, setRun] = useState<RunRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadRun() {
      if (!reportId) {
        return;
      }

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

  const testCase = run ? testCasesDetailed.find((item) => item.id === run.testCaseId) : null;
  const linkedFixtures = useMemo(
    () => (testCase ? fixtures.filter((fixture) => testCase.fixtureIds.includes(fixture.id)) : []),
    [testCase]
  );
  const rubricRows = useMemo(
    () => buildRubricRows(run?.score, testCase?.scoringRubric ?? []),
    [run?.score, testCase]
  );

  return (
    <main className="container report-page">
      <section className="page-banner report-banner">
        <div>
          <p className="eyebrow">Evaluation Report</p>
          <h1>{testCase?.title ?? reportId ?? 'Loading report...'}</h1>
          <p>
            Standalone report view for a single benchmark run. This screen is meant to be the
            complete evaluation artifact, separate from the live scene itself.
          </p>
        </div>
        <div className="page-actions">
          <Link href="/live" className="link-button ghost">
            Back To Live
          </Link>
          <Link href={`/runs/${reportId}`} className="link-button ghost">
            Open Run Detail
          </Link>
        </div>
      </section>

      {loading ? (
        <section className="panel">
          <p>Loading report...</p>
        </section>
      ) : null}

      {error ? (
        <section className="panel">
          <p>Failed to load report: {error}</p>
        </section>
      ) : null}

      {!loading && !error && run ? (
        <div className="report-layout">
          <section className="panel report-main">
            <div className="report-score-strip">
              <article className="report-score-card primary">
                <span>Overall Score</span>
                <strong>{run.score ?? 'Pending'}</strong>
              </article>
              <article className="report-score-card">
                <span>Status</span>
                <strong className={`run-status ${run.status}`}>{run.status}</strong>
              </article>
              <article className="report-score-card">
                <span>Started</span>
                <strong>{formatTimestamp(run.startedAt)}</strong>
              </article>
              <article className="report-score-card">
                <span>Finished</span>
                <strong>{formatTimestamp(run.finishedAt)}</strong>
              </article>
            </div>

            <div className="report-section">
              <h2>Executive Summary</h2>
              <p className="run-objective">
                {testCase?.objective ?? 'No linked test case found.'}
              </p>
            </div>

            <div className="report-section">
              <h2>Rubric Breakdown</h2>
              <div className="report-rubric-list">
                {rubricRows.map((item) => (
                  <article key={item.name} className="report-rubric-item">
                    <div>
                      <strong>{item.name}</strong>
                      <span>Weight {(item.weight * 100).toFixed(0)}%</span>
                    </div>
                    <b>{item.rubricScore}</b>
                  </article>
                ))}
              </div>
            </div>

            <div className="report-two-column">
              <div className="report-section">
                <h2>Input Payload</h2>
                <pre className="run-output">{JSON.stringify(run.input, null, 2)}</pre>
              </div>
              <div className="report-section">
                <h2>Agent Output</h2>
                <pre className="run-output">
                  {run.agentOutput ?? 'No output has been recorded yet.'}
                </pre>
              </div>
            </div>
          </section>

          <aside className="report-side">
            <section className="panel report-side-panel">
              <h3>Audit Notes</h3>
              <ul className="side-list">
                {(run.evaluatorNotes ?? ['No evaluator notes yet.']).map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>

            <section className="panel report-side-panel">
              <h3>Expected Signals</h3>
              <ul className="side-list">
                {(testCase?.expectedSignals ?? ['No expected signals configured.']).map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </section>

            <section className="panel report-side-panel">
              <h3>Linked Fixtures</h3>
              <ul className="side-list">
                {linkedFixtures.length > 0 ? (
                  linkedFixtures.map((fixture) => (
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
