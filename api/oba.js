// api/oba.js
export default async function handler(req, res) {
  const API_KEY = process.env.OBA_API_KEY;

  try {
    const response = await fetch(`https://zoeken.oba.nl/api/v1/status/?authorization=${API_KEY}`);

    if (!response.ok) {
      res.status(response.status).json({ error: 'Extern verzoek mislukt' });
      return;
    }

    const xml = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    console.error('Fout in /api/oba:', error);
    res.status(500).json({ error: 'Interne fout bij ophalen OBA XML' });
  }
}
