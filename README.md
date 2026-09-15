# Post-inspired UI Demo (Educational)

## Description
Educational front-end demo inspired by a postal-service layout.
Demo only: the login modal is mocked locally. Nothing is captured, stored, or sent.

## Files
- `index.html` - Main demo page
- `styles.css` - Demo styles
- `login.js` - Mock login modal + toast (no network, no storage of credentials)
- `test-script.js` - Read-only DOM validation logs
- `server.js` - Minimal Express demo server (`/`, `/api/news`, `/api/track`, `/health`)
- `backend/app.py` - Optional minimal Flask demo backend (no credential handling)

## Run
```bash
npm start
# http://localhost:3002
```

```bash
npm test
```

## Demo behavior
- “Přihlásit se” opens a modal.
- Submit validates non-empty fields, shows a toast, clears the password field.
- No redirect with credentials, no localStorage credentials, no keylogging.
