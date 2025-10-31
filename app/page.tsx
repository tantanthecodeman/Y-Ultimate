import Link from 'next/link';
export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>Y-Ultimate — Dev Home</h1>
      <p style={{ marginTop: 0, marginBottom: 20 }}>
        This repo uses a single Next.js app. Work areas:
      </p>
      <ul>
        <li>
          <Link href="/tournament">Tournament management</Link> — (work here: <code>app/tournament</code>)
        </li>
        <li>
          <Link href="/coaching">Coaching management</Link> — (work here: <code>app/coaching</code>)
        </li>
      </ul>

      <hr style={{ margin: '20px 0' }} />

      <p style={{ fontSize: 13, color: '#666' }}>
        Quick note: focus on functionality first. UI/UX polish can come later.
      </p>
    </main>
  );
}



