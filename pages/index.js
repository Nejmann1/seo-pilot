import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>SEO Pilot</title>
        <meta name="description" content="Analyseér en hjemmeside og få SEO-anbefalinger" />
      </Head>
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>SEO‑Pilot</h1>
        <form onSubmit={handleAnalyze}>
          <input
            type="url"
            placeholder="Indtast URL (fx https://eksempel.dk)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: '60%', padding: '0.5rem' }}
          />
          <button type="submit" style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
            Analyser
          </button>
        </form>
        {loading && <p>Analyserer…</p>}
        {result && (
          <div style={{ marginTop: '1rem' }}>
            <h2>Analyse‑resultater</h2>
            <p><strong>Title:</strong> {result.title}</p>
            <p><strong>Title‑længde:</strong> {result.titleLength} tegn</p>
            <p><strong>Meta‑beskrivelse:</strong> {result.metaDescription || 'Ingen beskrivelse fundet'}</p>
            <p><strong>Antal ord:</strong> {result.wordCount}</p>
            <h3>Foreslåede nøgleord</h3>
            <ul>
              {result.keywords.map((kw, idx) => (
                <li key={idx}>{kw}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}
