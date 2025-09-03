export default async function handler(req, res) {
  const API_KEY = process.env.OBA_API_KEY;

  const ENDPOINTS = [
    { id: "evenementen-api", url: `https://zoeken.oba.nl/api/v1/search/?q=%20table:evenementen&authorization=${API_KEY}` },
    { id: "v-api", url: `https://zoeken.oba.nl/api/v1/search/?q=%20table:v&authorization=${API_KEY}` },
    { id: "prepr-api", url: `https://zoeken.oba.nl/api/v1/search/?q=%20table:prepr&authorization=${API_KEY}` },
    { id: "ebooks-api", url: `https://zoeken.oba.nl/ebooks/api/v1/search/?q=%20special:all&authorization=${API_KEY}` },
    { id: "wijzer-api", url: `https://zoeken.oba.nl/api/v1/holdings/root/OBA/?authorization=${API_KEY}` }
  ];

  try {
    const results = await Promise.all(
      ENDPOINTS.map(async (ep) => {
        try {
          const resp = await fetch(ep.url);
          if (!resp.ok) {
            return { id: ep.id, url: ep.url, ok: false, status: resp.status };
          }

          const text = await resp.text();
          const match = text.match(/<count>(\d+)<\/count>/);
          const count = match ? match[1] : null;

          return { id: ep.id, url: ep.url, ok: true, status: resp.status, count };
        } catch (e) {
          return { id: ep.id, url: ep.url, ok: false, status: 0, error: e.message };
        }
      })
    );

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(results);
  } catch (e) {
    console.error("Fout in /api/endpoints:", e);
    res.status(500).json({ error: "Interne fout bij ophalen endpoints" });
  }
}
