module.exports = (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const data = JSON.parse(body || '{}');
      const text = String(data.message || data.prompt || '');
      const reply = (require('./dashboard').anthropicApiHook || function(){return 'ok';})(text);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, reply }));
    } catch (e) {
      res.status(500).json({ ok: false, error: String(e) });
    }
  });
};
