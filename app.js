const STORAGE_KEY = "futures-journal:v2";
const SCORE_STORAGE_KEY = "futures-scorecard:v1";
const SCREENSHOT_STORAGE_KEY = "futures-screenshots:v1";
const BIAS_STORAGE_KEY = "nq-bias-calculator:v1";

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
const csvInput = document.querySelector("#csvInput");
const csvImportStatus = document.querySelector("#csvImportStatus");
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
const saveScorecardButton = document.querySelector("#saveScorecardButton");
const scorecardSaveStatus = document.querySelector("#scorecardSaveStatus");
const scorecardDate = document.querySelector("#scorecardDate");
const dailyReviewNote = document.querySelector("#dailyReviewNote");
const screenshotDate = document.querySelector("#screenshotDate");
const screenshotInput = document.querySelector("#screenshotInput");
const screenshotImage = document.querySelector("#screenshotImage");
const screenshotCaption = document.querySelector("#screenshotCaption");
const clearScreenshotButton = document.querySelector("#clearScreenshotButton");
const contextScreenshotInput = document.querySelector("#contextScreenshotInput");
const contextScreenshotImage = document.querySelector("#contextScreenshotImage");
const contextScreenshotCaption = document.querySelector("#contextScreenshotCaption");
const clearContextScreenshotButton = document.querySelector("#clearContextScreenshotButton");
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
const rrInputs = {
  entry: document.querySelector("#rrEntryPrice"),
  target: document.querySelector("#rrTargetPrice"),
  stop: document.querySelector("#rrStopPrice"),
};
const rrOutput = {
  reward: document.querySelector("#rrRewardDistance"),
  risk: document.querySelector("#rrRiskDistance"),
  ratio: document.querySelector("#rrRatio"),
  verdict: document.querySelector("#rrVerdict"),
  card: document.querySelector("#rrVerdictCard"),
};
const statsMatrix = document.querySelector("#statsMatrix");
const matrixSummary = document.querySelector("#matrixSummary");
const inPlayGrid = document.querySelector("#inPlayGrid");
const targetFilterInputs = {
  bias: document.querySelector("#targetBias"),
  entry: document.querySelector("#targetEntry"),
  stop: document.querySelector("#targetStop"),
};
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
const planInputs = {
  date: document.querySelector("#planDate"),
  bias: document.querySelector("#planBias"),
  maxTrades: document.querySelector("#planMaxTrades"),
  maxLoss: document.querySelector("#planMaxLoss"),
  dayType: document.querySelector("#planDayType"),
  news: document.querySelector("#planNews"),
  levels: document.querySelector("#planLevels"),
  bullish: document.querySelector("#planBullish"),
  bearish: document.querySelector("#planBearish"),
  neutral: document.querySelector("#planNeutral"),
  marketIdeas: document.querySelector("#planMarketIdeas"),
  chartInput: document.querySelector("#planChartInput"),
  chartImage: document.querySelector("#planChartImage"),
  chartCaption: document.querySelector("#planChartCaption"),
  checklistNews: document.querySelector("#planChecklistNews"),
  checklistLevels: document.querySelector("#planChecklistLevels"),
  checklistRisk: document.querySelector("#planChecklistRisk"),
  checklistNoChase: document.querySelector("#planChecklistNoChase"),
};
const savePlanButton = document.querySelector("#savePlanButton");
const clearPlanButton = document.querySelector("#clearPlanButton");
const clearPlanChartButton = document.querySelector("#clearPlanChartButton");
const planSaveStatus = document.querySelector("#planSaveStatus");
const imageLightbox = document.querySelector("#imageLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCaption = document.querySelector("#lightboxCaption");
const lightboxCloseButton = document.querySelector("#lightboxCloseButton");
const liveClock = document.querySelector("#liveClock");
const focusTimer = document.querySelector("#focusTimer");
const sessionNotice = document.querySelector("#sessionNotice");
const breakAlert = document.querySelector("#breakAlert");
const dismissBreakButton = document.querySelector("#dismissBreakButton");
const stopTimerButton = document.querySelector("#stopTimerButton");
const biasInputGrid = document.querySelector("#biasInputGrid");
const biasDriverRows = document.querySelector("#biasDriverRows");
const biasLibraryRows = document.querySelector("#biasLibraryRows");
const biasRecalculateButton = document.querySelector("#biasRecalculateButton");
const biasSaveButton = document.querySelector("#biasSaveButton");
const biasResetInputsButton = document.querySelector("#biasResetInputsButton");
const biasAddStatButton = document.querySelector("#biasAddStatButton");
const biasRestoreButton = document.querySelector("#biasRestoreButton");
const biasOutput = {
  longPercent: document.querySelector("#biasLongPercent"),
  shortPercent: document.querySelector("#biasShortPercent"),
  longLabel: document.querySelector("#biasLongLabel"),
  shortLabel: document.querySelector("#biasShortLabel"),
  score: document.querySelector("#biasScore"),
  driverCount: document.querySelector("#biasDriverCount"),
  longPressure: document.querySelector("#biasLongPressure"),
  shortPressure: document.querySelector("#biasShortPressure"),
  longPressureLabel: document.querySelector("#biasLongPressureLabel"),
  shortPressureLabel: document.querySelector("#biasShortPressureLabel"),
  narrative: document.querySelector("#biasNarrative"),
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

const BIAS_INPUTS = [
  { id: "weekday", label: "Weekday", options: [["weekday_mon", "Monday"], ["weekday_tue", "Tuesday"], ["weekday_wed", "Wednesday"], ["weekday_thu", "Thursday"], ["weekday_fri", "Friday"]] },
  { id: "open15", label: "15 min opening candle", options: [["open15_green", "Green candle"], ["open15_red", "Red candle"]] },
  { id: "open30", label: "30 min opening candle", options: [["open30_green", "Green candle"], ["open30_red", "Red candle"]] },
  { id: "open60", label: "60 min opening candle", options: [["open60_green", "Green candle"], ["open60_red", "Red candle"]] },
  { id: "ib30", label: "IB30 first break", options: [["ibh30_first", "IBH30 first"], ["ibl30_first", "IBL30 first"]] },
  { id: "openingSwing", label: "Opening swing first break", options: [["onh_first", "ONH first"], ["onl_first", "ONL first"]] },
  { id: "previousValue", label: "Vs previous day value", options: [["outside_prev_value", "Outside previous value"], ["inside_prev_value", "Inside previous value"]] },
  { id: "previousRange", label: "Vs previous day range", options: [["outside_prev_range", "Outside previous range"], ["inside_prev_range", "Inside previous range"]] },
  { id: "structure", label: "Extra structure level", options: [["gap_up", "Gap up"], ["gap_down", "Gap down"], ["prior_high", "Prior high first"], ["prior_low", "Prior low first"]] },
];

const DEFAULT_BIAS_STATS = [
  { key: "open15_green", description: "15m opening candle green", bull: 66.67, weight: 1.00, notes: "From screenshot" },
  { key: "open15_red", description: "15m opening candle red", bull: 32.79, weight: 1.00, notes: "From screenshot" },
  { key: "open30_green", description: "30m opening candle green", bull: 67.11, weight: 1.10, notes: "From screenshot" },
  { key: "open30_red", description: "30m opening candle red", bull: 27.78, weight: 1.10, notes: "From screenshot" },
  { key: "open60_green", description: "60m opening candle green", bull: 74.65, weight: 1.20, notes: "From screenshot" },
  { key: "open60_red", description: "60m opening candle red", bull: 22.03, weight: 1.20, notes: "From screenshot" },
  { key: "weekday_mon", description: "Monday bias", bull: 74.07, weight: 0.70, notes: "Open-to-close screenshot" },
  { key: "weekday_tue", description: "Tuesday bias", bull: 40.74, weight: 0.70, notes: "Open-to-close screenshot" },
  { key: "weekday_wed", description: "Wednesday bias", bull: 42.31, weight: 0.70, notes: "Open-to-close screenshot" },
  { key: "weekday_thu", description: "Thursday bias", bull: 37.50, weight: 0.70, notes: "Open-to-close screenshot" },
  { key: "weekday_fri", description: "Friday bias", bull: 57.69, weight: 0.70, notes: "Open-to-close screenshot" },
  { key: "outside_prev_value", description: "Outside previous day value", bull: 64.50, weight: 0.90, notes: "Placeholder. Edit with your stats." },
  { key: "inside_prev_value", description: "Inside previous day value", bull: 50.00, weight: 0.70, notes: "Neutral placeholder" },
  { key: "outside_prev_range", description: "Outside previous day range", bull: 61.00, weight: 0.90, notes: "Placeholder. Edit with your stats." },
  { key: "inside_prev_range", description: "Inside previous day range", bull: 50.00, weight: 0.70, notes: "Neutral placeholder" },
  { key: "ibh30_first", description: "IBH30 broke first", bull: 68.70, weight: 1.15, notes: "Stats matrix IBH row" },
  { key: "ibl30_first", description: "IBL30 broke first", bull: 37.40, weight: 1.15, notes: "Inverse of IBL pressure" },
  { key: "onh_first", description: "ONH broke first", bull: 67.20, weight: 1.00, notes: "Stats matrix ONH row" },
  { key: "onl_first", description: "ONL broke first", bull: 45.10, weight: 1.00, notes: "Inverse of ONL pressure" },
  { key: "gap_up", description: "Gap up continuation", bull: 58.00, weight: 0.80, notes: "Gap fill screenshot" },
  { key: "gap_down", description: "Gap down continuation", bull: 40.00, weight: 0.80, notes: "Gap fill screenshot inverse" },
  { key: "prior_high", description: "Prior high first", bull: 63.00, weight: 0.85, notes: "Editable structure stat" },
  { key: "prior_low", description: "Prior low first", bull: 38.00, weight: 0.85, notes: "Editable structure stat" },
];

const SESSION_WINDOWS = [
  { name: "Globex", open: 18 * 60, close: 17 * 60 },
  { name: "Asia", open: 20 * 60, close: 24 * 60 },
  { name: "London", open: 3 * 60, close: 8 * 60 + 30 },
  { name: "NY AM", open: 9 * 60 + 30, close: 12 * 60 },
  { name: "NY PM", open: 13 * 60, close: 16 * 60 },
];

let trades = loadTrades();
let scorecards = loadScorecard();
let screenshots = loadScreenshots();
let tradePlans = loadTradePlans();
let biasState = loadBiasState();
let editingId = null;
let calendarDate = new Date();
let serverSyncReady = false;
let saveTimer = null;
let focusStartedAt = Date.now();
let focusElapsedBeforePause = 0;
let timerRunning = true;
let lastBreakHour = 0;
let lastSessionEventKey = "";

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
planInputs.date.valueAsDate = new Date();
syncPointValue();
renderScorecard();
renderScreenshot();
renderTradePlan();
renderBiasCalculator();
renderRrValidator();
render();
updateClockBar();
window.setInterval(updateClockBar, 1000);
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
csvInput.addEventListener("change", importCsvTrades);
perfectScoreButton.addEventListener("click", markPerfectScorecard);
resetScoreButton.addEventListener("click", resetScorecard);
saveScorecardButton.addEventListener("click", saveDailyReview);
scorecardDate.addEventListener("change", () => {
  screenshotDate.value = scorecardDate.value;
  renderScorecard();
  renderScreenshot();
  renderDailyGrid(filteredTrades());
  setScorecardSaveStatus("Loaded selected day.");
});
dailyReviewNote.addEventListener("input", saveDailyReviewNote);
Object.values(contextInputs).forEach((input) => {
  input.addEventListener("change", saveMarketContext);
});
Object.values(liveLevelInputs).forEach((input) => {
  input.addEventListener("input", renderStatsMatrix);
});
Object.values(targetFilterInputs).forEach((input) => {
  input.addEventListener("input", renderStatsMatrix);
  input.addEventListener("change", renderStatsMatrix);
});
Object.values(rrInputs).forEach((input) => {
  input.addEventListener("input", renderRrValidator);
});
planInputs.date.addEventListener("change", renderTradePlan);
Object.entries(planInputs).forEach(([key, input]) => {
  if (["date", "chartInput", "chartImage", "chartCaption"].includes(key)) return;
  input.addEventListener("input", saveTradePlan);
  input.addEventListener("change", saveTradePlan);
});
savePlanButton.addEventListener("click", saveTradePlan);
clearPlanButton.addEventListener("click", clearTradePlan);
planInputs.chartInput.addEventListener("change", savePlanChart);
planInputs.chartImage.addEventListener("click", () => openImageLightbox(planInputs.chartImage.src, planInputs.chartCaption.textContent));
clearPlanChartButton.addEventListener("click", clearPlanChart);
lightboxCloseButton.addEventListener("click", closeImageLightbox);
imageLightbox.addEventListener("click", (event) => {
  if (event.target === imageLightbox) closeImageLightbox();
});
dismissBreakButton.addEventListener("click", dismissBreakAlert);
stopTimerButton.addEventListener("click", toggleFocusTimer);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeImageLightbox();
});
biasRecalculateButton.addEventListener("click", renderBiasCalculator);
biasSaveButton.addEventListener("click", saveBiasState);
biasResetInputsButton.addEventListener("click", resetBiasInputs);
biasAddStatButton.addEventListener("click", addBiasStatRow);
biasRestoreButton.addEventListener("click", restoreBiasDefaults);
screenshotDate.addEventListener("change", () => {
  scorecardDate.value = screenshotDate.value;
  renderScorecard();
  renderScreenshot();
  renderDailyGrid(filteredTrades());
});
screenshotInput.addEventListener("change", (event) => saveScreenshotForDate(event, "execution"));
contextScreenshotInput.addEventListener("change", (event) => saveScreenshotForDate(event, "context"));
screenshotImage.addEventListener("click", () => openImageLightbox(screenshotImage.src, screenshotCaption.textContent));
contextScreenshotImage.addEventListener("click", () => openImageLightbox(contextScreenshotImage.src, contextScreenshotCaption.textContent));
clearScreenshotButton.addEventListener("click", () => clearScreenshotForDate("execution"));
clearContextScreenshotButton.addEventListener("click", () => clearScreenshotForDate("context"));
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
document.querySelectorAll("[data-section-jump]").forEach((button) => {
  button.addEventListener("click", () => showSection(button.dataset.sectionJump));
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
  setScorecardSaveStatus("Saved locally. Syncing...");
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

function loadTradePlans() {
  try {
    return JSON.parse(localStorage.getItem("futures-trade-plans:v1")) ?? {};
  } catch {
    return {};
  }
}

function saveTradePlans() {
  localStorage.setItem("futures-trade-plans:v1", JSON.stringify(tradePlans));
  scheduleServerSave();
}

function loadBiasState() {
  try {
    const stored = JSON.parse(localStorage.getItem(BIAS_STORAGE_KEY));
    return {
      inputs: stored?.inputs ?? {},
      stats: Array.isArray(stored?.stats) && stored.stats.length ? stored.stats : structuredClone(DEFAULT_BIAS_STATS),
    };
  } catch {
    return { inputs: {}, stats: structuredClone(DEFAULT_BIAS_STATS) };
  }
}

function saveBiasState() {
  localStorage.setItem(BIAS_STORAGE_KEY, JSON.stringify(biasState));
  renderBiasCalculator();
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

    if (data.tradePlans && Object.keys(data.tradePlans).length) {
      tradePlans = { ...tradePlans, ...data.tradePlans };
    }

    saveLocalOnly();
    renderScorecard();
    renderScreenshot();
    renderTradePlan();
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
  localStorage.setItem("futures-trade-plans:v1", JSON.stringify(tradePlans));
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
      body: JSON.stringify({ trades, scorecards, screenshots, tradePlans }),
    });
    setScorecardSaveStatus("Saved to this device and server.");
  } catch {
    serverSyncReady = false;
    setScorecardSaveStatus("Saved on this device. Server sync paused.");
  }
}

async function saveScreenshotForDate(event, type = "execution") {
  const file = event.target.files?.[0];
  const date = screenshotDate.value;
  if (!file || !date) return;

  const dataUrl = await resizeImage(file, 1400, 0.82);
  const dailyScreenshots = normalizeDailyScreenshots(screenshots[date]);
  dailyScreenshots[type] = {
    name: file.name,
    savedAt: new Date().toISOString(),
    dataUrl,
  };
  screenshots[date] = dailyScreenshots;
  saveScreenshots();
  renderScreenshot();
  renderDailyGrid(filteredTrades());
  event.target.value = "";
}

function clearScreenshotForDate(type = "execution") {
  const date = screenshotDate.value;
  if (!date || !screenshots[date]) return;
  const dailyScreenshots = normalizeDailyScreenshots(screenshots[date]);
  delete dailyScreenshots[type];
  if (!dailyScreenshots.execution && !dailyScreenshots.context) {
    delete screenshots[date];
  } else {
    screenshots[date] = dailyScreenshots;
  }
  saveScreenshots();
  renderScreenshot();
  renderDailyGrid(filteredTrades());
}

function renderScreenshot() {
  const date = screenshotDate.value;
  const dailyScreenshots = normalizeDailyScreenshots(screenshots[date]);

  renderScreenshotSlot({
    date,
    screenshot: dailyScreenshots.execution,
    image: screenshotImage,
    caption: screenshotCaption,
    emptyText: "No execution screenshot saved for this day.",
    label: "Execution screenshot",
  });
  renderScreenshotSlot({
    date,
    screenshot: dailyScreenshots.context,
    image: contextScreenshotImage,
    caption: contextScreenshotCaption,
    emptyText: "No TradingView chart saved for this day.",
    label: "TradingView chart",
  });
}

function normalizeDailyScreenshots(value) {
  if (!value) return {};
  if (value.dataUrl) return { execution: value };
  return value;
}

function renderScreenshotSlot({ date, screenshot, image, caption, emptyText, label }) {
  if (!screenshot?.dataUrl) {
    image.removeAttribute("src");
    image.style.display = "none";
    caption.textContent = emptyText;
    return;
  }

  image.src = screenshot.dataUrl;
  image.style.display = "block";
  image.title = "Click to enlarge";
  caption.textContent = `${label}: ${screenshot.name} saved for ${dateFormatter.format(new Date(`${date}T00:00:00`))}`;
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

async function importCsvTrades(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  csvImportStatus.textContent = `Reading ${file.name}...`;

  try {
    const text = await file.text();
    const { headers, rawHeaders, rows } = parseCsv(text);

    if (!headers.length || !rows.length) {
      csvImportStatus.textContent = "That CSV looks empty. Check the export and try again.";
      return;
    }

    const before = trades.length;
    const knownIds = new Set(trades.map((trade) => trade.sourceId || trade.id));
    const imported = [];
    let skipped = 0;

    rows.forEach((row) => {
      const trade = tradeFromCsvRow(row, headers);
      if (!trade) {
        skipped += 1;
        return;
      }

      if (knownIds.has(trade.sourceId)) {
        skipped += 1;
        return;
      }

      knownIds.add(trade.sourceId);
      imported.push(trade);
    });

    if (imported.length) {
      trades = [...imported, ...trades];
      saveTrades();
      render();
    }

    if (!imported.length) {
      const detectedColumns = rawHeaders.slice(0, 10).join(", ") || "none";
      csvImportStatus.textContent = `Imported 0 trades. I could not find a valid date and symbol/contract in the rows. Detected columns: ${detectedColumns}.`;
      return;
    }

    csvImportStatus.textContent = `Imported ${imported.length} trade${imported.length === 1 ? "" : "s"}. Skipped ${skipped}. Journal total: ${before + imported.length}.`;
  } catch (error) {
    csvImportStatus.textContent = `Import failed: ${error.message}`;
  } finally {
    event.target.value = "";
  }
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  const cleanText = text.replace(/^\uFEFF/, "");
  const delimiter = detectCsvDelimiter(cleanText);

  for (let index = 0; index < cleanText.length; index += 1) {
    const char = cleanText[index];
    const next = cleanText[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some((value) => value !== "")) rows.push(row);

  const rawHeaders = rows.shift() ?? [];
  const headers = rawHeaders.map(normalizeHeader);
  const dataRows = rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
  return { headers, rawHeaders, rows: dataRows };
}

function tradeFromCsvRow(row, headers) {
  const rawDate = readCsvValue(row, headers, ["date", "trade date", "close date", "closed date", "closing date", "open date", "entry date", "exit date", "timestamp", "time", "open time", "close time", "entry time", "exit time", "bought time", "boughttime", "sold time", "soldtime", "filled time", "fill time", "filled at", "created at", "execution time", "transaction date"]);
  const date = normalizeCsvDate(rawDate);
  const symbol = normalizeCsvSymbol(readCsvValue(row, headers, ["symbol", "contract", "instrument", "product", "market", "ticker", "name", "root", "underlying", "security", "security id"]));
  const importedPnl = parseCsvNumber(readCsvValue(row, headers, ["pnl", "p&l", "net pnl", "net p&l", "realized pnl", "realized p&l", "profit loss", "profit/loss", "pl", "net profit", "gross pnl", "gross p&l"]));
  const buyPrice = parseCsvNumber(readCsvValue(row, headers, ["buy price", "buyprice", "average buy price", "avg buy", "buy avg price"]));
  const sellPrice = parseCsvNumber(readCsvValue(row, headers, ["sell price", "sellprice", "average sell price", "avg sell", "sell avg price"]));
  const boughtTime = readCsvValue(row, headers, ["bought time", "boughttime", "buy time", "buytime"]);
  const soldTime = readCsvValue(row, headers, ["sold time", "soldtime", "sell time", "selltime"]);
  const side = normalizeCsvSide(
    readCsvValue(row, headers, ["side", "buy sell", "buy/sell", "b/s", "bs", "direction", "position", "action", "trade side", "order side"]),
    buyPrice,
    sellPrice,
    boughtTime,
    soldTime,
  );
  const rawEntry = parseCsvNumber(readCsvValue(row, headers, ["entry", "entry price", "entryprice", "avg entry", "avg entry price", "avgentryprice", "price in", "pricein", "open price", "openprice", "entry avg price"]));
  const rawExit = parseCsvNumber(readCsvValue(row, headers, ["exit", "exit price", "exitprice", "avg exit", "avg exit price", "avgexitprice", "price out", "priceout", "close price", "closeprice", "exit avg price", "fill price"]));
  const entry = Number.isFinite(rawEntry) ? rawEntry : side === "Short" ? sellPrice : buyPrice;
  const exit = Number.isFinite(rawExit) ? rawExit : side === "Short" ? buyPrice : sellPrice;
  const quantity = Math.max(1, Math.abs(parseCsvNumber(readCsvValue(row, headers, ["qty", "quantity", "contracts", "size", "filled qty", "filled quantity", "position size", "total qty", "total quantity"])) || 1));
  const commission = Math.abs(parseCsvNumber(readCsvValue(row, headers, ["commission", "commissions", "fees", "fee", "total fees", "total fee", "exchange fees", "clearing fees"])) || 0);
  const setup = readCsvValue(row, headers, ["setup", "strategy", "tag", "tags", "playbook", "mistake", "mistakes"]) || "CSV Import";
  const duration = readCsvValue(row, headers, ["duration", "holding time", "time in trade"]);
  const notes = readCsvValue(row, headers, ["notes", "note", "comments", "comment", "description", "review", "reason"]) || (duration ? `Duration: ${duration}` : "");

  if (!date || !symbol) return null;

  const pointValue = CONTRACTS[symbol]?.pointValue ?? 1;
  const direction = side === "Long" ? 1 : -1;
  const points = entry && exit ? (exit - entry) * direction : 0;
  const calculatedGross = points * pointValue * quantity;
  const signedImportedPnl = signedCsvPnl(importedPnl, calculatedGross);
  const grossProfitLoss = Number.isFinite(signedImportedPnl) ? signedImportedPnl : calculatedGross;
  const profitLoss = Number.isFinite(signedImportedPnl) ? signedImportedPnl : grossProfitLoss - commission;
  const sourceBase = [date, symbol, side, entry, exit, quantity, profitLoss, setup, notes].join("|");

  return {
    id: crypto.randomUUID(),
    source: "csv",
    sourceId: `csv-${hashText(sourceBase)}`,
    date,
    symbol,
    contractName: CONTRACTS[symbol]?.name ?? symbol,
    side,
    setup: setup.trim() || "CSV Import",
    mood: "Imported",
    entry,
    exit,
    quantity,
    pointValue,
    commission,
    risk: 0,
    notes: notes.trim(),
    points,
    grossProfitLoss,
    profitLoss,
    rMultiple: 0,
  };
}

function readCsvValue(row, headers, aliases) {
  const normalizedAliases = aliases.map(normalizeHeader);
  const key = headers.find((header) => normalizedAliases.includes(header));
  return key ? row[key]?.trim() ?? "" : "";
}

function detectCsvDelimiter(text) {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim()) || "";
  const candidates = [",", "\t", ";", "|"];
  return candidates
    .map((delimiter) => ({ delimiter, count: countDelimiter(firstLine, delimiter) }))
    .sort((a, b) => b.count - a.count)[0]?.delimiter || ",";
}

function countDelimiter(line, delimiter) {
  let count = 0;
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      count += 1;
    }
  }

  return count;
}

function normalizeHeader(value) {
  return String(value)
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/[$]/g, "")
    .replace(/[^a-z0-9&/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCsvDate(value) {
  const raw = String(value || "").trim();
  if (!raw || raw.includes("#")) return "";

  const parsedDateTime = parseCsvDateTime(raw);
  if (parsedDateTime) return formatDateKey(parsedDateTime);

  const isoMatch = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) return [isoMatch[1], isoMatch[2].padStart(2, "0"), isoMatch[3].padStart(2, "0")].join("-");

  const usMatch = raw.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})/);
  if (usMatch) {
    const year = usMatch[3].length === 2 ? `20${usMatch[3]}` : usMatch[3];
    return [year, usMatch[1].padStart(2, "0"), usMatch[2].padStart(2, "0")].join("-");
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? "" : formatDateKey(parsed);
}

function normalizeCsvSymbol(value) {
  const raw = String(value || "").toUpperCase().replace(/[^A-Z]/g, "");
  const symbols = Object.keys(CONTRACTS).sort((a, b) => b.length - a.length);
  return symbols.find((symbol) => raw.startsWith(symbol) || raw.includes(symbol)) || raw.slice(0, 6);
}

function normalizeCsvSide(value, buyPrice = NaN, sellPrice = NaN, boughtTime = "", soldTime = "") {
  const raw = String(value || "").toLowerCase();
  if (raw.includes("short") || raw.includes("sell")) return "Short";
  if (raw.includes("long") || raw.includes("buy")) return "Long";

  const bought = parseCsvDateTime(boughtTime);
  const sold = parseCsvDateTime(soldTime);
  if (bought && sold) {
    return sold < bought ? "Short" : "Long";
  }

  if (Number.isFinite(buyPrice) && Number.isFinite(sellPrice)) return "Long";
  return "Long";
}

function signedCsvPnl(importedPnl, calculatedGross) {
  if (!Number.isFinite(importedPnl)) return NaN;
  if (!Number.isFinite(calculatedGross) || calculatedGross === 0) return importedPnl;
  return Math.abs(importedPnl) * Math.sign(calculatedGross);
}

function parseCsvDateTime(value) {
  const raw = String(value || "").trim();
  if (!raw || raw.includes("#")) return null;

  const numericValue = Number(raw);
  if (Number.isFinite(numericValue)) {
    if (numericValue > 100000000000) return new Date(numericValue);
    if (numericValue > 1000000000) return new Date(numericValue * 1000);
    if (numericValue > 20000 && numericValue < 100000) {
      return new Date(Math.round((numericValue - 25569) * 86400 * 1000));
    }
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseCsvNumber(value) {
  const raw = String(value || "").trim();
  if (!raw) return NaN;

  const isParenthesesNegative = /^\(.*\)$/.test(raw);
  const cleaned = raw.replace(/[,$%]/g, "").replace(/[()]/g, "").replace(/[^0-9.-]/g, "");
  const number = Number(cleaned);
  if (!Number.isFinite(number)) return NaN;
  return isParenthesesNegative ? -Math.abs(number) : number;
}

function hashText(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash).toString(36);
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
  renderBiasCalculator();
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

async function saveDailyReview() {
  const review = currentReview();
  review.note = dailyReviewNote.value;
  review.context = Object.fromEntries(Object.entries(contextInputs).map(([key, input]) => [key, input.value]));
  saveLocalOnly();
  setScorecardSaveStatus("Saving daily review...");

  if (window.location.protocol === "file:") {
    setScorecardSaveStatus("Saved on this device.");
  } else {
    serverSyncReady = true;
    await saveJournalToServer();
  }

  renderDailyGrid(filteredTrades());
  renderProbabilities(trades);
}

function setScorecardSaveStatus(message) {
  if (!scorecardSaveStatus) return;
  scorecardSaveStatus.textContent = message;
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

function renderRrValidator() {
  if (!rrOutput.reward) return;
  const entry = Number(rrInputs.entry.value);
  const target = Number(rrInputs.target.value);
  const stop = Number(rrInputs.stop.value);
  const hasPrices = [entry, target, stop].every((value) => Number.isFinite(value) && value > 0);

  if (!hasPrices) {
    rrOutput.reward.textContent = "0.00 pts";
    rrOutput.risk.textContent = "0.00 pts";
    rrOutput.ratio.textContent = "0.00R";
    rrOutput.verdict.textContent = "Waiting for prices";
    rrOutput.card.className = "rr-verdict-card";
    return;
  }

  const reward = Math.abs(target - entry);
  const risk = Math.abs(entry - stop);
  const ratio = risk > 0 ? reward / risk : 0;
  const passes = risk > 0 && reward >= 2 * risk;

  rrOutput.reward.textContent = `${reward.toFixed(2)} pts`;
  rrOutput.risk.textContent = `${risk.toFixed(2)} pts`;
  rrOutput.ratio.textContent = `${ratio.toFixed(2)}R`;
  rrOutput.verdict.textContent = passes
    ? "Pass: 2:1+ execution"
    : "Fail: wait or pass";
  rrOutput.card.className = `rr-verdict-card ${passes ? "rr-pass" : "rr-fail"}`;
}

function selectedPlanDate() {
  return planInputs.date.value || todayKey();
}

function renderTradePlan() {
  const plan = tradePlans[selectedPlanDate()] ?? {};
  planInputs.bias.value = plan.bias ?? "";
  planInputs.maxTrades.value = plan.maxTrades ?? "";
  planInputs.maxLoss.value = plan.maxLoss ?? "";
  planInputs.dayType.value = plan.dayType ?? "";
  planInputs.news.value = plan.news ?? "";
  planInputs.levels.value = plan.levels ?? "";
  planInputs.bullish.value = plan.bullish ?? "";
  planInputs.bearish.value = plan.bearish ?? "";
  planInputs.neutral.value = plan.neutral ?? "";
  planInputs.marketIdeas.value = plan.marketIdeas ?? "";
  planInputs.checklistNews.checked = Boolean(plan.checklistNews);
  planInputs.checklistLevels.checked = Boolean(plan.checklistLevels);
  planInputs.checklistRisk.checked = Boolean(plan.checklistRisk);
  planInputs.checklistNoChase.checked = Boolean(plan.checklistNoChase);
  renderPlanChart(plan);
}

function saveTradePlan() {
  const existingPlan = tradePlans[selectedPlanDate()] ?? {};
  tradePlans[selectedPlanDate()] = {
    ...existingPlan,
    bias: planInputs.bias.value,
    maxTrades: planInputs.maxTrades.value,
    maxLoss: planInputs.maxLoss.value,
    dayType: planInputs.dayType.value,
    news: planInputs.news.value,
    levels: planInputs.levels.value,
    bullish: planInputs.bullish.value,
    bearish: planInputs.bearish.value,
    neutral: planInputs.neutral.value,
    marketIdeas: planInputs.marketIdeas.value,
    checklistNews: planInputs.checklistNews.checked,
    checklistLevels: planInputs.checklistLevels.checked,
    checklistRisk: planInputs.checklistRisk.checked,
    checklistNoChase: planInputs.checklistNoChase.checked,
    updatedAt: new Date().toISOString(),
  };
  saveTradePlans();
  setPlanSaveStatus("Game plan saved.");
}

function clearTradePlan() {
  delete tradePlans[selectedPlanDate()];
  saveTradePlans();
  renderTradePlan();
  setPlanSaveStatus("Plan cleared.");
}

function updateClockBar() {
  if (!liveClock || !focusTimer) return;
  const now = new Date();
  const nyParts = newYorkDateParts(now);
  liveClock.textContent = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);

  const elapsedSeconds = Math.floor(currentFocusElapsed() / 1000);
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;
  focusTimer.textContent = hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const completedHour = Math.floor(elapsedSeconds / 3600);
  if (completedHour > 0 && completedHour > lastBreakHour) {
    lastBreakHour = completedHour;
    showBreakAlert(completedHour);
  }

  updateSessionNotice(nyParts);
}

function newYorkDateParts(date) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).formatToParts(date).map((part) => [part.type, part.value]));

  return {
    weekday: parts.weekday,
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

function updateSessionNotice({ weekday, hour, minute, second }) {
  if (!sessionNotice) return;
  const minuteOfDay = hour * 60 + minute;
  const openSessions = SESSION_WINDOWS.filter((session) => isSessionOpen(session, minuteOfDay));
  const nextEvent = nextSessionEvent(minuteOfDay);
  const openText = openSessions.length
    ? `Open now: ${openSessions.map((session) => session.name).join(" + ")}`
    : "No major session open";

  sessionNotice.textContent = `${openText}. Next: ${nextEvent.name} ${nextEvent.type} in ${formatMinutesUntil(nextEvent.minutesUntil)}.`;

  if (second <= 1) {
    const eventNow = sessionEventAt(minuteOfDay);
    const eventKey = eventNow ? `${weekday}-${hour}-${minute}-${eventNow.name}-${eventNow.type}` : "";
    if (eventNow && eventKey !== lastSessionEventKey) {
      lastSessionEventKey = eventKey;
      showSessionAlert(eventNow);
    }
  }
}

function isSessionOpen(session, minuteOfDay) {
  if (session.open < session.close) {
    return minuteOfDay >= session.open && minuteOfDay < session.close;
  }
  return minuteOfDay >= session.open || minuteOfDay < session.close;
}

function nextSessionEvent(minuteOfDay) {
  const events = SESSION_WINDOWS.flatMap((session) => [
    { name: session.name, type: "opens", minute: session.open },
    { name: session.name, type: "closes", minute: session.close },
  ]);

  return events
    .map((event) => ({
      ...event,
      minutesUntil: event.minute >= minuteOfDay ? event.minute - minuteOfDay : 1440 - minuteOfDay + event.minute,
    }))
    .filter((event) => event.minutesUntil > 0)
    .sort((a, b) => a.minutesUntil - b.minutesUntil)[0];
}

function sessionEventAt(minuteOfDay) {
  return SESSION_WINDOWS.flatMap((session) => [
    { name: session.name, type: "open", minute: session.open },
    { name: session.name, type: "close", minute: session.close },
  ]).find((event) => event.minute === minuteOfDay);
}

function showSessionAlert(event) {
  sessionNotice.textContent = `${event.name} session ${event.type === "open" ? "is opening now" : "is closing now"}.`;
  sessionNotice.classList.add("active");
  playBreakSound();
  window.setTimeout(() => sessionNotice.classList.remove("active"), 12000);
}

function formatMinutesUntil(minutes) {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
  return `${minutes}m`;
}

function currentFocusElapsed() {
  return focusElapsedBeforePause + (timerRunning ? Date.now() - focusStartedAt : 0);
}

function showBreakAlert(hour) {
  if (!breakAlert) return;
  breakAlert.textContent = `${hour} hour${hour === 1 ? "" : "s"} focused. Stand up, reset your eyes, review risk, then continue.`;
  breakAlert.classList.add("active");
  playBreakSound();
}

function dismissBreakAlert() {
  breakAlert.classList.remove("active");
  breakAlert.textContent = "Break alert armed. You will get a reminder every hour.";
  focusElapsedBeforePause = 0;
  focusStartedAt = Date.now();
  timerRunning = true;
  lastBreakHour = 0;
  stopTimerButton.textContent = "Stop Timer";
}

function toggleFocusTimer() {
  if (timerRunning) {
    focusElapsedBeforePause = currentFocusElapsed();
    timerRunning = false;
    stopTimerButton.textContent = "Start Timer";
    breakAlert.textContent = "Timer paused. Break alerts are paused too.";
    breakAlert.classList.remove("active");
    return;
  }

  focusStartedAt = Date.now();
  timerRunning = true;
  stopTimerButton.textContent = "Stop Timer";
  breakAlert.textContent = "Break alert armed. You will get a reminder every hour.";
}

function playBreakSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.18);
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.55);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.58);
  } catch {
    // Browser audio may be blocked until the page receives a user gesture.
  }
}

async function savePlanChart(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const date = selectedPlanDate();
  const dataUrl = await resizeImage(file, 1600, 0.84);
  saveTradePlan();
  const existingPlan = tradePlans[date] ?? {};
  tradePlans[date] = {
    ...existingPlan,
    chart: {
      name: file.name,
      savedAt: new Date().toISOString(),
      dataUrl,
    },
  };
  saveTradePlans();
  renderPlanChart(tradePlans[date]);
  planInputs.chartInput.value = "";
  setPlanSaveStatus("Pre-market chart saved.");
}

function clearPlanChart() {
  const date = selectedPlanDate();
  if (!tradePlans[date]?.chart) return;
  delete tradePlans[date].chart;
  saveTradePlans();
  renderPlanChart(tradePlans[date]);
  setPlanSaveStatus("Pre-market chart cleared.");
}

function renderPlanChart(plan = {}) {
  const chart = plan.chart;
  if (chart?.dataUrl) {
    planInputs.chartImage.src = chart.dataUrl;
    planInputs.chartImage.style.display = "block";
    planInputs.chartImage.title = "Click to enlarge";
    planInputs.chartCaption.textContent = `${chart.name || "Pre-market chart"} saved for ${selectedPlanDate()}.`;
    clearPlanChartButton.disabled = false;
    return;
  }

  planInputs.chartImage.removeAttribute("src");
  planInputs.chartImage.style.display = "none";
  planInputs.chartCaption.textContent = "No pre-market chart saved for this plan.";
  clearPlanChartButton.disabled = true;
}

function openImageLightbox(src, caption = "") {
  if (!src) return;
  lightboxImage.src = src;
  lightboxCaption.textContent = caption || "Expanded chart";
  imageLightbox.classList.remove("hidden");
  document.body.classList.add("lightbox-open");
}

function closeImageLightbox() {
  if (!imageLightbox || imageLightbox.classList.contains("hidden")) return;
  imageLightbox.classList.add("hidden");
  lightboxImage.removeAttribute("src");
  document.body.classList.remove("lightbox-open");
}

function setPlanSaveStatus(message) {
  if (!planSaveStatus) return;
  planSaveStatus.textContent = message;
}

function renderBiasCalculator() {
  if (!biasInputGrid) return;
  renderBiasInputs();
  renderBiasLibrary();
  updateBiasOutput();
}

function renderBiasInputs() {
  biasInputGrid.replaceChildren();
  BIAS_INPUTS.forEach((inputConfig) => {
    const label = document.createElement("label");
    label.innerHTML = `
      <span>${inputConfig.label}</span>
      <select data-bias-input="${inputConfig.id}">
        <option value="">Ignore</option>
        ${inputConfig.options.map(([value, text]) => `<option value="${value}">${text}</option>`).join("")}
      </select>
    `;
    const select = label.querySelector("select");
    select.value = biasState.inputs[inputConfig.id] ?? "";
    select.addEventListener("change", () => {
      biasState.inputs[inputConfig.id] = select.value;
      saveBiasState();
    });
    biasInputGrid.append(label);
  });
}

function renderBiasLibrary() {
  biasLibraryRows.replaceChildren();
  biasState.stats.forEach((stat, index) => {
    const row = document.createElement("div");
    row.className = "bias-library-row";
    row.innerHTML = `
      <input value="${escapeAttribute(stat.key)}" data-bias-stat="${index}" data-bias-field="key">
      <input value="${escapeAttribute(stat.description)}" data-bias-stat="${index}" data-bias-field="description">
      <input type="number" min="0.1" max="99.9" step="0.01" value="${Number(stat.bull).toFixed(2)}" data-bias-stat="${index}" data-bias-field="bull">
      <input type="number" min="0" step="0.05" value="${Number(stat.weight).toFixed(2)}" data-bias-stat="${index}" data-bias-field="weight">
      <input value="${escapeAttribute(stat.notes)}" data-bias-stat="${index}" data-bias-field="notes">
      <button class="ghost-button" type="button" data-bias-delete="${index}">Delete</button>
    `;
    biasLibraryRows.append(row);
  });

  biasLibraryRows.querySelectorAll("[data-bias-field]").forEach((input) => {
    input.addEventListener("input", updateBiasStatFromInput);
  });
  biasLibraryRows.querySelectorAll("[data-bias-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      biasState.stats.splice(Number(button.dataset.biasDelete), 1);
      saveBiasState();
    });
  });
}

function updateBiasStatFromInput(event) {
  const input = event.currentTarget;
  const stat = biasState.stats[Number(input.dataset.biasStat)];
  if (!stat) return;
  const field = input.dataset.biasField;
  stat[field] = field === "bull" || field === "weight" ? Number(input.value) : input.value;
  localStorage.setItem(BIAS_STORAGE_KEY, JSON.stringify(biasState));
  updateBiasOutput();
}

function updateBiasOutput() {
  const active = activeBiasDrivers();
  const logOdds = sum(active.map((driver) => logit(driver.bull / 100) * driver.weight));
  const longProbability = active.length ? logistic(logOdds) : 0.5;
  const shortProbability = 1 - longProbability;
  const longPercent = longProbability * 100;
  const shortPercent = shortProbability * 100;
  const score = longPercent - shortPercent;

  biasOutput.longPercent.textContent = `${longPercent.toFixed(1)}%`;
  biasOutput.shortPercent.textContent = `${shortPercent.toFixed(1)}%`;
  biasOutput.score.textContent = score.toFixed(2);
  biasOutput.driverCount.textContent = `${active.length} active ${active.length === 1 ? "driver" : "drivers"}`;
  biasOutput.longLabel.textContent = biasLabel(longPercent);
  biasOutput.shortLabel.textContent = biasLabel(shortPercent);
  biasOutput.longPressure.style.width = `${longPercent}%`;
  biasOutput.shortPressure.style.width = `${shortPercent}%`;
  biasOutput.longPressureLabel.textContent = `${longPercent.toFixed(1)}%`;
  biasOutput.shortPressureLabel.textContent = `${shortPercent.toFixed(1)}%`;
  biasOutput.narrative.textContent = active.length
    ? `${score >= 0 ? "Long" : "Short"} continuation has the stronger read by ${Math.abs(score).toFixed(1)} points.`
    : "Waiting for active inputs. Start selecting conditions to estimate continuation bias.";
  renderBiasDrivers(active);
}

function activeBiasDrivers() {
  const statsByKey = new Map(biasState.stats.map((stat) => [stat.key, stat]));
  return Object.values(biasState.inputs)
    .filter(Boolean)
    .map((key) => statsByKey.get(key))
    .filter(Boolean)
    .map((stat) => ({
      ...stat,
      bull: clamp(Number(stat.bull), 0.1, 99.9),
      bear: 100 - clamp(Number(stat.bull), 0.1, 99.9),
      weight: Math.max(0, Number(stat.weight) || 0),
      impact: logit(clamp(Number(stat.bull), 0.1, 99.9) / 100) * Math.max(0, Number(stat.weight) || 0),
    }));
}

function renderBiasDrivers(active) {
  biasDriverRows.replaceChildren();
  if (!active.length) {
    const empty = document.createElement("div");
    empty.className = "bias-driver-row empty";
    empty.textContent = "No inputs active yet.";
    biasDriverRows.append(empty);
    return;
  }

  active.forEach((driver) => {
    const row = document.createElement("div");
    row.className = "bias-driver-row";
    row.innerHTML = `
      <span>${driver.description}</span>
      <span>${driver.bull.toFixed(2)}%</span>
      <span>${driver.bear.toFixed(2)}%</span>
      <span>${driver.weight.toFixed(2)}</span>
      <span class="${driver.impact >= 0 ? "profit" : "loss"}">${driver.impact >= 0 ? "+" : ""}${driver.impact.toFixed(3)}</span>
    `;
    biasDriverRows.append(row);
  });
}

function resetBiasInputs() {
  biasState.inputs = {};
  saveBiasState();
}

function addBiasStatRow() {
  biasState.stats.push({
    key: `custom_${Date.now()}`,
    description: "Custom condition",
    bull: 50,
    weight: 1,
    notes: "Edit this row",
  });
  saveBiasState();
}

function restoreBiasDefaults() {
  biasState = { inputs: {}, stats: structuredClone(DEFAULT_BIAS_STATS) };
  saveBiasState();
}

function biasLabel(percent) {
  if (percent >= 60) return "Strong";
  if (percent >= 54) return "Leaning";
  if (percent <= 40) return "Weak";
  return "Neutral";
}

function logit(probability) {
  const p = clamp(probability, 0.001, 0.999);
  return Math.log(p / (1 - p));
}

function logistic(value) {
  return 1 / (1 + Math.exp(-value));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeAttribute(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
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
  renderInPlay(closest);

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

function renderInPlay(closest) {
  inPlayGrid.replaceChildren();
  const plays = masterTargetPlays();
  const master = plays[0];

  if (!plays.length) {
    const empty = document.createElement("p");
    empty.textContent = "Enter current price, target levels, and an optional long/short bias to identify the master target.";
    inPlayGrid.append(empty);
    return;
  }

  plays.slice(0, 6).forEach((play, index) => {
    const card = document.createElement("article");
    const classes = [
      "in-play-card",
      index === 0 ? "master-target-card" : "",
      play.targetClass === "high" ? "conviction-target" : "",
      play.targetClass === "weak" ? "weak-target" : "",
      play.label === closest?.label ? "primary-play" : "",
    ].filter(Boolean).join(" ");
    card.className = classes;
    card.innerHTML = `
      <span>${index === 0 ? "Master Target" : play.targetLabel} | ${play.sideLabel}</span>
      <h4>${play.label} ${Number.isFinite(play.value) ? `@ ${play.value.toFixed(2)}` : ""}</h4>
      <strong>${formatPercent(play.best.value)}</strong>
      <small>${play.distance.toFixed(2)} pts away | ${play.best.column}</small>
      <div>
        <b>${play.rrLabel}</b>
        <em>${play.rrStatus}</em>
      </div>
    `;
    inPlayGrid.append(card);
  });

  matrixSummary.innerHTML = master
    ? `<b>Master Target Line:</b> ${master.label} at ${master.value.toFixed(2)} | ${formatPercent(master.best.value)} | ${master.rrStatus}`
    : matrixSummary.textContent;
}

function masterTargetPlays() {
  const current = Number(liveLevelInputs.current.value);
  if (!current) return [];
  const bias = targetFilterInputs.bias.value;
  const entry = Number(targetFilterInputs.entry.value) || current;
  const stop = Number(targetFilterInputs.stop.value);

  return [
    ["ONH", liveLevelInputs.onh.value],
    ["ONL", liveLevelInputs.onl.value],
    ["pVAH", liveLevelInputs.pvah.value],
    ["pVAL", liveLevelInputs.pval.value],
    ["pVPOC", liveLevelInputs.ppoc.value],
    ["pMid", liveLevelInputs.pmid.value],
    ["IBH", liveLevelInputs.ibh.value],
    ["IBL", liveLevelInputs.ibl.value],
  ]
    .map(([label, value]) => ({ label, value: Number(value), row: findMatrixRow(label) }))
    .filter((item) => Number.isFinite(item.value) && item.value > 0 && item.row)
    .filter((item) => {
      if (bias === "long") return item.value > current;
      if (bias === "short") return item.value < current;
      return true;
    })
    .map((item) => {
      const values = item.row[1];
      const bestIndex = values.reduce((best, value, index) => value > values[best] ? index : best, 0);
      const reward = Math.abs(item.value - entry);
      const risk = Number.isFinite(stop) && stop > 0 ? Math.abs(entry - stop) : NaN;
      const rr = Number.isFinite(risk) && risk > 0 ? reward / risk : NaN;
      const targetClass = values[bestIndex] >= 65 ? "high" : values[bestIndex] < 60 ? "weak" : "secondary";
      return {
        ...item,
        distance: Math.abs(current - item.value),
        sideLabel: item.value >= current ? "Above price" : "Below price",
        base: values[0],
        targetClass,
        targetLabel: targetClass === "high" ? "65%+ draw" : targetClass === "weak" ? "Weak target" : "Secondary target",
        reward,
        risk,
        rr,
        rrLabel: Number.isFinite(rr) ? `${rr.toFixed(2)}R` : "R:R n/a",
        rrStatus: rrStatus(rr, targetClass),
        best: {
          column: STATS_MATRIX_COLUMNS[bestIndex],
          value: values[bestIndex],
        },
      };
    })
    .sort((a, b) => b.best.value - a.best.value || a.distance - b.distance);
}

function rrStatus(rr, targetClass) {
  if (!Number.isFinite(rr)) return "Add entry and stop";
  if (rr >= 2) return "R:R validator passed";
  if (targetClass === "high") return "Low R:R / high probability";
  return "R:R below 2:1";
}

function findMatrixRow(label) {
  const normalized = label.toLowerCase();
  const allRows = STATS_MATRIX_SECTIONS.flatMap((section) => section.rows);
  return allRows.find(([rowLabel]) => rowLabel.toLowerCase() === normalized)
    || allRows.find(([rowLabel]) => rowLabel.toLowerCase().includes(normalized));
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
