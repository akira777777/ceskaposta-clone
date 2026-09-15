/**
 * Česká pošta - Official Portal Client Logic (Production Demo)
 * Safe educational implementation:
 * - No credential exfiltration or keystroke recording.
 * - Interactive parcel tracking, postage calculator, branch finder, and client portal.
 */

// ============================================================================
// STATE & CONSTANTS
// ============================================================================
let currentTrackingData = null;
let currentBranchesData = [];
let activeUser = null;

// ============================================================================
// MODALS & NAVIGATION
// ============================================================================

function showLoginModal() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  setTimeout(() => {
    const input = document.getElementById('username');
    if (input) input.focus();
  }, 60);
}

function hideLoginModal() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;
  modal.classList.add('hidden');
}

function showSettings() {
  const modal = document.getElementById('settingsModal');
  if (modal) {
    modal.classList.remove('hidden');
  } else {
    showDemoToast('Nastavení: Zobrazení voleb přístupnosti a motivu (Demo).');
  }
}

function hideSettings() {
  document.getElementById('settingsModal')?.classList.add('hidden');
}

function showUserPortal() {
  const modal = document.getElementById('userPortalModal');
  if (modal) modal.classList.remove('hidden');
}

function hideUserPortal() {
  document.getElementById('userPortalModal')?.classList.add('hidden');
}

function showNewsModal(id) {
  fetch(`/api/news/${id}`)
    .then(r => r.json())
    .then(data => {
      if (!data.item) return;
      const modal = document.getElementById('newsModal');
      const title = document.getElementById('newsModalTitle');
      const meta = document.getElementById('newsModalMeta');
      const body = document.getElementById('newsModalBody');
      if (modal && title && meta && body) {
        title.textContent = data.item.title;
        meta.textContent = `${data.item.category} • ${new Date(data.item.date).toLocaleDateString('cs-CZ')} • ${data.item.readTime}`;
        body.textContent = data.item.content || data.item.summary;
        modal.classList.remove('hidden');
      }
    })
    .catch(() => showDemoToast('Článek se nepodařilo načíst.'));
}

function hideNewsModal() {
  document.getElementById('newsModal')?.classList.add('hidden');
}

// ============================================================================
// COOKIE CONSENT BANNER & PREFERENCES
// ============================================================================

function acceptAllCookies() {
  try {
    localStorage.setItem('cookieConsent', 'all');
    localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, analytical: true, functional: true, marketing: true }));
  } catch (e) {}
  document.getElementById('cookieBanner')?.classList.add('hidden');
  showDemoToast('Nastavení cookies bylo uloženo.');
}

function declineAllCookies() {
  try {
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, analytical: false, functional: false, marketing: false }));
  } catch (e) {}
  document.getElementById('cookieBanner')?.classList.add('hidden');
  showDemoToast('Pouze nezbytné cookies byly povoleny.');
}

function showCookieSettings() {
  const modal = document.getElementById('cookieModal');
  if (modal) modal.classList.remove('hidden');
}

function hideCookieSettings() {
  document.getElementById('cookieModal')?.classList.add('hidden');
}

function saveCookiePreferences() {
  const analytical = document.getElementById('cookieAnalytical')?.checked || false;
  const functional = document.getElementById('cookieFunctional')?.checked || false;
  const marketing = document.getElementById('cookieMarketing')?.checked || false;

  try {
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookiePreferences', JSON.stringify({
      essential: true,
      analytical,
      functional,
      marketing
    }));
  } catch (e) {}

  hideCookieSettings();
  document.getElementById('cookieBanner')?.classList.add('hidden');
  showDemoToast('Předvolby cookies byly úspěšně uloženy.');
}

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================

function showDemoToast(message) {
  let toast = document.getElementById('demoToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'demoToast';
    toast.setAttribute('role', 'status');
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#00386b;color:#fff;padding:12px 20px;border-radius:8px;z-index:2500;box-shadow:0 8px 24px rgba(0,0,0,.25);font-size:14px;max-width:90vw;text-align:center;font-weight:600;border:1px solid #ffcc00;';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.display = 'block';
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => { toast.style.display = 'none'; }, 3200);
}

// ============================================================================
// AUTHENTICATION (SAFE DEMO SESSION)
// ============================================================================

async function handleDemoLogin(event) {
  if (event) event.preventDefault();
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const form = document.getElementById('credentialForm');
  const submitBtn = form?.querySelector('.btn-primary');
  const username = (usernameInput?.value || '').trim();
  const password = passwordInput?.value || '';

  if (!username || !password) {
    showDemoToast('Vyplňte prosím uživatelské jméno i heslo (demo, nic se neodesílá).');
    return false;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Ověřuji (demo)...';
  }

  // Artificial brief delay for realistic responsiveness
  await new Promise(r => setTimeout(r, 600));

  // Security guarantee: clear password immediately
  if (passwordInput) passwordInput.value = '';

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    submitBtn.textContent = 'Přihlásit se';
  }

  hideLoginModal();

  // Activate authenticated demo session
  activeUser = {
    username: username,
    displayName: username.includes('@') ? username.split('@')[0] : username,
    accountType: 'Klientská zóna'
  };

  updateUserInterfaceForAuth();
  showDemoToast('Demo: Přihlášení proběhlo lokálně. Vítejte v Klientské zóně!');
  return false;
}

// Backwards compatibility alias
function captureAndRedirect(event) {
  return handleDemoLogin(event);
}

function updateUserInterfaceForAuth() {
  const loginBtn = document.getElementById('headerLoginBtn');
  if (loginBtn && activeUser) {
    loginBtn.innerHTML = `👤 ${activeUser.displayName} <span style="font-size:11px;background:#10b981;color:#fff;padding:2px 6px;border-radius:99px;margin-left:4px;">Aktivní</span>`;
    loginBtn.onclick = showUserPortal;
  }
}

function logoutUser() {
  activeUser = null;
  const loginBtn = document.getElementById('headerLoginBtn');
  if (loginBtn) {
    loginBtn.innerHTML = `👤 Přihlásit se`;
    loginBtn.onclick = showLoginModal;
  }
  hideUserPortal();
  showDemoToast('Byli jste úspěšně odhlášeni.');
}

// ============================================================================
// PARCEL TRACKING (Sledování zásilek)
// ============================================================================

async function trackParcel(parcelId) {
  const idInput = document.getElementById('trackingCodeInput');
  const code = (parcelId || idInput?.value || '').trim();

  if (!code) {
    showDemoToast('Zadejte prosím číslo zásilky (např. DR123456789CZ).');
    idInput?.focus();
    return;
  }

  const resultContainer = document.getElementById('trackingResult');
  if (!resultContainer) return;

  resultContainer.classList.remove('hidden');
  resultContainer.innerHTML = '<div style="padding:24px;text-align:center;color:#00386b;font-weight:600;"><span class="loading-spinner"></span> Načítám stav zásilky z databáze pošty...</div>';

  try {
    const res = await fetch(`/api/track/${encodeURIComponent(code)}`);
    if (!res.ok) throw new Error('Chyba při vyhledávání');
    const data = await res.json();
    currentTrackingData = data;
    renderTrackingResult(data);
  } catch (err) {
    resultContainer.innerHTML = `<div style="padding:16px;background:#fee2e2;color:#991b1b;border-radius:8px;">Zásilka "${code}" nebyla v systému nalezena. Zkontrolujte prosím kód.</div>`;
  }
}

function renderTrackingResult(data) {
  const container = document.getElementById('trackingResult');
  if (!container) return;

  const isDelivered = data.status === 'delivered';
  const isReady = data.status === 'ready_for_pickup' || data.status === 'in_box';
  const statusClass = isDelivered ? 'status-delivered' : isReady ? 'status-ready' : 'status-delivering';

  let milestonesHtml = '';
  if (data.milestones && data.milestones.length) {
    milestonesHtml = data.milestones.map((m, idx) => `
      <div class="timeline-step ${m.completed ? 'completed' : ''} ${m.current ? 'current' : ''}">
        <div class="timeline-icon">${m.completed ? '✓' : idx + 1}</div>
        <div class="timeline-content">
          <div class="timeline-title">${m.title}</div>
          <div class="timeline-meta">${m.location} • <strong>${m.date}</strong></div>
        </div>
      </div>
    `).join('');
  }

  container.innerHTML = `
    <div class="tracking-header">
      <div>
        <div class="tracking-code-title">📦 ${data.id} <span style="font-size:14px;font-weight:500;color:var(--text-secondary);">(${data.serviceName})</span></div>
        <div style="font-size:13px;color:var(--text-muted);margin-top:2px;">Odesílatel: ${data.sender}</div>
      </div>
      <div class="tracking-status-pill ${statusClass}">
        ${data.statusText}
      </div>
    </div>

    <div class="tracking-details-grid">
      <div class="detail-card">
        <div class="detail-label">Předpokládané doručení</div>
        <div class="detail-value">${data.estimatedDelivery || 'Neuvedeno'}</div>
      </div>
      <div class="detail-card">
        <div class="detail-label">Hmotnost / Dobírka</div>
        <div class="detail-value">${data.weight} • ${data.codAmount}</div>
      </div>
      ${data.pickupPin ? `
      <div class="detail-card" style="background:#fef3c7;border-color:#fde68a;">
        <div class="detail-label" style="color:#92400e;">Kód pro vyzvednutí (PIN)</div>
        <div class="detail-value" style="font-size:18px;letter-spacing:2px;color:#92400e;">${data.pickupPin}</div>
      </div>
      ` : ''}
      ${data.pickupLocation ? `
      <div class="detail-card">
        <div class="detail-label">Místo uložení</div>
        <div class="detail-value">${data.pickupLocation}</div>
      </div>
      ` : ''}
    </div>

    <h4 style="font-size:14px;font-weight:700;color:var(--post-blue);margin-bottom:12px;">Historie pohybu zásilky</h4>
    <div class="timeline-stepper">
      ${milestonesHtml}
    </div>

    <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;">
      <button type="button" class="btn-secondary" onclick="showDemoToast('Požadavek na změnu termínu nebo místa doručení byl zaevidován.')">🔄 Změnit doručení</button>
      <button type="button" class="btn-secondary" onclick="navigator.clipboard?.writeText('${data.id}');showDemoToast('Číslo zásilky bylo zkopírováno.')">📋 Kopírovat kód</button>
    </div>
  `;
}

function quickTrack(code) {
  const input = document.getElementById('trackingCodeInput');
  if (input) input.value = code;
  trackParcel(code);
}

// ============================================================================
// POSTAGE CALCULATOR (Kalkulátor poštovného)
// ============================================================================

let currentCalcService = 'balikovna';

function selectCalcService(serviceKey) {
  currentCalcService = serviceKey;
  document.querySelectorAll('.service-radio-card').forEach(el => {
    el.classList.toggle('selected', el.getAttribute('data-service') === serviceKey);
  });
  updateCalculator();
}

function updateWeight(val) {
  const display = document.getElementById('weightDisplay');
  if (display) display.textContent = `${val} kg`;
  updateCalculator();
}

async function updateCalculator() {
  const weightInput = document.getElementById('weightSlider');
  const weight = parseFloat(weightInput?.value || 1);
  const cod = document.getElementById('calcCod')?.checked || false;
  const fragile = document.getElementById('calcFragile')?.checked || false;
  const insurance = document.getElementById('calcInsurance')?.checked || false;

  try {
    const res = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service: currentCalcService, weight, cod, fragile, insurance })
    });
    if (!res.ok) throw new Error('Calc error');
    const data = await res.json();
    renderCalculatorSummary(data);
  } catch (err) {
    console.error('Calculation error:', err);
  }
}

function renderCalculatorSummary(data) {
  const amountEl = document.getElementById('calcTotalAmount');
  const badgeEl = document.getElementById('calcServiceBadge');
  const listEl = document.getElementById('calcBreakdownList');

  if (amountEl) amountEl.textContent = `${data.totalPrice} Kč`;
  if (badgeEl) badgeEl.textContent = `${data.serviceName} • ${data.deliveryTime}`;

  if (listEl && data.breakdown) {
    listEl.innerHTML = data.breakdown.map(item => `
      <li class="calc-breakdown-item">
        <span>${item.item}</span>
        <strong>${item.price} Kč</strong>
      </li>
    `).join('');
  }
}

// ============================================================================
// BRANCH & PARCEL-BOX FINDER (Pobočky a Balíkovny)
// ============================================================================

async function fetchBranches() {
  const query = document.getElementById('branchSearchInput')?.value || '';
  const type = document.getElementById('branchTypeSelect')?.value || 'all';
  const czechPoint = document.getElementById('filterCzechPoint')?.classList.contains('active') || false;
  const cardPayment = document.getElementById('filterCardPayment')?.classList.contains('active') || false;
  const wheelchairAccess = document.getElementById('filterWheelchair')?.classList.contains('active') || false;
  const nonstop = document.getElementById('filterNonstop')?.classList.contains('active') || false;

  const params = new URLSearchParams({
    query,
    type,
    czechPoint: czechPoint ? 'true' : 'false',
    cardPayment: cardPayment ? 'true' : 'false',
    wheelchairAccess: wheelchairAccess ? 'true' : 'false',
    nonstop: nonstop ? 'true' : 'false'
  });

  try {
    const res = await fetch(`/api/branches?${params.toString()}`);
    const data = await res.json();
    currentBranchesData = data.branches || [];
    renderBranchesList(currentBranchesData);
  } catch (err) {
    console.error('Branches fetch error:', err);
  }
}

function toggleBranchPill(id) {
  const pill = document.getElementById(id);
  if (pill) {
    pill.classList.toggle('active');
    fetchBranches();
  }
}

function renderBranchesList(branches) {
  const container = document.getElementById('branchesListGrid');
  if (!container) return;

  if (!branches.length) {
    container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:32px;color:var(--text-muted);">Pro zadaná kritéria nebyly nalezeny žádné pobočky ani boxy.</div>';
    return;
  }

  container.innerHTML = branches.map(b => {
    const badgeClass = b.type === 'posta' ? 'badge-posta' : b.type === 'box' ? 'badge-box' : 'badge-balikovna';
    const badgeLabel = b.type === 'posta' ? 'Pošta' : b.type === 'box' ? 'Balíkovna-BOX' : 'Balíkovna';

    return `
      <div class="branch-card">
        <div class="branch-title-row">
          <div class="branch-name">${b.name}</div>
          <span class="branch-type-badge ${badgeClass}">${badgeLabel}</span>
        </div>
        <div class="branch-address">📍 ${b.address}</div>
        <div class="branch-hours">🕒 ${b.hours}</div>
        <div class="branch-features">
          ${b.cardPayment ? '<span class="feature-tag">💳 Platba kartou</span>' : ''}
          ${b.czechPoint ? '<span class="feature-tag">🏛️ Czech POINT</span>' : ''}
          ${b.wheelchairAccess ? '<span class="feature-tag">♿ Bezbariérová</span>' : ''}
          ${b.nonstop ? '<span class="feature-tag" style="background:#fef3c7;color:#92400e;">⚡ 24/7 Provoz</span>' : ''}
        </div>
        <button type="button" class="btn-secondary" style="margin-top:8px;font-size:12px;padding:6px 12px;" onclick="showDemoToast('Pobočka ${b.name} byla vybrána jako výchozí pro doručování.')">Zvolit pobočku</button>
      </div>
    `;
  }).join('');
}

// ============================================================================
// CONTACT FORM SUBMISSION
// ============================================================================

async function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.querySelector('#contactName')?.value;
  const email = form.querySelector('#contactEmail')?.value;
  const subject = form.querySelector('#contactSubject')?.value;
  const message = form.querySelector('#contactMessage')?.value;
  const submitBtn = form.querySelector('button[type="submit"]');

  if (!name || !email || !message) {
    showDemoToast('Vyplňte prosím všechna povinná pole.');
    return false;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Odesílám...';
  }

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });
    const data = await res.json();
    form.reset();
    showDemoToast(`Zpráva odeslána. Váš požadavek má kód ${data.ticketId}.`);
  } catch (err) {
    showDemoToast('Zprávu se nepodařilo odeslat. Zkuste to prosím později.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Odeslat zprávu';
    }
  }
  return false;
}

// ============================================================================
// THEMES & ACCESSIBILITY SETTINGS
// ============================================================================

function setTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  try { localStorage.setItem('userTheme', themeName); } catch (e) {}

  document.querySelectorAll('.theme-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme') === themeName);
  });
}

function setFontScale(scale) {
  document.documentElement.setAttribute('data-font-scale', scale);
  try { localStorage.setItem('userFontScale', scale); } catch (e) {}

  document.querySelectorAll('.font-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-scale') === scale);
  });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function () {
  try {
    localStorage.removeItem('userTheme');
    document.documentElement.removeAttribute('data-theme');
    const savedScale = localStorage.getItem('userFontScale');
    if (savedScale) setFontScale(savedScale);
  } catch (e) {}

  // Restore cookie consent state
  try {
    const consent = localStorage.getItem('cookieConsent');
    const banner = document.getElementById('cookieBanner');
    if (banner) {
      if (consent === 'all' || consent === 'declined' || consent === 'custom') {
        banner.classList.add('hidden');
      } else {
        setTimeout(() => banner.classList.remove('hidden'), 700);
      }
    }
  } catch (e) {}

  // Setup modal outside clicks
  const modals = ['loginModal', 'settingsModal', 'cookieModal', 'userPortalModal', 'newsModal'];
  modals.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', function (e) {
        if (e.target === el) el.classList.add('hidden');
      });
    }
  });

  // Escape key hides any visible modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      modals.forEach(id => document.getElementById(id)?.classList.add('hidden'));
    }
  });

  // Initial fetch for branches and news if those panels exist
  if (document.getElementById('branchesListGrid')) fetchBranches();
  if (document.getElementById('calcTotalAmount')) updateCalculator();

  const hero = document.getElementById('hero');
  if (hero) {
    startHero();
    hero.addEventListener('mouseenter', stopHero);
    hero.addEventListener('mouseleave', startHero);
  }

  const toolPanel = document.getElementById('toolPanel');
  if (toolPanel) {
    toolPanel.addEventListener('click', function (e) {
      if (e.target === toolPanel) closeTool();
    });
  }

  document.querySelectorAll('.nav-item-wrap > .nav-item').forEach((link) => {
    link.addEventListener('click', function (e) {
      const wrap = link.parentElement;
      if (!wrap?.querySelector('.dropdown')) return;
      e.preventDefault();
      document.querySelectorAll('.nav-item-wrap.is-open').forEach((w) => {
        if (w !== wrap) w.classList.remove('is-open');
      });
      wrap.classList.toggle('is-open');
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item-wrap')) {
      document.querySelectorAll('.nav-item-wrap.is-open').forEach((w) => w.classList.remove('is-open'));
    }
  });
});

function handleSearch(event) {
  if (event) event.preventDefault();
  const q = (document.getElementById('siteSearch')?.value || '').trim();
  showDemoToast(q ? `Hledání „${q}“ je v demu pouze ilustrační.` : 'Zadejte hledaný výraz.');
  return false;
}

function focusTracking() {
  document.getElementById('trackBox')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => document.getElementById('trackingCodeInput')?.focus(), 250);
}

let heroTimer = null;
let heroIndex = 0;

function goToSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dots button');
  if (!slides.length) return;
  heroIndex = (index + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle('is-active', i === heroIndex));
  dots.forEach((d, i) => d.classList.toggle('is-active', i === heroIndex));
}

function startHero() {
  stopHero();
  heroTimer = setInterval(() => goToSlide(heroIndex + 1), 5500);
}

function stopHero() {
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = null;
}

function toggleMobileNav() {
  const nav = document.getElementById('mainNav');
  const btn = document.querySelector('.menu-toggle');
  if (!nav) return;
  const open = nav.classList.toggle('is-open');
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function closeTool() {
  const panel = document.getElementById('toolPanel');
  if (panel) {
    panel.classList.add('hidden');
    panel.innerHTML = '';
  }
}

function openTool(kind) {
  const panel = document.getElementById('toolPanel');
  if (!panel) return;
  if (kind === 'calc') {
    panel.innerHTML = `
      <div class="tool-card">
        <button type="button" class="tool-close" onclick="closeTool()" aria-label="Zavřít">&times;</button>
        <h2>Kalkulátor zásilek</h2>
        <p>Orientační cena v demu – nejedná se o oficiální ceník.</p>
        <label for="calcService">Služba</label>
        <select id="calcService">
          <option value="balikovna">Balíkovna</option>
          <option value="do_ruky">Balík Do ruky</option>
          <option value="na_postu">Balík Na poštu</option>
          <option value="doporucene">Doporučené psaní</option>
        </select>
        <label for="calcWeight">Hmotnost (kg)</label>
        <input id="calcWeight" type="number" min="0.1" step="0.1" value="1">
        <div class="row">
          <label><input type="checkbox" id="calcCod"> Dobírka</label>
          <label><input type="checkbox" id="calcFragile"> Křehké</label>
          <label><input type="checkbox" id="calcIns"> Pojištění</label>
        </div>
        <div class="row">
          <button type="button" class="btn-yellow" onclick="runHomepageCalculator()">Spočítat</button>
        </div>
        <div id="calcOut"></div>
      </div>`;
  } else if (kind === 'branch') {
    panel.innerHTML = `
      <div class="tool-card">
        <button type="button" class="tool-close" onclick="closeTool()" aria-label="Zavřít">&times;</button>
        <h2>Vyhledat pobočku</h2>
        <label for="branchQuery">Město, PSČ nebo název</label>
        <input id="branchQuery" type="search" placeholder="např. Praha">
        <div class="row">
          <button type="button" class="btn-yellow" onclick="runHomepageBranchSearch()">Hledat</button>
        </div>
        <div id="branchOut" class="branch-list"></div>
      </div>`;
    setTimeout(() => runHomepageBranchSearch(), 0);
  } else {
    panel.innerHTML = `
      <div class="tool-card">
        <button type="button" class="tool-close" onclick="closeTool()" aria-label="Zavřít">&times;</button>
        <h2>Poslat zásilku</h2>
        <p>Podání zásilky je v tomto demu ilustrační. Na ostře by vás odkázalo do PoštaOnline / Balíkovny.</p>
        <div class="row">
          <button type="button" class="btn-yellow" onclick="openTool('calc')">Kalkulátor</button>
          <button type="button" class="btn-navy" onclick="closeTool(); focusTracking();">Sledovat zásilku</button>
        </div>
      </div>`;
  }
  panel.classList.remove('hidden');
}

async function runHomepageCalculator() {
  const out = document.getElementById('calcOut');
  try {
    const res = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: document.getElementById('calcService')?.value,
        weight: document.getElementById('calcWeight')?.value,
        cod: document.getElementById('calcCod')?.checked,
        fragile: document.getElementById('calcFragile')?.checked,
        insurance: document.getElementById('calcIns')?.checked
      })
    });
    const data = await res.json();
    const rows = (data.breakdown || []).map((r) => `<li>${r.item}: ${r.price} Kč</li>`).join('');
    out.innerHTML = `<p><strong>${data.totalPrice} Kč</strong> · ${data.serviceName}<br>${data.deliveryTime}</p><ul>${rows}</ul>`;
  } catch (err) {
    if (out) out.innerHTML = '<p>Kalkulátor je dočasně nedostupný.</p>';
  }
}

async function runHomepageBranchSearch() {
  const q = document.getElementById('branchQuery')?.value || '';
  const out = document.getElementById('branchOut');
  if (out) out.innerHTML = '<p>Hledám…</p>';
  try {
    const res = await fetch('/api/branches?query=' + encodeURIComponent(q));
    const data = await res.json();
    if (!data.branches?.length) {
      out.innerHTML = '<p>Žádná pobočka v demu neodpovídá.</p>';
      return;
    }
    out.innerHTML = data.branches.map((b) => `
      <div class="branch-item">
        <strong>${b.name}</strong><br>
        ${b.address}<br>
        ${b.hours}
      </div>`).join('');
  } catch (err) {
    if (out) out.innerHTML = '<p>Vyhledávání poboček je dočasně nedostupné.</p>';
  }
}
