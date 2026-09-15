# Česká pošta - Oficiální portál služeb (Production Demo)

Kompletní, moderní a bezpečná webová aplikace replikující klientský portál **České pošty**. Obsahuje interaktivní sledování zásilek (Track & Trace), online kalkulátor poštovného, vyhledávač poboček a Balíkoven, dynamické zprávy, simulaci klientské zóny (Moje pošta), panel přístupnosti (včetně tmavého a kontrastního režimu) a granulární správu cookies.

> [!NOTE]
> Tato aplikace slouží k prezentačním a výukovým účelům. Přihlášení probíhá čistě lokálně, bez ukládání či odesílání citlivých údajů.

---

## 🚀 Hlavní funkce

1. **Sledování zásilek (Track & Trace)**:
   - Okamžité vyhledání stavu zásilek podle kódu (např. `DR123456789CZ`, `NP987654321CZ`, `BA456789123CZ`).
   - Přehledná časová osa (milestones) se stavy: *Podáno → V přepravě → Doručování → Na poště / V Boxu → Doručeno*.
   - Zobrazení doručovacích detailů, PIN kódu pro vyzvednutí a kontaktů na kurýra.

2. **Kalkulátor poštovného**:
   - Výpočet cen pro *Balíkovnu*, *Balík Do ruky*, *Balík Na poštu* a *Doporučené psaní*.
   - Dynamický posuvník hmotnosti (0,5 kg až 30 kg) a volba doplňkových služeb (dobírka, křehké, pojištění) s okamžitým rozpadem ceny.

3. **Vyhledávač poboček a Balíkoven**:
   - Fulltextové vyhledávání podle města, ulice nebo PSČ.
   - Filtrování podle typu (Pošty, Balíkovna-BOX 24/7, Partnerská výdejní místa) a doplňkových služeb (Platba kartou, Czech POINT, Bezbariérový přístup).

4. **Klientská zóna Moje pošta**:
   - Bezpečné ověření demo uživatele bez ukládání hesel.
   - Zobrazení aktivních zásilek, přesměrování a správa klientského profilu.

5. **Přístupnost a motivy (A11y & Themes)**:
   - Přepínání motivů: Světlý (Light), Tmavý (Dark) a Vysoký kontrast (WCAG AAA High-contrast).
   - Škálování velikosti písma (+15 %, +30 %) s perzistencí v `localStorage`.

6. **Granulární správa cookies**:
   - Soulad s GDPR pravidly: možnost povolit vše, odmítnout vše nebo nastavit preference pro nezbytné, analytické, funkční a marketingové cookies.

7. **Zabezpečení serveru**:
   - Zabezpečená obsluha statických souborů s blokováním přístupu k interním souborům (`.git`, `package.json`, `server.js`, `backend`, `data`).
   - Bezpečnostní HTTP hlavičky (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).

---

## 🛠️ Architektura a struktura projektu

```
ceskaposta-clone/
├── index.html            # Hlavní rozhraní portálu (SEO, A11y, WCAG)
├── styles.css            # Moderní CSS design systém (proměnné, dark mode, responsive)
├── login.js              # Klientská logika (sledování, kalkulátor, pobočky, auth)
├── test-script.js        # Validace stavu DOM
├── server.js             # Zabezpečený Express server s REST API
├── test.spec.js          # Playwright E2E testovací sada (17/17 testů)
├── playwright.config.js  # Konfigurace Playwright testů
└── package.json          # Závislosti a skripty projektu
```

---

## 📡 REST API endpointy

- `GET /health` – Stav a verze serveru
- `GET /api/news` – Tiskové zprávy a provozní informace
- `GET /api/news/:id` – Detail konkrétní zprávy
- `GET /api/track/:id` – Stav a historie pohybu zásilky podle kódu
- `POST /api/calculate` – Kalkulace ceny poštovného podle parametrů
- `GET /api/branches` – Vyhledání poboček a boxů s filtry
- `POST /api/contact` – Zaevidování zákaznického dotazu
- `POST /api/track` – Anonymní telemetrický endpoint

---

## 💻 Spuštění aplikace

### Instalace závislostí (již nainstalováno):
```bash
npm install
```

### Spuštění serveru:
```bash
npm start
# Aplikace běží na http://localhost:3002
```

### Spuštění automatických testů:
```bash
npm test
# Spustí kompletní Playwright E2E sadu (17 testů)
```
