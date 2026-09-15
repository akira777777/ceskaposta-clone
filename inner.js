function formatCzDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('cs-CZ');
}

function paragraphs(text) {
  return String(text || '')
    .split(/\n\n+/)
    .map((p) => `<p>${p.replace(/</g, '&lt;')}</p>`)
    .join('');
}

function archiveHtml(news) {
  const items = (news || []).map((item) => `
    <article class="inner-list-item">
      <div class="news-date-small">${formatCzDate(item.date)}</div>
      <a href="/aktuality/${item.id}">${item.title}</a>
      <p>${item.summary || ''}</p>
    </article>
  `).join('');
  return `
    <nav class="crumbs"><a href="/">Úvod</a> / Aktuality</nav>
    <h1>Aktuality</h1>
    <p class="inner-lead">Novinky České pošty. Klikněte na titulek a otevře se celý text.</p>
    <div class="inner-list">${items}</div>
  `;
}

function articleHtml(item) {
  return `
    <nav class="crumbs"><a href="/">Úvod</a> / <a href="/aktuality">Aktuality</a> / ${item.title}</nav>
    <p class="news-date-small">${formatCzDate(item.date)} · ${item.category || ''} · ${item.readTime || ''}</p>
    <h1>${item.title}</h1>
    <div class="inner-body">${paragraphs(item.content)}</div>
    <p><a href="/aktuality">Zpět na archiv aktualit</a></p>
  `;
}

function pageHtml(page) {
  return `
    <nav class="crumbs"><a href="/">Úvod</a> / ${page.title}</nav>
    <h1>${page.title}</h1>
    <div class="inner-body">${paragraphs(page.body)}</div>
    <p><a href="/">Zpět na úvodní stránku</a></p>
  `;
}

async function loadInner() {
  const root = document.getElementById('innerRoot');
  if (!root) return;
  const parts = location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  try {
    if (parts[0] === 'aktuality' && parts[1]) {
      const res = await fetch('/api/news/' + encodeURIComponent(parts[1]));
      const data = await res.json();
      if (!res.ok || !data.item) throw new Error(data.error || 'missing');
      document.title = data.item.title + ' - Česká pošta, s.p.';
      root.innerHTML = articleHtml(data.item);
    } else if (parts[0] === 'aktuality') {
      const res = await fetch('/api/news');
      const data = await res.json();
      document.title = 'Aktuality - Česká pošta, s.p.';
      root.innerHTML = archiveHtml(data.news);
    } else if (parts[0] === 'info' && parts[1]) {
      const res = await fetch('/api/pages/' + encodeURIComponent(parts[1]));
      const data = await res.json();
      if (!res.ok || !data.title) throw new Error(data.error || 'missing');
      document.title = data.title + ' - Česká pošta, s.p.';
      root.innerHTML = pageHtml(data);
    } else {
      document.title = 'Stránka nenalezena - Česká pošta, s.p.';
      root.innerHTML = '<h1>Stránka nenalezena</h1><p><a href="/">Zpět na úvod</a></p>';
    }
  } catch (err) {
    document.title = 'Stránka nenalezena - Česká pošta, s.p.';
    root.innerHTML = '<h1>Stránka nenalezena</h1><p>Požadovaný text se nepodařilo načíst.</p><p><a href="/">Zpět na úvod</a></p>';
  }
}

document.addEventListener('DOMContentLoaded', loadInner);
