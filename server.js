import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

await optionalDotenv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT || 8000);
const dataFilePath = path.join(__dirname, process.env.JOURNAL_DATA_FILE || "journal-data.json");
const tradovateSessionPath = path.join(__dirname, process.env.TRADOVATE_SESSION_FILE || "tradovate-session.json");
const tradingViewLevelsPath = path.join(__dirname, process.env.TRADINGVIEW_LEVELS_FILE || "tradingview-levels.json");

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
  app.get("/login", (_request, response) => response.sendFile(path.join(__dirname, "login.html")));
  app.get("/api/auth/status", (request, response) => sendExpress(response, handleAuthStatus(request.headers.cookie)));
  app.post("/api/auth/login", async (request, response) => sendExpress(response, handleLogin(request.body, response)));
  app.post("/api/auth/logout", (_request, response) => sendExpress(response, handleLogout(response)));
  app.post("/api/tradingview/levels", async (request, response) => {
    sendExpress(response, await handleTradingViewLevelsSave(request.body, {
      headers: request.headers,
      query: request.query,
    }));
  });
  app.use((request, response, next) => {
    if (isAllowedWithoutAuth(request.path) || isAuthenticated(request.headers.cookie)) {
      next();
      return;
    }
    if (request.path.startsWith("/api/")) {
      response.status(401).json({ error: "Login required." });
      return;
    }
    response.redirect("/login");
  });
  app.use(express.static(__dirname));
  app.get("/playbook", (_request, response) => response.redirect("/probabilities.html"));
  app.get("/probabilities", (_request, response) => response.sendFile(path.join(__dirname, "probabilities.html")));
  app.get("/psychology", (_request, response) => response.sendFile(path.join(__dirname, "psychology.html")));
  app.get("/api/tradovate/status", async (_request, response) => sendExpress(response, await handleStatus()));
  app.post("/api/tradovate/connect", async (request, response) => sendExpress(response, await handleConnect(request.body)));
  app.get("/api/tradovate/sync", async (request, response) => sendExpress(response, await handleSync(request.query)));
  app.post("/api/tradovate/sync", async (request, response) => sendExpress(response, await handleSync(request.body)));
  app.get("/api/journal", async (_request, response) => sendExpress(response, await handleJournalLoad()));
  app.post("/api/journal", async (request, response) => sendExpress(response, await handleJournalSave(request.body)));
  app.get("/api/tradingview/levels", async (_request, response) => sendExpress(response, await handleTradingViewLevelsLoad()));
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
  await loadTradovateSession();
  return ok({
    connected: Boolean(session.token) && !isTradovateSessionExpired(),
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
    await saveTradovateSession();

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
    await ensureTradovateSession(query);
    assertConnected();

    const accountId = query.accountId || process.env.TRADOVATE_ACCOUNT_ID || "";
    const fills = await tradovateRequestWithReconnect("/fill/list", query);
    const orderIds = unique(fills.map((fill) => fill.orderId).filter(Boolean));
    const contractIds = unique(fills.map((fill) => fill.contractId).filter(Boolean));

    const [orders, contracts] = await Promise.all([
      fetchItems("/order/items", orderIds, query),
      fetchItems("/contract/items", contractIds, query),
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

async function ensureTradovateSession(credentials = {}) {
  await loadTradovateSession();
  if (session.token && !isTradovateSessionExpired()) return;

  clearTradovateSession();
  const hasCredentials = credentials.username || credentials.password || process.env.TRADOVATE_USERNAME || process.env.TRADOVATE_PASSWORD;
  if (!hasCredentials) return;

  const result = await handleConnect(credentials);
  if (result.status >= 400) {
    const error = new Error(result.body.error || "Could not reconnect to Tradovate.");
    error.status = result.status;
    throw error;
  }
}

async function nativeHandler(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "GET" && url.pathname === "/login") {
    serveFile(path.join(__dirname, "login.html"), response);
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/auth/status") {
    sendNative(response, handleAuthStatus(request.headers.cookie));
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/auth/login") {
    sendNative(response, handleLogin(await readJson(request), response));
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/auth/logout") {
    sendNative(response, handleLogout(response));
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/tradingview/levels") {
    sendNative(response, await handleTradingViewLevelsSave(await readJson(request), {
      headers: request.headers,
      query: Object.fromEntries(url.searchParams),
    }));
    return;
  }

  if (!isAllowedWithoutAuth(url.pathname) && !isAuthenticated(request.headers.cookie)) {
    if (url.pathname.startsWith("/api/")) {
      sendNative(response, fail(401, "Login required."));
      return;
    }
    response.writeHead(302, { Location: "/login" });
    response.end();
    return;
  }

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

  if (request.method === "POST" && url.pathname === "/api/tradovate/sync") {
    sendNative(response, await handleSync(await readJson(request)));
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/journal") {
    sendNative(response, await handleJournalLoad());
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/journal") {
    sendNative(response, await handleJournalSave(await readJson(request)));
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/tradingview/levels") {
    sendNative(response, await handleTradingViewLevelsLoad());
    return;
  }

  if (request.method === "GET" && url.pathname === "/playbook") {
    response.writeHead(302, { Location: "/probabilities.html" });
    response.end();
    return;
  }

  if (request.method === "GET" && url.pathname === "/probabilities") {
    serveFile(path.join(__dirname, "probabilities.html"), response);
    return;
  }

  if (request.method === "GET" && url.pathname === "/psychology") {
    serveFile(path.join(__dirname, "psychology.html"), response);
    return;
  }

  serveStatic(url.pathname, response);
}

function authEnabled() {
  return Boolean(process.env.JOURNAL_USERNAME && process.env.JOURNAL_PASSWORD);
}

function handleAuthStatus(cookieHeader) {
  return ok({
    enabled: authEnabled(),
    authenticated: !authEnabled() || isAuthenticated(cookieHeader),
  });
}

function handleLogin(body, response) {
  if (!authEnabled()) {
    setSessionCookie(response);
    return ok({ authenticated: true, warning: "Login is not configured. Set JOURNAL_USERNAME and JOURNAL_PASSWORD." });
  }

  const validUsername = timingSafeEqualText(body.username || "", process.env.JOURNAL_USERNAME);
  const validPassword = timingSafeEqualText(body.password || "", process.env.JOURNAL_PASSWORD);

  if (!validUsername || !validPassword) {
    return fail(401, "Invalid username or password.");
  }

  setSessionCookie(response);
  return ok({ authenticated: true });
}

function handleLogout(response) {
  setHeader(response, "Set-Cookie", "journal_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
  return ok({ authenticated: false });
}

function isAllowedWithoutAuth(urlPath) {
  return !authEnabled()
    || urlPath === "/login"
    || urlPath === "/login.html"
    || urlPath === "/api/auth/login"
    || urlPath === "/api/auth/logout"
    || urlPath === "/api/auth/status";
}

function isAuthenticated(cookieHeader = "") {
  if (!authEnabled()) return true;
  const cookies = parseCookies(cookieHeader);
  const token = cookies.journal_session;
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  return timingSafeEqualText(signature, signSession(payload));
}

function setSessionCookie(response) {
  const payload = Buffer.from(JSON.stringify({
    user: process.env.JOURNAL_USERNAME || "local",
    createdAt: Date.now(),
  })).toString("base64url");
  const token = `${payload}.${signSession(payload)}`;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  setHeader(response, "Set-Cookie", `journal_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${secure}`);
}

function signSession(payload) {
  const secret = process.env.SESSION_SECRET || process.env.JOURNAL_PASSWORD || "local-dev-secret";
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function parseCookies(cookieHeader = "") {
  return Object.fromEntries(cookieHeader.split(";").map((cookie) => {
    const [key, ...valueParts] = cookie.trim().split("=");
    return [key, valueParts.join("=")];
  }).filter(([key]) => key));
}

function timingSafeEqualText(left, right = "") {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function setHeader(response, key, value) {
  if (typeof response.setHeader === "function") {
    response.setHeader(key, value);
    return;
  }
  response.set(key, value);
}

async function handleJournalLoad() {
  return ok(await readJournalData());
}

async function handleJournalSave(body = {}) {
  const data = {
    trades: Array.isArray(body.trades) ? body.trades : [],
    scorecards: body.scorecards && typeof body.scorecards === "object" ? body.scorecards : {},
    screenshots: body.screenshots && typeof body.screenshots === "object" ? body.screenshots : {},
    tradePlans: body.tradePlans && typeof body.tradePlans === "object" ? body.tradePlans : {},
    savedAt: new Date().toISOString(),
  };

  await writeJournalData(data);
  return ok({ saved: true, savedAt: data.savedAt });
}

async function handleTradingViewLevelsLoad() {
  return ok(await readTradingViewLevels());
}

async function handleTradingViewLevelsSave(body = {}, request = {}) {
  const secret = process.env.TRADINGVIEW_WEBHOOK_SECRET;
  const providedSecret = String(
    body.secret
      || request.headers?.["x-webhook-secret"]
      || request.query?.secret
      || ""
  );

  if (secret && !timingSafeEqualText(providedSecret, secret)) {
    return fail(401, "Invalid TradingView webhook secret.");
  }

  const levels = normalizeTradingViewLevels(body);
  const hasAnyLevel = Object.values(levels).some((value) => Number.isFinite(value))
    || ["long", "short"].includes(levels.bias);

  if (!hasAnyLevel) {
    return fail(400, "No usable TradingView levels found in webhook payload.");
  }

  const data = {
    source: "tradingview",
    savedAt: new Date().toISOString(),
    levels,
  };

  await writeTradingViewLevels(data);
  return ok({ saved: true, ...data });
}

function normalizeTradingViewLevels(body = {}) {
  return {
    symbol: cleanText(firstValue(body, ["symbol", "ticker", "contract"])).toUpperCase(),
    current: cleanNumber(firstValue(body, ["current", "currentPrice", "price", "last", "close"])),
    onh: cleanNumber(firstValue(body, ["onh", "ONH", "overnightHigh"])),
    onl: cleanNumber(firstValue(body, ["onl", "ONL", "overnightLow"])),
    pvah: cleanNumber(firstValue(body, ["pvah", "pVAH", "previousVAH", "priorVAH"])),
    pval: cleanNumber(firstValue(body, ["pval", "pVAL", "previousVAL", "priorVAL"])),
    ppoc: cleanNumber(firstValue(body, ["ppoc", "pPOC", "pvpoc", "pVPOC", "vpoc", "previousPOC"])),
    pmid: cleanNumber(firstValue(body, ["pmid", "pMID", "previousMID", "priorMID"])),
    ibh: cleanNumber(firstValue(body, ["ibh", "IBH", "initialBalanceHigh"])),
    ibl: cleanNumber(firstValue(body, ["ibl", "IBL", "initialBalanceLow"])),
    entry: cleanNumber(firstValue(body, ["entry", "entryPrice"])),
    stop: cleanNumber(firstValue(body, ["stop", "stopPrice", "structuralStop", "invalidation"])),
    target: cleanNumber(firstValue(body, ["target", "targetPrice", "masterTarget"])),
    bias: cleanBias(firstValue(body, ["bias", "setup", "direction"])),
  };
}

function firstValue(object, keys) {
  for (const key of keys) {
    if (object[key] !== undefined && object[key] !== null && object[key] !== "") return object[key];
  }
  return "";
}

function cleanText(value) {
  return String(value || "").trim();
}

function cleanNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const parsed = Number(String(value || "").replace(/[$,%\s,]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function cleanBias(value) {
  const text = cleanText(value).toLowerCase();
  if (text.includes("long") || text.includes("bull")) return "long";
  if (text.includes("short") || text.includes("bear")) return "short";
  return "";
}

async function readJournalData() {
  try {
    const text = await fs.promises.readFile(dataFilePath, "utf8");
    const data = JSON.parse(text);
    return {
      trades: Array.isArray(data.trades) ? data.trades : [],
      scorecards: data.scorecards && typeof data.scorecards === "object" ? data.scorecards : {},
      screenshots: data.screenshots && typeof data.screenshots === "object" ? data.screenshots : {},
      tradePlans: data.tradePlans && typeof data.tradePlans === "object" ? data.tradePlans : {},
      savedAt: data.savedAt || null,
    };
  } catch {
    return { trades: [], scorecards: {}, screenshots: {}, tradePlans: {}, savedAt: null };
  }
}

async function writeJournalData(data) {
  const temporaryPath = `${dataFilePath}.tmp`;
  await fs.promises.writeFile(temporaryPath, JSON.stringify(data, null, 2));
  await fs.promises.rename(temporaryPath, dataFilePath);
}

async function readTradingViewLevels() {
  try {
    const text = await fs.promises.readFile(tradingViewLevelsPath, "utf8");
    const data = JSON.parse(text);
    return {
      source: data.source || "tradingview",
      savedAt: data.savedAt || null,
      levels: data.levels && typeof data.levels === "object" ? data.levels : {},
    };
  } catch {
    return { source: "tradingview", savedAt: null, levels: {} };
  }
}

async function writeTradingViewLevels(data) {
  const temporaryPath = `${tradingViewLevelsPath}.tmp`;
  await fs.promises.writeFile(temporaryPath, JSON.stringify(data, null, 2));
  await fs.promises.rename(temporaryPath, tradingViewLevelsPath);
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

function serveFile(filePath, response) {
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

async function tradovateRequestWithReconnect(endpoint, credentials = {}, options = {}) {
  try {
    return await tradovateRequest(endpoint, options);
  } catch (error) {
    if (error.status !== 401) throw error;
    clearTradovateSession();
    await ensureTradovateSession(credentials);
    assertConnected();
    return tradovateRequest(endpoint, options);
  }
}

async function fetchItems(endpoint, ids, credentials = {}) {
  const chunks = chunk(ids, 80);
  const results = [];

  for (const idsChunk of chunks) {
    if (!idsChunk.length) continue;
    const query = new URLSearchParams({ ids: idsChunk.join(",") });
    const items = await tradovateRequestWithReconnect(`${endpoint}?${query.toString()}`, credentials);
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

function isTradovateSessionExpired() {
  if (!session.expiresAt) return false;
  const expiresAt = new Date(session.expiresAt).getTime();
  if (!Number.isFinite(expiresAt)) return false;
  return expiresAt <= Date.now() + 60_000;
}

function clearTradovateSession() {
  session.token = null;
  session.userId = null;
  session.expiresAt = null;
}

async function saveTradovateSession() {
  if (!session.token) return;
  const data = {
    environment: session.environment,
    baseUrl: session.baseUrl,
    token: session.token,
    userId: session.userId,
    expiresAt: session.expiresAt,
    savedAt: new Date().toISOString(),
  };

  const temporaryPath = `${tradovateSessionPath}.tmp`;
  await fs.promises.writeFile(temporaryPath, JSON.stringify(data, null, 2));
  await fs.promises.rename(temporaryPath, tradovateSessionPath);
}

async function loadTradovateSession() {
  if (session.token) return;

  try {
    const text = await fs.promises.readFile(tradovateSessionPath, "utf8");
    const data = JSON.parse(text);
    if (!data.token) return;
    session = {
      environment: data.environment || "demo",
      baseUrl: data.baseUrl || baseUrlFor(data.environment || "demo"),
      token: data.token,
      userId: data.userId || null,
      expiresAt: data.expiresAt || null,
    };
  } catch {
    // No saved token yet. The user needs to connect first.
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
