const LIVE_SRC = '/star-office-original/index.html?demo=1';

export default function LivePage() {
  return (
    <main className="live-embed-shell">
      <iframe
        title="Star Office Original UI"
        src={LIVE_SRC}
        className="live-embed-frame"
        allow="fullscreen"
      />
    </main>
  );
}
