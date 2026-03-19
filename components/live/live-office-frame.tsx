const LIVE_OFFICE_SRC = '/live-office/index.html?demo=1';

export function LiveOfficeFrame() {
  return (
    <main className="live-embed-shell">
      <iframe
        title="Live Office UI"
        src={LIVE_OFFICE_SRC}
        className="live-embed-frame"
        allow="fullscreen"
      />
    </main>
  );
}
