// Educational UI demo - no credential capture.
// All submissions are mocked locally, nothing is stored or sent.

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    void modal.offsetWidth;
    setTimeout(() => modal.classList.add('visible'), 10);
    setTimeout(() => document.getElementById('username')?.focus(), 60);
}

function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (!modal) return;
    modal.classList.remove('visible');
    void modal.offsetWidth;
    setTimeout(() => modal.classList.add('hidden'), 10);
}

function showSettings() {
    showDemoToast('Nastavení je v demu nedostupné.');
}

function acceptAllCookies() {
    try { localStorage.setItem('cookieConsent', 'all'); } catch (e) {}
    document.getElementById('cookieBanner')?.classList.add('hidden');
}

function declineAllCookies() {
    try { localStorage.setItem('cookieConsent', 'declined'); } catch (e) {}
    document.getElementById('cookieBanner')?.classList.add('hidden');
}

function showCookieSettings() {
    showDemoToast('Konfigurace cookies je v demu pouze ilustrační.');
}

function showDemoToast(message) {
    let toast = document.getElementById('demoToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'demoToast';
        toast.setAttribute('role', 'status');
        toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#004d99;color:#fff;padding:12px 18px;border-radius:8px;z-index:2000;box-shadow:0 4px 16px rgba(0,0,0,.25);font-size:14px;max-width:90vw;text-align:center;';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.display = 'block';
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => { toast.style.display = 'none'; }, 2600);
}

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
    await new Promise((r) => setTimeout(r, 700));
    if (passwordInput) passwordInput.value = '';
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Přihlásit se';
    }
    hideLoginModal();
    showDemoToast('Demo: přihlášení proběhlo lokálně, žádná data nebyla odeslána.');
    return false;
}

// Backwards-compatible alias used by older markup.
function captureAndRedirect(event) {
    return handleDemoLogin(event);
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) hideLoginModal();
        });
    }
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') hideLoginModal();
    });
    const consent = (() => { try { return localStorage.getItem('cookieConsent'); } catch (err) { return null; } })();
    const banner = document.getElementById('cookieBanner');
    if (banner) {
        if (consent === 'all' || consent === 'declined') banner.classList.add('hidden');
        else setTimeout(() => banner.classList.remove('hidden'), 800);
    }
});
