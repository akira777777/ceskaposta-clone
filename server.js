const express = require('express');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname);
const PORT = process.env.PORT || 3002;
const app = express();

app.use(express.json());

// Only serve the demo document root; sensitive paths are blocked below.
app.use(express.static(PROJECT_ROOT, {
  dotfiles: 'ignore',
  index: false,
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-store');
  }
}));

app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.join(PROJECT_ROOT, 'index.html'));
});

// Mock news data (demo only, no external fetch)
const mockNews = [
    {
        id: 1,
        title: "Nové balíkové služby pro e-shopovatele",
        summary: "Ukázková zpráva pro výukové demo.",
        date: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 2,
        title: "Modernizace parcelních boxů",
        summary: "Ukázková zpráva pro výukové demo.",
        date: new Date(Date.now() - 172800000).toISOString(),
    },
    {
        id: 3,
        title: "Sledování zásilek online",
        summary: "Ukázková zpráva pro výukové demo.",
        date: new Date(Date.now() - 259200000).toISOString(),
    },
];

app.get('/api/news', (req, res) => {
  res.json({ news: mockNews });
});

// Anonymous demo analytics endpoint. No credentials, passwords, IP storage, or cookies.
app.post('/api/track', (req, res) => {
  const event = typeof req.body?.event === 'string' ? req.body.event.slice(0, 80) : 'unknown';
  console.log(`[demo analytics] ${event}`);
  res.status(204).end();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', demo: true });
});

// Block direct access to sensitive paths if ever requested.
app.use(['/data', '/backend', '/node_modules', '/test-results'], (req, res) => {
  res.status(404).send('Not found');
});

// SPA/demo fallback
app.get('*', (req, res) => {
  const accept = req.headers.accept || '';
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  if (accept.includes('text/html')) return res.sendFile(path.join(PROJECT_ROOT, 'index.html'));
  res.status(404).send('Not found');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`📮 Educational UI demo running at http://localhost:${PORT}`);
    console.log(`✅ Public files served from: ${PROJECT_ROOT}`);
  });
}

module.exports = app;
