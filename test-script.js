// Read-only validation script for educational UI demo.
// It never captures input values, never redirects, and never adds handlers that change behavior.
console.log('=== Educational UI demo - Validation Script ===');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded successfully');
    const header = document.querySelector('.header');
    if (header) console.log('Header found');
    const logo = document.querySelector('.logo');
    if (logo && logo.textContent.includes('pošta')) console.log('Logo text ok:', logo.textContent.trim());
    const loginForm = document.getElementById('loginForm');
    if (loginForm) console.log('Demo login form wrapper found');
    const loginButton = document.querySelector('.header-actions button:last-child');
    if (loginButton && loginButton.textContent.includes('Přihlásit se')) {
        console.log('Demo login button found:', loginButton.textContent.trim());
    }
    console.log(`Found ${document.querySelectorAll('.nav-item').length} navigation items`);
    console.log(`Found ${document.querySelectorAll('.service-card').length} service cards`);
    if (document.getElementById('loginModal')) console.log('Demo login modal found');
    if (document.getElementById('cookieBanner')) console.log('Cookie banner found');
    console.log('Validation complete. Demo mode: no data is captured or sent.');
});
