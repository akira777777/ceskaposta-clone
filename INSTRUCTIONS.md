# Educational UI Demo - Instructions

## Status: READY AS A SAFE DEMO

This is a front-end teaching demo. No credential capture exists.

## Files
```
ceskaposta-clone/
├── index.html
├── styles.css
├── login.js
├── test-script.js
├── server.js
├── test.spec.js
├── playwright.config.js
└── backend/app.py
```

## Quick start
```powershell
cd "C:\Users\novra\Desktop\ceskaposta-clone"
npm start
npm test
```

Open:
- http://localhost:3002
- http://localhost:3002/health
- http://localhost:3002/api/news

## Demo checklist
- [ ] Page opens without console errors
- [ ] Login button opens modal
- [ ] Demo submit shows toast, clears password, does not redirect
- [ ] Cookie banner can be dismissed
- [ ] Responsive layout works at 390px
- [ ] `npm test` passes 11/11
