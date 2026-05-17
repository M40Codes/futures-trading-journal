import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

await optionalDotenv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT || 8000);

const POINT_VALUES = {
  ES: 50,
  MES: 5,
  NQ: 20,
  MNQ: 2,
  YM: 5,
  MYM: 0.5,
  RTY: 50,
  M2K: 5,
  CL: 1000,
  MCL: 100,
  GC: 100,
  MGC: 10,
  SI: 5000,
  SIL: 1000,
  ZB: 1000,
  ZN: 1000,
};

const PRODUCT_ALIASES = Object.keys(POINT_VALUES).sort((a, b) => b.length - a.length);

let session = {
  environment: process.env.TRADOVATE_ENV || "demo",
  baseUrl: baseUrlFor(process.env.TRADOVATE_ENV || "demo"),
  token: null,
  userId: null,
  expiresAt: null,
};

const express = await optionalExpress();

if (express) {
  const app = express();
  app.use(express.json({ limit: "1mb" }));
  app.use(express.static(__dirname));
  app.get("/api/tradovate/status", async (_request, response) => sendExpress(response, await handleStatus()));
  app.post("/api/tradovate/connect", async (request, response) => sendExpress(response, await handleConnect(request.body)));
  app.get("/api/tradovate/sync", async (request, response) => sendExpress(response, await handleSync(request.query)));
  app.listen(port, () => console.log(`Futures journal running at http://localhost:${port} with Express`));
} else {
  http.createServer(nativeHandler).listen(port, () => {
    console.log(`Futures journal running at http://localhost:${port} with Node HTTP fallback`);
    console.log("Run npm install later to use the Express runtime path.");
  });
}

async function optionalExpress() {
  try {
    const module = await import("express");
    return module.default;
  } catch {
    return null;
  }
}

async function optionalDotenv() {
  try {
    const module = await import("dotenv");
    module.config();
  } catch {
    readEnvFile();
  }
}

function readEnvFile() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...valueParts] = trimmed.split("=");
    process.env[key.trim()] ??= valueParts.join("=").trim().replace(/^"|"$/g, "");
  }
}

async function handleStatus() {
  return ok({
    connected: Boolean(session.token),
    environment: session.environment,
    userId: session.userId,
    expiresAt: session.expiresAt,
  });
}

async function handleConnect(body = {}) {
  try {
    const credentials = credentialsFrom(body);
    session.environment = credentials.environment;
    session.baseUrl = baseUrlFor(credentials.environment);

    const payload = compactObject({
      name: credentials.username,
      password: credentials.password,
      appId: credentials.appId,
      appVersion: credentials.appVersion,
      cid: credentials.cid,
      sec: credentials.sec,
      deviceId: credentials.deviceId,
    });

    if (!payload.name || !payload.password || !payload.appId || !payload.appVersion) {
      return fail(400, "Missing Tradovate credentials. Provide username, password, app id, and app version.");
    }

    const auth = await tradovateRequest("/auth/accesstokenrequest", {
      method: "POST",
      body: payload,
      includeAuth: false,
    });

    session.token = auth.accessToken;
    session.userId = auth.userId;
    session.expiresAt = auth.expirationTime;

    return ok({
      connected: true,
      environment: session.environment,
      userId: session.userId,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    return fail(502, error.message);
  }
}

async function handleSync(query = {}) {
  try {
    assertConnected();

    const accountId = query.accountId || process.env.TRADOVATE_ACCOUNT_ID || "";
    const fills = await tradovateRequest("/fill/list");
    const orderIds = unique(fills.map((fill) => fill.orderId).filter(Boolean));
    const contractIds = unique(fills.map((fill) => fill.contractId).filter(Boolean));

    const [orders, contracts] = await Promise.all([
      fetchItems("/order/items", orderIds),
      fetchItems("/contract/items", contractIds),
    ]);

    const ordersById = indexBy(orders, "id");
    const contractsById = indexBy(contracts, "id");
    const filteredFills = accountId
      ? fills.filter((fill) => String(ordersById[fill.orderId]?.accountId || "") === String(accountId))
      : fills;

    const trades = pairFills(filteredFills, ordersById, contractsById);

    return ok({
      accountId: accountId || null,
      fillCount: filteredFills.length,
      tradeCount: trades.length,
      trades,
      warnings: [
        "Trades are reconstructed from paired fills. Review imported entries before relying on journal stats.",
      ],
    });
  } catch (error) {
    return fail(error.status || 502, error.message);
  }
}

async function nativeHandler(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "GET" && url.pathname === "/api/tradovate/status") {
    sendNative(response, await handleStatus());
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/tradovate/connect") {
    sendNative(response, await handleConnect(await readJson(request)));
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/tradovate/sync") {
    sendNative(response, await handleSync(Object.fromEntries(url.searchParams)));
    return;
  }

  serveStatic(url.pathname, response);
}

function sendExpress(response, result) {
  response.status(result.status).json(result.body);
}

function sendNative(response, result) {
  response.writeHead(result.status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(result.body));
}

function ok(body) {
  return { status: 200, body };
}

function fail(status, error) {
  return { status, body: { error } };
}

function readJson(request) {
  return new Promise((resolve) => {
    let body = "";
    request.on("data", (chunkData) => {
      body += chunkData;
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function serveStatic(urlPath, response) {
  const safePath = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = safePath === "/" ? "/index.html" : safePath;
  const filePath = path.join(__dirname, requestedPath);

  if (!filePath.startsWith(__dirname)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, { "Content-Type": contentType(filePath) });
    fs.createReadStream(filePath).pipe(response);
  });
}

function contentType(filePath) {
  const extension = path.extname(filePath);
  return {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
  }[extension] || "application/octet-stream";
}

function credentialsFrom(body) {
  return {
    environment: body.environment || process.env.TRADOVATE_ENV || "demo",
    username: body.username || process.env.TRADOVATE_USERNAME,
    password: body.password || process.env.TRADOVATE_PASSWORD,
    appId: body.appId || process.env.TRADOVATE_APP_ID || "FuturesJournal",
    appVersion: body.appVersion || process.env.TRADOVATE_APP_VERSION || "1.0",
    cid: body.cid || process.env.TRADOVATE_CID,
    sec: body.sec || process.env.TRADOVATE_SEC,
    deviceId: body.deviceId || process.env.TRADOVATE_DEVICE_ID,
  };
}

function baseUrlFor(environment) {
  return environment === "live"
    ? "https://live.tradovateapi.com/v1"
    : "https://demo.tradovateapi.com/v1";
}

async function tradovateRequest(endpoint, options = {}) {
  const includeAuth = options.includeAuth !== false;
  const response = await fetch(`${session.baseUrl}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(includeAuth ? { Authorization: `Bearer ${session.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message || data?.errorText || data?.error || response.statusText;
    const error = new Error(`Tradovate ${response.status}: ${message}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

async function fetchItems(endpoint, ids) {
  const chunks = chunk(ids, 80);
  const results = [];

  for (const idsChunk of chunks) {
    if (!idsChunk.length) continue;
    const query = new URLSearchParams({ ids: idsChunk.join(",") });
    const items = await tradovateRequest(`${endpoint}?${query.toString()}`);
    results.push(...items);
  }

  return results;
}

function pairFills(fills, ordersById, contractsById) {
  const queues = new Map();
  const trades = [];
  const sorted = [...fills].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  for (const fill of sorted) {
    const contract = contractsById[fill.contractId] || {};
    const symbol = rootSymbol(contract.name || contract.symbol || contract.description || String(fill.contractId));
    const key = `${ordersById[fill.orderId]?.accountId || "all"}:${fill.contractId}`;
    const oppositeAction = fill.action === "Buy" ? "Sell" : "Buy";
    const queue = queues.get(key) || { Buy: [], Sell: [] };
    let remaining = Number(fill.qty || 0);

    while (remaining > 0 && queue[oppositeAction].length) {
      const open = queue[oppositeAction][0];
      const qty = Math.min(remaining, open.qty);
      const side = open.action === "Buy" ? "Long" : "Short";
      const entry = open.price;
      const exit = Number(fill.price);
      const points = side === "Long" ? exit - entry : entry - exit;
      const pointValue = POINT_VALUES[symbol] || 1;
      const profitLoss = points * pointValue * qty;

      trades.push({
        id: `tradovate-${open.id}-${fill.id}-${qty}`,
        source: "tradovate",
        sourceId: `tradovate-${open.id}-${fill.id}-${qty}`,
        date: tradeDate(fill),
        symbol,
        contractName: contract.name || contract.symbol || symbol,
        side,
        setup: "Tradovate import",
        mood: "Imported",
        entry,
        exit,
        quantity: qty,
        pointValue,
        commission: 0,
        risk: 0,
        notes: `Imported from Tradovate fills ${open.id} -> ${fill.id}.`,
        points,
        grossProfitLoss: profitLoss,
        profitLoss,
        rMultiple: 0,
      });

      open.qty -= qty;
      remaining -= qty;
      if (open.qty <= 0) {
        queue[oppositeAction].shift();
      }
    }

    if (remaining > 0) {
      queue[fill.action].push({
        id: fill.id,
        action: fill.action,
        qty: remaining,
        price: Number(fill.price),
      });
    }

    queues.set(key, queue);
  }

  return trades.sort((a, b) => new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`));
}

function tradeDate(fill) {
  if (fill.tradeDate?.year && fill.tradeDate?.month && fill.tradeDate?.day) {
    return [
      fill.tradeDate.year,
      String(fill.tradeDate.month).padStart(2, "0"),
      String(fill.tradeDate.day).padStart(2, "0"),
    ].join("-");
  }

  return new Date(fill.timestamp).toISOString().slice(0, 10);
}

function rootSymbol(symbol) {
  const cleaned = String(symbol).replace(/^@/, "").toUpperCase();
  return PRODUCT_ALIASES.find((alias) => cleaned.startsWith(alias)) || cleaned.replace(/[^A-Z]/g, "").slice(0, 4);
}

function assertConnected() {
  if (!session.token) {
    const error = new Error("Not connected to Tradovate. Connect first.");
    error.status = 401;
    throw error;
  }
}

function compactObject(object) {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined && value !== ""));
}

function unique(values) {
  return [...new Set(values)];
}

function indexBy(items, key) {
  return Object.fromEntries(items.map((item) => [item[key], item]));
}

function chunk(values, size) {
  const chunks = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}
