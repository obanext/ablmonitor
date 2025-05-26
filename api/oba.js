export default async function handler(req, res) {
  try {
    const response = await fetch('https://zoeken.oba.nl/monitor.ashx?import=true');

    if (!response.ok) {
      res.status(response.status).json({ error: 'Extern verzoek mislukt' });
      return;
    }

    const xml = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    res.status(500).json({ error: 'Interne fout bij ophalen OBA XML' });
  }
}
