const STORAGE_KEY = "futures-journal:v2";
const SCORE_STORAGE_KEY = "futures-scorecard:v1";
const SCREENSHOT_STORAGE_KEY = "futures-screenshots:v1";

const CONTRACTS = {
  ES: { name: "E-mini S&P 500", pointValue: 50 },
  MES: { name: "Micro S&P 500", pointValue: 5 },
  NQ: { name: "E-mini Nasdaq", pointValue: 20 },
  MNQ: { name: "Micro Nasdaq", pointValue: 2 },
  YM: { name: "E-mini Dow", pointValue: 5 },
  RTY: { name: "Russell 2000", pointValue: 50 },
  CL: { name: "Crude Oil", pointValue: 1000 },
  GC: { name: "Gold", pointValue: 100 },
};

const form = document.querySelector("#tradeForm");
const formTitle = document.querySelector("#formTitle");
const cancelEditButton = document.querySelector("#cancelEditButton");
const tradeRows = document.querySelector("#tradeRows");
const rowTemplate = document.querySelector("#rowTemplate");
const emptyState = document.querySelector("#emptyState");
const resultCount = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const outcomeFilter = document.querySelector("#outcomeFilter");
const seedButton = document.querySelector("#seedButton");
const clearButton = document.querySelector("#clearButton");
const logoutButton = document.querySelector("#logoutButton");
const symbolInput = document.querySelector("#symbol");
const pointValueInput = document.querySelector("#pointValue");
const dailyGrid = document.querySelector("#dailyGrid");
const recentTradesList = document.querySelector("#recentTradesList");
const scorecardGrid = document.querySelector("#scorecardGrid");
const perfectScoreButton = document.querySelector("#perfectScoreButton");
const resetScoreButton = document.querySelector("#resetScoreButton");
const scorecardDate = document.querySelector("#scorecardDate");
const dailyReviewNote = document.querySelector("#dailyReviewNote");
const screenshotDate = document.querySelector("#screenshotDate");
const screenshotInput = document.querySelector("#screenshotInput");
const screenshotImage = document.querySelector("#screenshotImage");
const screenshotCaption = document.querySelector("#screenshotCaption");
const clearScreenshotButton = document.querySelector("#clearScreenshotButton");
const calendarMonthLabel = document.querySelector("#calendarMonthLabel");
const prevMonthButton = document.querySelector("#prevMonthButton");
const nextMonthButton = document.querySelector("#nextMonthButton");
const tradovateStatus = document.querySelector("#tradovateStatus");
const tradovateEnvironment = document.querySelector("#tradovateEnvironment");
const tradovateUsername = document.querySelector("#tradovateUsername");
const tradovatePassword = document.querySelector("#tradovatePassword");
const tradovateAccountId = document.querySelector("#tradovateAccountId");
const tradovateConnectButton = document.querySelector("#tradovateConnectButton");
const tradovateSyncButton = document.querySelector("#tradovateSyncButton");
const sectionLinks = document.querySelectorAll("[data-section]");
const sectionPanels = document.querySelectorAll("[data-section-panel]");
const probabilityDimension = document.querySelector("#probabilityDimension");
const probabilityRows = document.querySelector("#probabilityRows");
const probabilityChartGrid = document.querySelector("#probabilityChartGrid");
const playbookGrid = document.querySelector("#playbookGrid");
const reportsGrid = document.querySelector("#reportsGrid");
const statsMatrix = document.querySelector("#statsMatrix");
const matrixSummary = document.querySelector("#matrixSummary");
const liveLevelInputs = {
  current: document.querySelector("#liveCurrentPrice"),
  onh: document.querySelector("#liveOnh"),
  onl: document.querySelector("#liveOnl"),
  pvah: document.querySelector("#livePvah"),
  pval: document.querySelector("#livePval"),
  ppoc: document.querySelector("#livePpoc"),
  pmid: document.querySelector("#livePmid"),
  ibh: document.querySelector("#liveIbh"),
  ibl: document.querySelector("#liveIbl"),
};
const contextInputs = {
  gapDirection: document.querySelector("#contextGapDirection"),
  gapFilled: document.querySelector("#contextGapFilled"),
  dayType: document.querySelector("#contextDayType"),
  outsideReversed: document.querySelector("#contextOutsideReversed"),
  openingCandle: document.querySelector("#contextOpeningCandle"),
  dayColor: document.querySelector("#contextDayColor"),
  highMade: document.querySelector("#contextHighMade"),
  lowMade: document.querySelector("#contextLowMade"),
};

const metrics = {
  net: document.querySelector("#metricNet"),
  netCaption: document.querySelector("#metricNetCaption"),
  winRate: document.querySelector("#metricWinRate"),
  wins: document.querySelector("#metricWins"),
  breakeven: document.querySelector("#metricBreakeven"),
  losses: document.querySelector("#metricLosses"),
  record: document.querySelector("#metricRecord"),
  profitFactor: document.querySelector("#metricProfitFactor"),
  expectancy: document.querySelector("#metricExpectancy"),
  winLossSpread: document.querySelector("#metricWinLossSpread"),
  avgWin: document.querySelector("#metricAvgWin"),
  avgLoss: document.querySelector("#metricAvgLoss"),
  avgWinBar: document.querySelector("#avgWinBar"),
  avgLossBar: document.querySelector("#avgLossBar"),
  dayStreak: document.querySelector("#metricDayStreak"),
  tradeStreak: document.querySelector("#metricTradeStreak"),
  trades: document.querySelector("#metricTrades"),
  scoreGrade: document.querySelector("#metricScoreGrade"),
  winGauge: document.querySelector("#winGauge"),
};

const scoreSummary = {
  percent: document.querySelector("#scoreSummaryPercent"),
  grade: document.querySelector("#scoreSummaryGrade"),
  points: document.querySelector("#scoreSummaryPoints"),
};

const SCORE_SECTIONS = [
  {
    title: "Part 1: Pre-Market Preparation",
    items: [
      { id: "sleep_mindset", label: "Sleep & mindset: well-rested, calm, zero distractions?", max: 5 },
      { id: "news_calendar", label: "News check: economic calendar, JOLTS, CPI, Fed speakers?", max: 5 },
      { id: "levels_marked", label: "Levels marked: key supply/resistance levels before open?", max: 5 },
      { id: "game_plan", label: "Game plan: wrote down if/then scenarios?", max: 5 },
    ],
  },
  {
    title: "Part 2: Execution & Discipline",
    items: [
      { id: "valid_setup", label: "Valid setup only: trade fit playbook criteria?", max: 10 },
      { id: "patience", label: "Patience: waited for IVFG close, VAH/IB displacement, MSS, or level-zone dip?", max: 10 },
      { id: "no_chasing", label: "No chasing: avoided late FOMO entries?", max: 10 },
      { id: "profit_taking", label: "Profit taking: took profits at predetermined technical targets?", max: 10 },
      { id: "trade_plan", label: "Trade plan: took only planned trades?", max: 10 },
    ],
  },
  {
    title: "Part 3: Risk Management",
    items: [
      { id: "hard_stops", label: "Hard stops: stop-loss order placed immediately on every entry?", max: 10 },
      { id: "sizing", label: "Sizing: stuck to standard lot size with no random sizing up?", max: 10 },
      { id: "loser_management", label: "Loser management: accepted losses without widening stops or averaging down?", max: 10 },
    ],
  },
  {
    title: "Part 4: Psychology & Execution Penalties",
    penalty: true,
    items: [
      { id: "jumped_gun", label: "Entered too soon: jumped the gun or FOMO?", max: -20 },
      { id: "overtrading", label: "Overtrading: took more than 3 trades today?", max: -10 },
      { id: "exited_soon", label: "Exited too soon: paper hands or fear of losing gain?", max: -20 },
      { id: "exited_late", label: "Exited too late: greed, hope, or ignored target?", max: -20 },
      { id: "scaling_bad", label: "Scaling: failed to scale correctly?", max: -10 },
      { id: "bad_stop", label: "Technical stop placement: random dollar stop instead of logical technical level?", max: -20 },
      { id: "premium_discount", label: "Premium/discount: failed to draw 50% GB from zone highs/lows as framework?", max: -10 },
      { id: "support_break", label: "Chasing support break: shorted support before letting it break first?", max: -20 },
    ],
  },
];

const BENCHMARK_PATTERN_REPORTS = {
  gapFill: [
    { label: "gap up", positiveLabel: "filled", negativeLabel: "not filled", positivePercent: 58, negativePercent: 42, total: 100 },
    { label: "gap down", positiveLabel: "filled", negativeLabel: "not filled", positivePercent: 60, negativePercent: 40, total: 100 },
  ],
  insideBars: { label: "outside days", positiveLabel: "outside days", negativeLabel: "inside days", positivePercent: 82.19, negativePercent: 17.81, total: 100 },
  openingCandle: [
    { label: "green candle", positiveLabel: "green day", negativeLabel: "red day", positivePercent: 74.65, negativePercent: 25.35, total: 100 },
    { label: "red candle", positiveLabel: "green day", negativeLabel: "red day", positivePercent: 25, negativePercent: 75, total: 100 },
  ],
  outsideReversal: [
    { label: "bullish outside day", positiveLabel: "reversal back down", negativeLabel: "did not reverse", positivePercent: 67, negativePercent: 33, total: 100 },
    { label: "bearish outside day", positiveLabel: "reversal back up", negativeLabel: "did not reverse", positivePercent: 70, negativePercent: 30, total: 100 },
  ],
  weekdayColor: [
    { label: "Mon", positiveLabel: "green", negativeLabel: "red", positivePercent: 65.38, negativePercent: 34.62, total: 100 },
    { label: "Tue", positiveLabel: "green", negativeLabel: "red", positivePercent: 50, negativePercent: 50, total: 100 },
    { label: "Wed", positiveLabel: "green", negativeLabel: "red", positivePercent: 69.23, negativePercent: 30.77, total: 100 },
    { label: "Thu", positiveLabel: "green", negativeLabel: "red", positivePercent: 25, negativePercent: 75, total: 100 },
    { label: "Fri", positiveLabel: "green", negativeLabel: "red", positivePercent: 56, negativePercent: 44, total: 100 },
  ],
  highLow: [
    {
      title: "High",
      data: [
        { label: "Mon", percent: 14.29, total: 100 },
        { label: "Tue", percent: 21.43, total: 100 },
        { label: "Wed", percent: 50, total: 100 },
        { label: "Thu", percent: 0, total: 100 },
        { label: "Fri", percent: 14.29, total: 100 },
      ],
    },
    {
      title: "Low",
      data: [
        { label: "Mon", percent: 28.57, total: 100 },
        { label: "Tue", percent: 21.43, total: 100 },
        { label: "Wed", percent: 7.14, total: 100 },
        { label: "Thu", percent: 14.29, total: 100 },
        { label: "Fri", percent: 28.57, total: 100 },
      ],
    },
  ],
};

const STATS_MATRIX_COLUMNS = ["RTH", "Open Range", "Opening Range", "Gap", "Range", "Range Close", "LOD", "HOD"];
const STATS_MATRIX_SECTIONS = [
  {
    title: "Prior / Overnight Levels",
    rows: [
      ["ONH or ONL", [96.2, 97.4, 94.0, 97.7, 96.9, 99.1, 85.2]],
      ["ON/VPOC", [82.1, 82.8, 80.8, 83.2, 82.3, 84.0, 75.4]],
      ["pVAH or pVAL", [78.5, 90.5, 56.3, 85.4, 92.7, 61.3, 47.5]],
      ["pHI or pLO", [78.1, 83.5, 68.3, 80.9, 86.9, 68.9, 67.2]],
      ["ON/MID", [75.3, 78.5, 69.5, 76.3, 81.5, 71.7, 65.8]],
      ["ONH", [67.2, 69.3, 63.5, 79.2, 56.2, 78.3, 37.7]],
      ["pCL", [64.0, 73.9, 46.1, 71.1, 77.7, 49.1, 41.0]],
      ["pVAH", [60.0, 66.3, 48.5, 73.4, 56.9, 61.3, 26.2]],
      ["pVPOC", [58.9, 69.0, 40.7, 69.4, 68.5, 43.4, 36.1]],
      ["pMid", [55.3, 67.7, 32.9, 67.6, 67.7, 33.0, 32.8]],
      ["ONL", [54.9, 57.1, 50.9, 50.3, 66.2, 42.5, 45.6]],
      ["pHI", [53.2, 54.5, 50.9, 62.4, 43.8, 68.9, 19.7]],
      ["pVAL", [50.0, 58.7, 34.1, 50.9, 69.2, 26.4, 47.5]],
      ["pLO", [36.8, 38.3, 34.1, 28.3, 51.5, 15.1, 67.2]],
      ["pVAH & pVAL", [31.5, 34.3, 26.3, 34.7, 33.8, 26.4, 26.2]],
      ["ONH & ONL", [26.0, 29.0, 20.4, 31.8, 25.4, 21.7, 18.0]],
      ["pHI & pLO", [11.9, 0.2, 16.8, 9.8, 8.5, 15.1, 19.7]],
    ],
  },
  {
    title: "Initial Balance Levels",
    rows: [
      ["IBH or IBL", [98.9, 99.0, 98.8, 98.8, 99.2, 99.1, 98.4]],
      ["1.5xIBH or 1.5xIBL", [75.1, 73.9, 77.2, 74.6, 73.1, 81.1, 70.5]],
      ["IBH", [68.7, 70.3, 65.9, 68.8, 72.3, 60.4, 75.4]],
      ["IBL", [62.6, 65.0, 58.1, 65.9, 63.8, 62.3, 50.8]],
      ["2.0xIBH or 2.0xIBL", [42.6, 43.6, 42.5, 41.6, 43.8, 45.3, 37.7]],
      ["1.5xIBH", [41.5, 43.2, 38.2, 44.5, 41.5, 38.7, 37.7]],
      ["1.5xIBL", [39.4, 37.3, 43.1, 38.7, 35.4, 48.1, 34.4]],
      ["IBH & IBL", [32.3, 36.3, 25.1, 35.8, 36.9, 23.6, 27.9]],
      ["2.0xIBL", [23.0, 22.1, 24.6, 21.4, 23.1, 28.3, 18.0]],
      ["2.0xIBH", [20.9, 22.1, 18.6, 22.5, 21.5, 17.0, 21.3]],
      ["1.5xIBH & 1.5xIBL", [5.7, 6.6, 4.2, 8.7, 3.8, 5.7, 1.6]],
      ["2.0xIBH & 2.0xIBL", [1.3, 1.7, 0.6, 2.3, 0.8, 0, 1.6]],
    ],
  },
];

let trades = loadTrades();
let scorecards = loadScorecard();
let screenshots = loadScreenshots();
let editingId = null;
let calendarDate = new Date();
let serverSyncReady = false;
let saveTimer = null;

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

document.querySelector("#date").valueAsDate = new Date();
scorecardDate.valueAsDate = new Date();
screenshotDate.valueAsDate = new Date();
syncPointValue();
renderScorecard();
renderScreenshot();
render();
checkTradovateStatus();
hydrateFromServer();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const trade = tradeFromForm(new FormData(form));

  if (editingId) {
    trades = trades.map((item) => item.id === editingId ? { ...trade, id: editingId } : item);
  } else {
    trades = [{ ...trade, id: crypto.randomUUID() }, ...trades];
  }

  saveTrades();
  resetForm();
  render();
});

symbolInput.addEventListener("change", syncPointValue);
cancelEditButton.addEventListener("click", resetForm);
searchInput.addEventListener("input", render);
outcomeFilter.addEventListener("change", render);
perfectScoreButton.addEventListener("click", markPerfectScorecard);
resetScoreButton.addEventListener("click", resetScorecard);
scorecardDate.addEventListener("change", () => {
  screenshotDate.value = scorecardDate.value;
  renderScorecard();
  renderScreenshot();
  renderDailyGrid(filteredTrades());
});
dailyReviewNote.addEventListener("input", saveDailyReviewNote);
Object.values(contextInputs).forEach((input) => {
  input.addEventListener("change", saveMarketContext);
});
Object.values(liveLevelInputs).forEach((input) => {
  input.addEventListener("input", renderStatsMatrix);
});
screenshotDate.addEventListener("change", () => {
  scorecardDate.value = screenshotDate.value;
  renderScorecard();
  renderScreenshot();
  renderDailyGrid(filteredTrades());
});
screenshotInput.addEventListener("change", saveScreenshotForDate);
clearScreenshotButton.addEventListener("click", clearScreenshotForDate);
prevMonthButton.addEventListener("click", () => changeCalendarMonth(-1));
nextMonthButton.addEventListener("click", () => changeCalendarMonth(1));
tradovateConnectButton.addEventListener("click", connectTradovate);
tradovateSyncButton.addEventListener("click", syncTradovateTrades);
probabilityDimension.addEventListener("change", () => renderProbabilities(trades));
sectionLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showSection(link.dataset.section);
  });
});
showSection(window.location.hash.replace("#", "") || "dashboard");

seedButton.addEventListener("click", () => {
  trades = sampleTrades();
  saveTrades();
  resetForm();
  render();
});

logoutButton.addEventListener("click", async () => {
  await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  window.location.href = "/login";
});

clearButton.addEventListener("click", () => {
  const confirmed = window.confirm("Clear every saved trade from this browser?");
  if (!confirmed) return;
  trades = [];
  saveTrades();
  resetForm();
  render();
});

function loadTrades() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveTrades() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
  scheduleServerSave();
}

function showSection(sectionName) {
  sectionLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === sectionName);
  });

  sectionPanels.forEach((panel) => {
    panel.classList.toggle("active-section", panel.dataset.sectionPanel === sectionName);
  });

  window.location.hash = sectionName;
  renderSecondarySections();
}

async function checkTradovateStatus() {
  if (!tradovateStatus) return;
  if (window.location.protocol === "file:") {
    tradovateStatus.textContent = "Open http://localhost:8000 instead of the local file path to use Tradovate sync.";
    return;
  }

  try {
    const status = await fetchJson("/api/tradovate/status");
    tradovateStatus.textContent = status.connected
      ? `Connected to Tradovate ${status.environment}. Token expires ${status.expiresAt || "unknown"}.`
      : "Local connector is running. Connect to Tradovate when ready.";
    tradovateEnvironment.value = status.environment || "demo";
  } catch {
    tradovateStatus.textContent = "Local connector is not reachable. Start it with node server.js, then open http://localhost:8000.";
  }
}

async function connectTradovate() {
  if (window.location.protocol === "file:") {
    tradovateStatus.textContent = "Tradovate sync needs the local server. Run node server.js and open http://localhost:8000.";
    return;
  }

  setConnectorBusy(true, "Connecting to Tradovate...");
  try {
    const result = await fetchJson("/api/tradovate/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        environment: tradovateEnvironment.value,
        username: tradovateUsername.value.trim(),
        password: tradovatePassword.value,
      }),
    });
    tradovatePassword.value = "";
    tradovateStatus.textContent = `Connected to Tradovate ${result.environment}.`;
  } catch (error) {
    tradovateStatus.textContent = error.message;
  } finally {
    setConnectorBusy(false);
  }
}

async function syncTradovateTrades() {
  if (window.location.protocol === "file:") {
    tradovateStatus.textContent = "Tradovate sync needs the local server. Run node server.js and open http://localhost:8000.";
    return;
  }

  const accountQuery = tradovateAccountId.value.trim()
    ? `?accountId=${encodeURIComponent(tradovateAccountId.value.trim())}`
    : "";

  setConnectorBusy(true, "Syncing Tradovate fills...");
  try {
    const result = await fetchJson(`/api/tradovate/sync${accountQuery}`);
    const before = trades.length;
    const knownIds = new Set(trades.map((trade) => trade.sourceId || trade.id));
    const imported = result.trades.filter((trade) => !knownIds.has(trade.sourceId || trade.id));

    trades = [...imported, ...trades];
    saveTrades();
    render();

    tradovateStatus.textContent = `Synced ${imported.length} new trades from ${result.fillCount} fills. ${before + imported.length} trades in journal.`;
  } catch (error) {
    tradovateStatus.textContent = error.message;
  } finally {
    setConnectorBusy(false);
  }
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with ${response.status}`);
  }

  return data;
}

function setConnectorBusy(isBusy, message) {
  tradovateConnectButton.disabled = isBusy;
  tradovateSyncButton.disabled = isBusy;
  if (message) {
    tradovateStatus.textContent = message;
  }
}

function loadScorecard() {
  try {
    const stored = JSON.parse(localStorage.getItem(SCORE_STORAGE_KEY)) ?? {};
    const looksLikeOldFlatScorecard = Object.keys(stored).some((key) => SCORE_SECTIONS
      .flatMap((section) => section.items)
      .some((item) => item.id === key));

    if (looksLikeOldFlatScorecard) {
      return { [todayKey()]: { scores: stored, note: "" } };
    }

    return stored;
  } catch {
    return {};
  }
}

function saveScorecard() {
  localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(scorecards));
  scheduleServerSave();
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function selectedReviewDate() {
  return scorecardDate.value || todayKey();
}

function currentReview() {
  const date = selectedReviewDate();
  if (!scorecards[date]) {
    scorecards[date] = { scores: {}, note: "" };
  }
  return scorecards[date];
}

function loadScreenshots() {
  try {
    return JSON.parse(localStorage.getItem(SCREENSHOT_STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveScreenshots() {
  localStorage.setItem(SCREENSHOT_STORAGE_KEY, JSON.stringify(screenshots));
  scheduleServerSave();
}

async function hydrateFromServer() {
  if (window.location.protocol === "file:") return;

  try {
    const data = await fetchJson("/api/journal");
    serverSyncReady = true;

    if (Array.isArray(data.trades) && data.trades.length) {
      const serverIds = new Set(data.trades.map((item) => item.sourceId || item.id));
      const localOnly = trades.filter((trade) => !serverIds.has(trade.sourceId || trade.id));
      trades = [...data.trades, ...localOnly];
    }

    if (data.scorecards && Object.keys(data.scorecards).length) {
      scorecards = { ...scorecards, ...data.scorecards };
    }

    if (data.screenshots && Object.keys(data.screenshots).length) {
      screenshots = { ...screenshots, ...data.screenshots };
    }

    saveLocalOnly();
    renderScorecard();
    renderScreenshot();
    render();
    scheduleServerSave();
  } catch {
    serverSyncReady = false;
  }
}

function saveLocalOnly() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
  localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(scorecards));
  localStorage.setItem(SCREENSHOT_STORAGE_KEY, JSON.stringify(screenshots));
}

function scheduleServerSave() {
  if (!serverSyncReady || window.location.protocol === "file:") return;
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(saveJournalToServer, 650);
}

async function saveJournalToServer() {
  try {
    await fetchJson("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trades, scorecards, screenshots }),
    });
  } catch {
    serverSyncReady = false;
  }
}

async function saveScreenshotForDate(event) {
  const file = event.target.files?.[0];
  const date = screenshotDate.value;
  if (!file || !date) return;

  const dataUrl = await resizeImage(file, 1400, 0.82);
  screenshots[date] = {
    name: file.name,
    savedAt: new Date().toISOString(),
    dataUrl,
  };
  saveScreenshots();
  renderScreenshot();
  renderDailyGrid(filteredTrades());
  screenshotInput.value = "";
}

function clearScreenshotForDate() {
  const date = screenshotDate.value;
  if (!date || !screenshots[date]) return;
  delete screenshots[date];
  saveScreenshots();
  renderScreenshot();
  renderDailyGrid(filteredTrades());
}

function renderScreenshot() {
  const date = screenshotDate.value;
  const screenshot = screenshots[date];

  if (!screenshot) {
    screenshotImage.removeAttribute("src");
    screenshotImage.style.display = "none";
    screenshotCaption.textContent = "No screenshot saved for this day.";
    return;
  }

  screenshotImage.src = screenshot.dataUrl;
  screenshotImage.style.display = "block";
  screenshotCaption.textContent = `${screenshot.name} saved for ${dateFormatter.format(new Date(`${date}T00:00:00`))}`;
}

function resizeImage(file, maxWidth, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, maxWidth / image.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function syncPointValue() {
  pointValueInput.value = CONTRACTS[symbolInput.value]?.pointValue ?? 50;
}

function tradeFromForm(data) {
  const side = data.get("side");
  const entry = Number(data.get("entry"));
  const exit = Number(data.get("exit"));
  const quantity = Number(data.get("quantity"));
  const pointValue = Number(data.get("pointValue"));
  const commission = Number(data.get("commission")) || 0;
  const risk = Number(data.get("risk")) || 0;
  const direction = side === "Long" ? 1 : -1;
  const points = (exit - entry) * direction;
  const grossProfitLoss = points * pointValue * quantity;
  const profitLoss = grossProfitLoss - commission;
  const rMultiple = risk > 0 ? profitLoss / risk : 0;
  const symbol = data.get("symbol");

  return {
    date: data.get("date"),
    symbol,
    contractName: CONTRACTS[symbol]?.name ?? symbol,
    side,
    setup: data.get("setup").trim() || "Unlabeled",
    mood: data.get("mood"),
    entry,
    exit,
    quantity,
    pointValue,
    commission,
    risk,
    notes: data.get("notes").trim(),
    points,
    grossProfitLoss,
    profitLoss,
    rMultiple,
  };
}

function filteredTrades() {
  const query = searchInput.value.trim().toLowerCase();
  const outcome = outcomeFilter.value;

  return trades.filter((trade) => {
    const haystack = [
      trade.symbol,
      trade.contractName,
      trade.setup,
      trade.mood,
      trade.notes,
    ].join(" ").toLowerCase();

    const matchesQuery = !query || haystack.includes(query);
    const matchesOutcome = outcome === "all"
      || (outcome === "wins" && trade.profitLoss > 0)
      || (outcome === "losses" && trade.profitLoss < 0);

    return matchesQuery && matchesOutcome;
  });
}

function render() {
  const visibleTrades = filteredTrades();
  renderMetrics(visibleTrades);
  renderRows(visibleTrades);
  renderDailyGrid(visibleTrades);
  renderRecentTrades(visibleTrades);
  renderSecondarySections();

  const total = visibleTrades.length;
  resultCount.textContent = total === 1 ? "1 trade shown" : `${total} trades shown`;
  emptyState.style.display = visibleTrades.length === 0 ? "block" : "none";
  emptyState.querySelector("h3").textContent = trades.length === 0 ? "No trades recorded" : "No matches found";
  emptyState.querySelector("p").textContent = trades.length === 0
    ? "Add your first futures trade or load samples to see the dashboard come alive."
    : "Adjust the search or outcome filter to bring trades back into view.";
  document.querySelector(".table-wrap").style.display = visibleTrades.length ? "block" : "none";
}

function renderSecondarySections() {
  renderPlaybook(trades);
  renderReports(trades);
  renderProbabilities(trades);
  renderStatsMatrix();
}

function renderScorecard() {
  scorecardGrid.replaceChildren();
  const review = currentReview();
  const scores = review.scores;
  dailyReviewNote.value = review.note ?? "";
  loadMarketContext(review.context ?? {});

  SCORE_SECTIONS.forEach((section) => {
    const card = document.createElement("article");
    card.className = `score-section ${section.penalty ? "penalty-section" : ""}`;

    const rows = section.items.map((item) => {
      const value = scores[item.id] ?? 0;
      const maxLabel = section.penalty ? item.max : `/${item.max}`;
      return `
        <label class="score-row">
          <span>${item.label}</span>
          <div class="score-input-wrap">
            <input
              type="number"
              data-score-id="${item.id}"
              min="${section.penalty ? item.max : 0}"
              max="${section.penalty ? 0 : item.max}"
              step="1"
              value="${value}"
            >
            <small>${maxLabel}</small>
          </div>
        </label>
      `;
    }).join("");

    card.innerHTML = `
      <div class="score-section-header">
        <h3>${section.title}</h3>
        <strong>${sectionTotal(section)}</strong>
      </div>
      ${rows}
    `;

    scorecardGrid.append(card);
  });

  scorecardGrid.querySelectorAll("[data-score-id]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const target = event.currentTarget;
      currentReview().scores[target.dataset.scoreId] = Number(target.value) || 0;
      saveScorecard();
      updateScoreSummary();
      updateSectionTotals();
      renderDailyGrid(filteredTrades());
    });
  });

  updateScoreSummary();
}

function renderMetrics(items) {
  const net = sum(items.map((trade) => trade.profitLoss));
  const grossWins = sum(items.filter((trade) => trade.profitLoss > 0).map((trade) => trade.profitLoss));
  const grossLosses = Math.abs(sum(items.filter((trade) => trade.profitLoss < 0).map((trade) => trade.profitLoss)));
  const wins = items.filter((trade) => trade.profitLoss > 0).length;
  const losses = items.filter((trade) => trade.profitLoss < 0).length;
  const breakeven = items.filter((trade) => trade.profitLoss === 0).length;
  const winRate = items.length ? Math.round((wins / items.length) * 100) : 0;
  const expectancy = items.length ? net / items.length : 0;
  const profitFactor = grossLosses > 0 ? grossWins / grossLosses : grossWins > 0 ? Infinity : 0;
  const commissions = sum(items.map((trade) => trade.commission || 0));
  const avgWin = wins ? grossWins / wins : 0;
  const avgLoss = losses ? grossLosses / losses : 0;
  const winLossSpread = avgWin - avgLoss;
  const maxAvgSide = Math.max(avgWin, avgLoss, 1);
  const dayStreak = currentDayStreak(items);
  const tradeStreak = currentTradeStreak(items);

  metrics.net.textContent = currency.format(net);
  metrics.net.className = net >= 0 ? "profit" : "loss";
  metrics.netCaption.textContent = `${currency.format(commissions)} commissions`;
  metrics.winRate.textContent = `${winRate}%`;
  metrics.wins.textContent = wins;
  metrics.breakeven.textContent = breakeven;
  metrics.losses.textContent = losses;
  metrics.record.textContent = `${wins}W / ${losses}L`;
  metrics.profitFactor.textContent = Number.isFinite(profitFactor) ? profitFactor.toFixed(2) : "MAX";
  metrics.expectancy.textContent = currency.format(expectancy);
  metrics.expectancy.className = expectancy >= 0 ? "profit" : "loss";
  metrics.winLossSpread.textContent = currency.format(winLossSpread);
  metrics.winLossSpread.className = winLossSpread >= 0 ? "profit" : "loss";
  metrics.avgWin.textContent = currency.format(avgWin);
  metrics.avgLoss.textContent = `-${currency.format(avgLoss).replace("-", "")}`;
  metrics.avgWinBar.style.width = `${Math.max(5, (avgWin / maxAvgSide) * 100)}%`;
  metrics.avgLossBar.style.width = `${Math.max(5, (avgLoss / maxAvgSide) * 100)}%`;
  metrics.dayStreak.textContent = `${Math.abs(dayStreak)} ${Math.abs(dayStreak) === 1 ? "day" : "days"}`;
  metrics.dayStreak.className = dayStreak >= 0 ? "profit" : "loss";
  metrics.tradeStreak.textContent = `${Math.abs(tradeStreak)} ${Math.abs(tradeStreak) === 1 ? "trade" : "trades"}`;
  metrics.tradeStreak.className = tradeStreak >= 0 ? "profit" : "loss";
  metrics.trades.textContent = items.length === 1 ? "1 trade total" : `${items.length} trades total`;
  metrics.winGauge.style.setProperty("--win-rate", `${winRate}%`);
  updateScoreSummary();
}

function scoreTotals(date = selectedReviewDate()) {
  const review = scorecards[date] ?? { scores: {} };
  const scores = review.scores ?? {};
  const positiveItems = SCORE_SECTIONS.flatMap((section) => section.penalty ? [] : section.items);
  const penaltyItems = SCORE_SECTIONS.flatMap((section) => section.penalty ? section.items : []);
  const max = sum(positiveItems.map((item) => item.max));
  const earned = sum(positiveItems.map((item) => scores[item.id] ?? 0));
  const penalties = sum(penaltyItems.map((item) => scores[item.id] ?? 0));
  const rawTotal = earned + penalties;
  const percent = max > 0 ? Math.max(0, Math.round((rawTotal / max) * 100)) : 0;

  return { max, earned, penalties, total: rawTotal, percent, grade: gradeFromPercent(percent) };
}

function gradeFromPercent(percent) {
  if (percent >= 95) return "A+ Elite execution";
  if (percent >= 90) return "A Clean day";
  if (percent >= 80) return "B Minor errors";
  if (percent >= 70) return "C Needs review";
  if (percent >= 60) return "D Rule breaks";
  return "F Protect capital";
}

function updateScoreSummary() {
  if (!scoreSummary.percent) return;
  const totals = scoreTotals();
  const pointsLabel = `${totals.total} / ${totals.max} points`;

  metrics.scoreGrade.textContent = `Scorecard: ${totals.percent}% - ${totals.grade}`;
  scoreSummary.percent.textContent = `${totals.percent}%`;
  scoreSummary.grade.textContent = totals.grade;
  scoreSummary.points.textContent = pointsLabel;
}

function updateSectionTotals() {
  document.querySelectorAll(".score-section").forEach((sectionNode, index) => {
    sectionNode.querySelector(".score-section-header strong").textContent = sectionTotal(SCORE_SECTIONS[index]);
  });
}

function sectionTotal(section) {
  const scores = currentReview().scores;
  const total = sum(section.items.map((item) => scores[item.id] ?? 0));
  const max = sum(section.items.map((item) => item.max));
  return section.penalty ? `${total}` : `${total}/${max}`;
}

function markPerfectScorecard() {
  const scores = currentReview().scores;
  SCORE_SECTIONS.forEach((section) => {
    section.items.forEach((item) => {
      scores[item.id] = section.penalty ? 0 : item.max;
    });
  });
  saveScorecard();
  renderScorecard();
  renderDailyGrid(filteredTrades());
}

function resetScorecard() {
  scorecards[selectedReviewDate()] = { scores: {}, note: "", context: {} };
  saveScorecard();
  renderScorecard();
  renderDailyGrid(filteredTrades());
}

function saveDailyReviewNote() {
  currentReview().note = dailyReviewNote.value;
  saveScorecard();
  renderDailyGrid(filteredTrades());
}

function loadMarketContext(context) {
  Object.entries(contextInputs).forEach(([key, input]) => {
    input.value = context[key] ?? "";
  });
}

function saveMarketContext() {
  const review = currentReview();
  review.context = Object.fromEntries(Object.entries(contextInputs).map(([key, input]) => [key, input.value]));
  saveScorecard();
  renderDailyGrid(filteredTrades());
  renderProbabilities(trades);
}

function renderRows(items) {
  tradeRows.replaceChildren();

  items.forEach((trade) => {
    const row = rowTemplate.content.firstElementChild.cloneNode(true);
    row.querySelector(".date-cell").textContent = dateFormatter.format(new Date(`${trade.date}T00:00:00`));
    row.querySelector(".symbol-cell").textContent = trade.symbol;
    row.querySelector(".side-cell").textContent = trade.side;
    row.querySelector(".quantity-cell").textContent = `${trade.quantity}x`;
    row.querySelector(".points-cell").textContent = `${trade.points.toFixed(2)} pts`;

    const plCell = row.querySelector(".pl-cell");
    plCell.textContent = currency.format(trade.profitLoss);
    plCell.classList.add(trade.profitLoss >= 0 ? "profit" : "loss");

    const rCell = row.querySelector(".r-cell");
    rCell.textContent = `${trade.rMultiple.toFixed(2)}R`;
    rCell.classList.add(trade.rMultiple >= 0 ? "profit" : "loss");

    row.querySelector(".setup-cell").textContent = trade.setup;
    row.querySelector(".edit-button").addEventListener("click", () => editTrade(trade.id));
    row.querySelector(".delete-button").addEventListener("click", () => deleteTrade(trade.id));
    tradeRows.append(row);
  });
}

function renderDailyGrid(items) {
  dailyGrid.replaceChildren();

  const dailyTotals = items.reduce((days, trade) => {
    if (!days[trade.date]) {
      days[trade.date] = { profitLoss: 0, trades: 0 };
    }
    days[trade.date].profitLoss += trade.profitLoss;
    days[trade.date].trades += 1;
    return days;
  }, {});

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const leadingBlankDays = firstDay.getDay();
  const totalCells = Math.ceil((leadingBlankDays + lastDay.getDate()) / 7) * 7;
  const weekTotals = monthlyWeekTotals(dailyTotals, year, month, totalCells, leadingBlankDays);

  calendarMonthLabel.textContent = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(calendarDate);

  for (let index = 0; index < totalCells; index += 1) {
    const dayNumber = index - leadingBlankDays + 1;
    if (dayNumber < 1 || dayNumber > lastDay.getDate()) {
      const blank = document.createElement("div");
      blank.className = "day-cell blank-day";
      dailyGrid.append(blank);
      if (index % 7 === 6) {
        dailyGrid.append(weekTotalCell(weekTotals[Math.floor(index / 7)]));
      }
      continue;
    }

    const date = formatDateKey(new Date(year, month, dayNumber));
    const daily = dailyTotals[date] ?? { profitLoss: 0, trades: 0 };
    const total = daily.profitLoss;
    const totals = scoreTotals(date);
    const hasReview = hasScoreForDate(date);
    const hasScreenshot = Boolean(screenshots[date]);
    const hasTrades = Object.hasOwn(dailyTotals, date);
    const cell = document.createElement("div");
    cell.className = [
      "day-cell",
      hasTrades ? (total >= 0 ? "win" : "loss") : "",
      date === selectedReviewDate() ? "selected-day" : "",
    ].filter(Boolean).join(" ");
    cell.tabIndex = 0;
    cell.setAttribute("role", "button");
    cell.setAttribute("aria-label", `Open review for ${date}`);
    cell.innerHTML = `
      <strong>${dayNumber}</strong>
      <span>${hasTrades ? currency.format(total) : ""}</span>
      <small>${hasTrades ? daily.trades + " trades" : hasReview ? totals.percent + "%" : ""}</small>
      <em>${hasScreenshot ? "Chart" : ""}</em>
    `;
    cell.addEventListener("click", () => selectReviewDate(date));
    cell.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectReviewDate(date);
      }
    });
    dailyGrid.append(cell);
    if (index % 7 === 6) {
      dailyGrid.append(weekTotalCell(weekTotals[Math.floor(index / 7)]));
    }
  }
}

function monthlyWeekTotals(dailyTotals, year, month, totalCells, leadingBlankDays) {
  const weeks = [];
  const lastDay = new Date(year, month + 1, 0).getDate();

  for (let index = 0; index < totalCells; index += 1) {
    const weekIndex = Math.floor(index / 7);
    const dayNumber = index - leadingBlankDays + 1;
    if (!weeks[weekIndex]) {
      weeks[weekIndex] = { profitLoss: 0, trades: 0 };
    }
    if (dayNumber >= 1 && dayNumber <= lastDay) {
      const date = formatDateKey(new Date(year, month, dayNumber));
      weeks[weekIndex].profitLoss += dailyTotals[date]?.profitLoss ?? 0;
      weeks[weekIndex].trades += dailyTotals[date]?.trades ?? 0;
    }
  }

  return weeks;
}

function weekTotalCell(total) {
  const cell = document.createElement("div");
  const profitLoss = total?.profitLoss ?? 0;
  const trades = total?.trades ?? 0;
  cell.className = `week-total-cell ${profitLoss > 0 ? "win" : profitLoss < 0 ? "loss" : ""}`;
  cell.innerHTML = `
    <strong>${currency.format(profitLoss)}</strong>
    <span>${trades} ${trades === 1 ? "trade" : "trades"}</span>
  `;
  return cell;
}

function changeCalendarMonth(offset) {
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + offset, 1);
  renderDailyGrid(filteredTrades());
}

function selectReviewDate(date) {
  scorecardDate.value = date;
  screenshotDate.value = date;
  renderScorecard();
  renderScreenshot();
  renderDailyGrid(filteredTrades());
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hasScoreForDate(date) {
  const scores = scorecards[date]?.scores ?? {};
  return Object.values(scores).some((value) => Number(value) !== 0);
}

function renderRecentTrades(items) {
  recentTradesList.replaceChildren();

  const recent = [...items]
    .sort((a, b) => new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`))
    .slice(0, 10);

  if (!recent.length) {
    recentTradesList.append(emptyMiniState("No recent trades yet"));
    return;
  }

  const header = document.createElement("div");
  header.className = "recent-trade-row recent-trade-head";
  header.innerHTML = `
    <span>Symbol</span>
    <span>Close Date</span>
    <span>Net P&L</span>
  `;
  recentTradesList.append(header);

  recent.forEach((trade) => {
    const row = document.createElement("div");
    row.className = "recent-trade-row";
    row.innerHTML = `
      <strong>${trade.symbol}</strong>
      <span>${trade.date}</span>
      <b class="${trade.profitLoss >= 0 ? "profit" : "loss"}">${currency.format(trade.profitLoss)}</b>
    `;
    recentTradesList.append(row);
  });
}

function renderPlaybook(items) {
  playbookGrid.replaceChildren();
  const groups = groupedStats(items, (trade) => trade.setup || "Unlabeled")
    .sort((a, b) => b.trades - a.trades || b.net - a.net);

  if (!groups.length) {
    playbookGrid.append(emptyAnalysisCard("No setup data yet", "Log trades with setup names to build your playbook."));
    return;
  }

  groups.forEach((group) => {
    playbookGrid.append(analysisCard(group.key, [
      ["Trades", group.trades],
      ["Win Rate", `${group.winRate}%`],
      ["Expectancy", currency.format(group.expectancy)],
      ["Net P&L", currency.format(group.net)],
    ], group.net >= 0 ? "positive-card" : "negative-card"));
  });
}

function renderReports(items) {
  reportsGrid.replaceChildren();
  const monthly = groupedStats(items, (trade) => trade.date.slice(0, 7))
    .sort((a, b) => b.key.localeCompare(a.key));
  const byMood = groupedStats(items, (trade) => trade.mood || "Unlabeled")
    .sort((a, b) => b.net - a.net);
  const bestMonth = monthly[0];
  const bestMood = byMood[0];
  const reviewedDays = Object.keys(scorecards).filter((date) => hasScoreForDate(date)).length;
  const screenshotDays = Object.keys(screenshots).length;

  reportsGrid.append(analysisCard("Current Month", [
    ["Trades", bestMonth?.trades ?? 0],
    ["Win Rate", bestMonth ? `${bestMonth.winRate}%` : "0%"],
    ["Expectancy", currency.format(bestMonth?.expectancy ?? 0)],
    ["Net P&L", currency.format(bestMonth?.net ?? 0)],
  ], (bestMonth?.net ?? 0) >= 0 ? "positive-card" : "negative-card"));

  reportsGrid.append(analysisCard("Best Mood", [
    ["Mood", bestMood?.key ?? "None"],
    ["Trades", bestMood?.trades ?? 0],
    ["Win Rate", bestMood ? `${bestMood.winRate}%` : "0%"],
    ["Net P&L", currency.format(bestMood?.net ?? 0)],
  ], (bestMood?.net ?? 0) >= 0 ? "positive-card" : "negative-card"));

  reportsGrid.append(analysisCard("Review Discipline", [
    ["Scored Days", reviewedDays],
    ["Chart Days", screenshotDays],
    ["Saved Trades", items.length],
    ["Imported", items.filter((trade) => trade.source === "tradovate").length],
  ]));
}

function renderProbabilities(items) {
  renderPatternProbabilityCharts();
  probabilityRows.replaceChildren();
  const groups = groupedStats(items, conditionalKey)
    .filter((group) => group.trades > 0)
    .sort((a, b) => b.trades - a.trades || b.expectancy - a.expectancy);

  if (!groups.length) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="8">No trades available for probability analysis.</td>`;
    probabilityRows.append(row);
    return;
  }

  groups.forEach((group) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Condition">${group.key}</td>
      <td data-label="Trades">${group.trades}</td>
      <td data-label="Win Rate">${group.winRate}%</td>
      <td data-label="Expectancy" class="${group.expectancy >= 0 ? "profit" : "loss"}">${currency.format(group.expectancy)}</td>
      <td data-label="Profit Factor">${Number.isFinite(group.profitFactor) ? group.profitFactor.toFixed(2) : "MAX"}</td>
      <td data-label="Net P&L" class="${group.net >= 0 ? "profit" : "loss"}">${currency.format(group.net)}</td>
      <td data-label="Best" class="profit">${currency.format(group.best)}</td>
      <td data-label="Worst" class="loss">${currency.format(group.worst)}</td>
    `;
    probabilityRows.append(row);
  });
}

function renderStatsMatrix() {
  statsMatrix.replaceChildren();
  const closest = closestLiveReference();

  matrixSummary.textContent = closest
    ? `Closest reference: ${closest.label} is ${closest.distance.toFixed(2)} points away from current price.`
    : "Enter current price and levels to highlight the closest market reference.";

  STATS_MATRIX_SECTIONS.forEach((section) => {
    const table = document.createElement("div");
    table.className = "stats-matrix-table";
    table.innerHTML = `
      <h3>${section.title}</h3>
      <div class="stats-row stats-head">
        <span>Reference</span>
        ${STATS_MATRIX_COLUMNS.slice(0, 7).map((column) => `<b>${column}</b>`).join("")}
      </div>
      ${section.rows.map(([label, values]) => `
        <div class="stats-row ${isHighlightedStat(label, closest?.label) ? "live-stat-row" : ""}">
          <span>${label}</span>
          ${values.map((value) => `<b class="${heatClass(value)}">${formatPercent(value)}</b>`).join("")}
        </div>
      `).join("")}
    `;
    statsMatrix.append(table);
  });
}

function closestLiveReference() {
  const current = Number(liveLevelInputs.current.value);
  if (!current) return null;

  const references = [
    ["ONH", liveLevelInputs.onh.value],
    ["ONL", liveLevelInputs.onl.value],
    ["pVAH", liveLevelInputs.pvah.value],
    ["pVAL", liveLevelInputs.pval.value],
    ["pVPOC", liveLevelInputs.ppoc.value],
    ["pMid", liveLevelInputs.pmid.value],
    ["IBH", liveLevelInputs.ibh.value],
    ["IBL", liveLevelInputs.ibl.value],
  ]
    .map(([label, value]) => ({ label, value: Number(value) }))
    .filter((item) => Number.isFinite(item.value) && item.value > 0)
    .map((item) => ({ ...item, distance: Math.abs(current - item.value) }))
    .sort((a, b) => a.distance - b.distance);

  return references[0] ?? null;
}

function isHighlightedStat(rowLabel, closestLabel) {
  if (!closestLabel) return false;
  return rowLabel.toLowerCase().includes(closestLabel.toLowerCase());
}

function heatClass(value) {
  if (value >= 90) return "heat-strong";
  if (value >= 75) return "heat-high";
  if (value >= 55) return "heat-mid";
  if (value >= 35) return "heat-low";
  return "heat-cold";
}

function renderPatternProbabilityCharts() {
  probabilityChartGrid.replaceChildren();

  probabilityChartGrid.append(stackedBarCard("Gap Fill Report", BENCHMARK_PATTERN_REPORTS.gapFill, "NQ gap fill"));

  probabilityChartGrid.append(pieCard("Inside Bars", BENCHMARK_PATTERN_REPORTS.insideBars, "NQ inside bars"));

  probabilityChartGrid.append(stackedBarCard("Opening Candle Continuation", BENCHMARK_PATTERN_REPORTS.openingCandle, "NQ 30min opening candle continuation"));

  probabilityChartGrid.append(stackedBarCard("Outside Day Reversal", BENCHMARK_PATTERN_REPORTS.outsideReversal, "NQ outside days"));

  probabilityChartGrid.append(stackedBarCard("Green & Red Days By Weekday", BENCHMARK_PATTERN_REPORTS.weekdayColor, "NQ green & red days by weekday"));

  probabilityChartGrid.append(simpleBarCard("High & Low By Weekday", BENCHMARK_PATTERN_REPORTS.highLow, "NQ high & low by weekday"));
}

function dailyContexts() {
  return Object.entries(scorecards)
    .map(([date, review]) => ({ date, context: review.context ?? {} }))
    .filter((item) => Object.values(item.context).some(Boolean));
}

function percentPair(label, items, predicate, positiveLabel, negativeLabel) {
  const total = items.length;
  const positive = total ? items.filter(predicate).length : 0;
  const positivePercent = total ? Math.round((positive / total) * 100) : 0;
  return {
    label,
    total,
    positiveLabel,
    negativeLabel,
    positivePercent,
    negativePercent: total ? 100 - positivePercent : 0,
  };
}

function weekdayPairs(contexts) {
  return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((weekday) => {
    const items = contexts.filter((item) => weekdayName(item.date) === weekday && item.context.dayColor);
    return percentPair(weekday.slice(0, 3), items, (item) => item.context.dayColor === "green", "green", "red");
  });
}

function weekdayBinary(contexts, field) {
  return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((weekday) => {
    const items = contexts.filter((item) => weekdayName(item.date) === weekday);
    const count = items.filter((item) => item.context[field] === "yes").length;
    return {
      label: weekday.slice(0, 3),
      percent: items.length ? Math.round((count / items.length) * 100) : 0,
      total: items.length,
    };
  });
}

function weekdayName(date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date(`${date}T00:00:00`));
}

function stackedBarCard(title, pairs, subtitle) {
  const card = document.createElement("article");
  card.className = "pattern-card";
  card.innerHTML = `
    <div class="pattern-card-head">
      <h3>${title}</h3>
      <p>${subtitle} | 9:30 am - 4:00 pm</p>
    </div>
    <div class="stacked-bars">
      ${pairs.map((pair) => `
        <div class="stacked-bar-wrap">
          <div class="stacked-bar">
            <span class="bar-negative" style="height:${pair.negativePercent}%">${pair.total ? formatPercent(pair.negativePercent) + " " + pair.negativeLabel : "no data"}</span>
            <span class="bar-positive" style="height:${pair.positivePercent}%">${pair.total ? formatPercent(pair.positivePercent) + " " + pair.positiveLabel : ""}</span>
          </div>
          <strong>${pair.label}</strong>
        </div>
      `).join("")}
    </div>
  `;
  return card;
}

function pieCard(title, pair, subtitle) {
  const card = document.createElement("article");
  card.className = "pattern-card";
  card.innerHTML = `
    <div class="pattern-card-head">
      <h3>${title}</h3>
      <p>${subtitle} | 9:30 am - 4:00 pm</p>
    </div>
    <div class="probability-pie" style="--slice:${pair.positivePercent}%">
      <span>${pair.total ? formatPercent(pair.positivePercent) : "No data"}</span>
    </div>
    <div class="chart-legend"><b></b>${pair.positiveLabel}<i></i>${pair.negativeLabel}</div>
  `;
  return card;
}

function simpleBarCard(title, groups, subtitle) {
  const card = document.createElement("article");
  card.className = "pattern-card wide-pattern-card";
  card.innerHTML = `
    <div class="pattern-card-head">
      <h3>${title}</h3>
      <p>${subtitle} | 9:30 am - 4:00 pm</p>
    </div>
    <div class="simple-chart-pair">
      ${groups.map((group) => `
        <div>
          <h4>${group.title}</h4>
          <div class="simple-bars">
            ${group.data.map((item) => `
              <div class="simple-bar-wrap">
                <span class="simple-bar" style="height:${Math.max(4, item.percent)}%">${item.total ? formatPercent(item.percent) : ""}</span>
                <strong>${item.label}</strong>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;
  return card;
}

function formatPercent(value) {
  return `${Number(value).toFixed(2).replace(/\.00$/, "")}%`;
}

function conditionalKey(trade) {
  const dimension = probabilityDimension.value;
  if (dimension === "setup") return trade.setup || "Unlabeled";
  if (dimension === "symbol") return trade.symbol || "Unknown";
  if (dimension === "side") return trade.side || "Unknown";
  if (dimension === "weekday") {
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date(`${trade.date}T00:00:00`));
  }
  if (dimension === "score") {
    const percent = scoreTotals(trade.date).percent;
    if (percent >= 90) return "90%+ score";
    if (percent >= 80) return "80-89% score";
    if (percent >= 70) return "70-79% score";
    if (percent > 0) return "Below 70% score";
    return "No scorecard";
  }
  if (dimension === "screenshot") return screenshots[trade.date] ? "Screenshot attached" : "No screenshot";
  return "Unknown";
}

function groupedStats(items, keyFn) {
  const map = new Map();
  items.forEach((trade) => {
    const key = keyFn(trade);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(trade);
  });

  return [...map.entries()].map(([key, group]) => statsForGroup(key, group));
}

function statsForGroup(key, group) {
  const wins = group.filter((trade) => trade.profitLoss > 0);
  const losses = group.filter((trade) => trade.profitLoss < 0);
  const net = sum(group.map((trade) => trade.profitLoss));
  const grossWins = sum(wins.map((trade) => trade.profitLoss));
  const grossLosses = Math.abs(sum(losses.map((trade) => trade.profitLoss)));
  return {
    key,
    trades: group.length,
    winRate: group.length ? Math.round((wins.length / group.length) * 100) : 0,
    expectancy: group.length ? net / group.length : 0,
    profitFactor: grossLosses > 0 ? grossWins / grossLosses : grossWins > 0 ? Infinity : 0,
    net,
    best: Math.max(...group.map((trade) => trade.profitLoss), 0),
    worst: Math.min(...group.map((trade) => trade.profitLoss), 0),
  };
}

function analysisCard(title, rows, tone = "") {
  const card = document.createElement("article");
  card.className = `analysis-card ${tone}`;
  card.innerHTML = `
    <h3>${title}</h3>
    ${rows.map(([label, value]) => `
      <div>
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `).join("")}
  `;
  return card;
}

function emptyAnalysisCard(title, message) {
  return analysisCard(title, [["Status", message]]);
}

function currentTradeStreak(items) {
  const closed = [...items].sort((a, b) => new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`));
  if (!closed.length) return 0;

  const direction = closed[0].profitLoss >= 0 ? 1 : -1;
  let streak = 0;
  for (const trade of closed) {
    if ((trade.profitLoss >= 0 ? 1 : -1) !== direction) break;
    streak += 1;
  }
  return streak * direction;
}

function currentDayStreak(items) {
  const daily = items.reduce((map, trade) => {
    map[trade.date] = (map[trade.date] || 0) + trade.profitLoss;
    return map;
  }, {});
  const days = Object.entries(daily).sort(([a], [b]) => new Date(`${b}T00:00:00`) - new Date(`${a}T00:00:00`));
  if (!days.length) return 0;

  const direction = days[0][1] >= 0 ? 1 : -1;
  let streak = 0;
  for (const [, total] of days) {
    if ((total >= 0 ? 1 : -1) !== direction) break;
    streak += 1;
  }
  return streak * direction;
}

function emptyMiniState(text) {
  const node = document.createElement("p");
  node.textContent = text;
  node.style.margin = "0";
  return node;
}

function editTrade(id) {
  const trade = trades.find((item) => item.id === id);
  if (!trade) return;

  editingId = id;
  formTitle.textContent = `Edit ${trade.symbol}`;
  cancelEditButton.classList.remove("hidden");

  Object.entries(trade).forEach(([key, value]) => {
    if (form.elements[key]) {
      form.elements[key].value = value;
    }
  });

  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteTrade(id) {
  trades = trades.filter((trade) => trade.id !== id);
  saveTrades();
  render();
}

function resetForm() {
  editingId = null;
  form.reset();
  document.querySelector("#date").valueAsDate = new Date();
  syncPointValue();
  formTitle.textContent = "Log Futures Trade";
  cancelEditButton.classList.add("hidden");
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function makeSample({ date, symbol, side, entry, exit, quantity, commission, risk, setup, mood, notes }) {
  const data = new FormData();
  Object.entries({ date, symbol, side, entry, exit, quantity, commission, risk, setup, mood, notes }).forEach(([key, value]) => {
    data.set(key, value);
  });
  data.set("pointValue", CONTRACTS[symbol].pointValue);
  return { ...tradeFromForm(data), id: crypto.randomUUID() };
}

function sampleTrades() {
  return [
    makeSample({
      date: "2026-05-15",
      symbol: "NQ",
      side: "Long",
      entry: 18842.25,
      exit: 18878.75,
      quantity: 2,
      commission: 9.6,
      risk: 520,
      setup: "Opening range breakout",
      mood: "Focused",
      notes: "Waited for retest, added only after new high held.",
    }),
    makeSample({
      date: "2026-05-15",
      symbol: "ES",
      side: "Short",
      entry: 5329.5,
      exit: 5322.25,
      quantity: 1,
      commission: 4.8,
      risk: 260,
      setup: "VWAP rejection",
      mood: "Patient",
      notes: "Clean rejection with sellers stacked at prior high.",
    }),
    makeSample({
      date: "2026-05-14",
      symbol: "MNQ",
      side: "Long",
      entry: 18795,
      exit: 18755.5,
      quantity: 5,
      commission: 12,
      risk: 300,
      setup: "Failed reclaim",
      mood: "Rushed",
      notes: "Took the reclaim before confirmation. Rule break.",
    }),
    makeSample({
      date: "2026-05-13",
      symbol: "CL",
      side: "Short",
      entry: 79.42,
      exit: 79.08,
      quantity: 1,
      commission: 5.2,
      risk: 240,
      setup: "Trend pullback",
      mood: "Calm",
      notes: "Best trade of the week. Stop stayed above structure.",
    }),
  ];
}
