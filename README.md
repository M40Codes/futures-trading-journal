# Futures Trading Journal

Local futures journal with an optional Tradovate sync connector.

## Run Locally

Install dependencies once if `npm` is available:

```powershell
npm install
```

Start the local app and connector:

```powershell
npm start
```

If `npm` is not available, you can still run the connector with Node:

```powershell
node server.js
```

Open:

```text
http://localhost:8000
```

## Tradovate Sync

Copy `.env.example` to `.env` and fill in your Tradovate API details, or enter username/password in the browser panel when the local connector is running.

When Express is installed, the server uses Express. If Express is not installed, it falls back to a small built-in Node HTTP server with the same local endpoints.

The connector uses:

- `POST /auth/accesstokenrequest`
- `GET /fill/list`
- `GET /order/items`
- `GET /contract/items`

Imported trades are reconstructed from paired fills and deduplicated by fill IDs in browser storage. Review imported trades before using the journal stats for serious reporting.

Credentials are only sent to your local Express server. Do not paste Tradovate secrets into hosted/static versions of this app.

## Make It Available Outside Your Computer

This app needs a Node server because the Tradovate connector has to keep credentials and API tokens off the browser. Do not deploy it as a plain static site only.

### Option 1: Deploy To Render

1. Push this folder to a private GitHub repository.
2. Create a new Render web service from that repo.
3. Use:

```text
Build Command: npm install
Start Command: node server.js
```

4. Add private environment variables in Render using `.env.production.example` as the template.
5. Open the Render URL after deploy.

The included `render.yaml` can also be used as a Render blueprint.

### Option 2: Deploy With Docker

Build:

```powershell
docker build -t futures-trading-journal .
```

Run:

```powershell
docker run --env-file .env -p 8000:8000 futures-trading-journal
```

Then open:

```text
http://localhost:8000
```

On a cloud Docker host, set the same variables from `.env.production.example` in the provider dashboard.

### Important Security Notes

- Use a private repo if you store this project online.
- Never commit `.env`.
- Rotate any password that was shared in chat or screenshots.
- Prefer demo mode until you confirm the sync is importing trades correctly.
- A hosted app stores journal data in each browser's `localStorage`; for multi-device shared data, the next step is adding a real database.
