'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { PhaserOfficeCanvas } from '@/components/live/phaser-office-canvas';
import { runRecords, testCasesDetailed } from '@/lib/site-data';

const zoneDefinitions = [
  { id: 'file-io', title: 'FILE IO', subtitle: '文档解析与抽取' },
  { id: 'web-ui', title: 'WEB UI', subtitle: '表单与页面操作' },
  { id: 'security', title: 'SECURITY', subtitle: '注入拦截与审计' },
  { id: 'mcp-skill', title: 'MCP / SKILL', subtitle: '协议发现与调用' }
] as const;

export default function LivePage() {
  const [selectedZoneId, setSelectedZoneId] = useState<(typeof zoneDefinitions)[number]['id']>('file-io');

  const liveRuns = useMemo(
    () =>
      runRecords
        .map((run) => ({
          run,
          testCase: testCasesDetailed.find((item) => item.id === run.testCaseId)
        }))
        .filter((item) => item.testCase),
    []
  );

  const zoneSummary = useMemo(
    () =>
      zoneDefinitions.map((zone) => {
        const matches = liveRuns.filter((item) => item.testCase?.domain === zone.id);

        return {
          ...zone,
          runs: matches,
          total: matches.length,
          active: matches.filter((item) => item.run.status === 'running').length,
          failed: matches.filter((item) => item.run.status === 'failed').length,
          passed: matches.filter((item) => item.run.status === 'passed').length
        };
      }),
    [liveRuns]
  );

  const totalStats = {
    active: liveRuns.filter((item) => item.run.status === 'running').length,
    failed: liveRuns.filter((item) => item.run.status === 'failed').length,
    passed: liveRuns.filter((item) => item.run.status === 'passed').length
  };

  const selectedZone = zoneSummary.find((zone) => zone.id === selectedZoneId) ?? zoneSummary[0];
  const reportTarget = selectedZone.runs[0]?.run.id ?? liveRuns[0]?.run.id ?? 'run-demo-001';
  const statusLine = `[${selectedZone.title}] ${selectedZone.total} total / ${selectedZone.active} active / ${selectedZone.failed} failed`;

  const workingActive = totalStats.active > 0;
  const securityFailed = (zoneSummary.find((zone) => zone.id === 'security')?.failed ?? 0) > 0;
  const syncActive = (zoneSummary.find((zone) => zone.id === 'mcp-skill')?.active ?? 0) > 0;

  return (
    <main className="live-shell original-live">
      <div className="original-stage-shell">
        <section id="main-stage" className="original-main-stage">
          <div id="game-container" className="original-game-container">
            <PhaserOfficeCanvas
              activeRuns={totalStats.active}
              failedRuns={totalStats.failed}
              passedRuns={totalStats.passed}
              selectedZoneId={selectedZoneId}
              securityFailed={securityFailed}
              syncActive={syncActive}
              workingActive={workingActive}
            />
            <div id="status-text" className="original-status-text">
              {statusLine}
            </div>
          </div>
        </section>

        <section id="bottom-panels" className="original-bottom-panels">
          <aside id="control-bar" className="original-control-bar">
            <div id="control-bar-title">BENCHMARK CONTROL</div>
            <div id="control-buttons" className="original-control-buttons">
              {zoneSummary.map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  className={selectedZoneId === zone.id ? 'pixel-button active' : 'pixel-button'}
                  onClick={() => setSelectedZoneId(zone.id)}
                >
                  {zone.title}
                </button>
              ))}
            </div>
            <div className="original-dock-actions">
              <Link href="/runs" className="pixel-link primary">
                START TEST
              </Link>
              <Link href={`/reports/${reportTarget}`} className="pixel-link">
                VIEW REPORT
              </Link>
              <Link href="/" className="pixel-link">
                BACK HOME
              </Link>
            </div>
          </aside>

          <aside id="memo-panel" className="original-memo-panel">
            <div id="memo-title">ZONE REPORT</div>
            <div id="memo-date">{selectedZone.title}</div>
            <div className="memo-decoration">─ ─ ─ ─ ─</div>
            <div id="memo-content" className="original-memo-content">
              <p>{selectedZone.subtitle}</p>
              <p>
                Active: {selectedZone.active} / Failed: {selectedZone.failed} / Passed:{' '}
                {selectedZone.passed}
              </p>
              <div className="original-run-links">
                {selectedZone.runs.length > 0 ? (
                  selectedZone.runs.map(({ run, testCase }) => (
                    <Link key={run.id} href={`/reports/${run.id}`} className="original-run-link">
                      <span className={`run-status ${run.status}`}>{run.status}</span>
                      <strong>{testCase?.title ?? run.testCaseId}</strong>
                    </Link>
                  ))
                ) : (
                  <p>No run in this zone yet.</p>
                )}
              </div>
            </div>
            <div className="memo-decoration">─ ─ ─ ─ ─</div>
          </aside>
        </section>
      </div>
    </main>
  );
}
