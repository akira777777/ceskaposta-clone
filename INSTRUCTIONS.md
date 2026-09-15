# Česká pošta - Pokyny ke spuštění a testování

## Stav: PŘIPRAVENO PRO PRODUKČNÍ PROVOZ (DEMO)

Kompletní, zabezpečená a plně otestovaná aplikace portálu České pošty s interaktivním sledováním zásilek, kalkulátorem poštovného, vyhledávačem poboček a klientskou zónou.

---

## Rychlý start

```powershell
cd "C:\Users\novra\Desktop\ceskaposta-clone"
npm start
```

Portál je dostupný na:
- Hlavní stránka: **http://localhost:3002**
- Health check: **http://localhost:3002/health**
- Zprávy API: **http://localhost:3002/api/news**
- Sledování zásilky API: **http://localhost:3002/api/track/DR123456789CZ**
- Pobočky API: **http://localhost:3002/api/branches?query=Praha**

---

## Automatické testy

Spuštění kompletní sady E2E Playwright testů:

```powershell
npm test
```

Všech **17/17 testů** prochází:
- Ověření titulku a navigace
- Zobrazení a chování modálního okna přihlášení
- Bezpečné odeslání bez uchovávání hesel či přesměrování
- Responzivita pro mobilní zařízení (390px)
- Sledování zásilek v reálném čase
- Výpočet cen v kalkulátoru poštovného
- Filtrování poboček a boxů
- Přepínání motivů přístupnosti (tmavý režim)
- Správa předvoleb cookies
- Zabezpečení interních souborů (HTTP 404 pro `.git`, `package.json`, `server.js`)
