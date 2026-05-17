# Deploy To Render

This app is ready to deploy as a Node web service.

## 1. Put The Code On GitHub

Create a private GitHub repo, then upload all files from this folder:

```text
C:\Users\farru\Documents\Codex\2026-05-17\lets-create-trading-journal
```

Do not upload `.env` if you created one.

## 2. Create Render Web Service

Go to Render and create a new **Web Service** from the GitHub repo.

Use:

```text
Build Command: npm install
Start Command: node server.js
```

## 3. Add Environment Variables

In Render, add private environment variables from `.env.production.example`.

Minimum:

```text
NODE_ENV=production
TRADOVATE_ENV=demo
TRADOVATE_APP_ID=FuturesJournal
TRADOVATE_APP_VERSION=1.0
```

If you want server-side Tradovate credentials:

```text
TRADOVATE_USERNAME=...
TRADOVATE_PASSWORD=...
TRADOVATE_CID=...
TRADOVATE_SEC=...
TRADOVATE_DEVICE_ID=...
TRADOVATE_ACCOUNT_ID=...
```

## 4. Open The Public URL

After deploy, Render will give you a public URL like:

```text
https://futures-trading-journal.onrender.com
```

That URL is not local.

## Important

The app is public once deployed. Keep the repo private and put secrets only in Render environment variables.

Journal entries currently use browser localStorage. To share the same journal across devices, add a database and login next.
