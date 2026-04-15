function getTodayDate() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function getTomorrowDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

// ---------------- NORMALIZATION ----------------

function normalizeMessage(message) {
  let msg = message.toLowerCase();

  msg = msg.replace(/\btom\b/g, "tomorrow");
  msg = msg.replace(/\btmrw\b/g, "tomorrow");
  msg = msg.replace(/\btmr\b/g, "tomorrow");

  msg = msg.replace(/\bappt\b/g, "appointment");
  msg = msg.replace(/\bapp\b/g, "appointment");

  msg = msg.replace(/\s+/g, " ").trim();

  return msg;
}

// ---------------- INTENT ----------------

function extractIntent(message) {
  if (/reschedule|move/.test(message)) return "reschedule";
  if (/cancel|delete/.test(message)) return "cancel";
  if (/book|schedule|fix/.test(message)) return "book";
  if (/available|slots|free/.test(message)) return "availability";

  return "unknown";
}

// ---------------- DATE ----------------

function extractDate(message) {
    function getTodayDate() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function getTomorrowDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function getDayAfterTomorrowDate() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split("T")[0];
}

function formatDateToISO(day, month, year) {
  const d = String(day).padStart(2, "0");
  const m = String(month).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function extractDate(message) {
  if (message.includes("day after tomorrow")) {
    return getDayAfterTomorrowDate();
  }

  if (message.includes("tomorrow")) {
    return getTomorrowDate();
  }

  if (message.includes("today")) {
    return getTodayDate();
  }

  const relativeMatch = message.match(/after (\d+) day/);
  if (relativeMatch) {
    const days = parseInt(relativeMatch[1], 10);
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  }

  const slashDateMatch = message.match(/\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})\b/);
  if (slashDateMatch) {
    const day = parseInt(slashDateMatch[1], 10);
    const month = parseInt(slashDateMatch[2], 10);
    const year = parseInt(slashDateMatch[3], 10);

    return formatDateToISO(day, month, year);
  }

  return "";
}
if (!date && intent === "book") {
  return res.json({
    reply: "Please mention a valid date like today, tomorrow, or DD/MM/YYYY.",
  });
}
  if (message.includes("tomorrow")) return getTomorrowDate();
  if (message.includes("today")) return getTodayDate();

  return "";
}

// ---------------- TIME ----------------

function extractTime(message) {
  const timeMatch = message.match(/(\d{1,2})\s*(am|pm)?/);

  if (!timeMatch) return "";

  let hour = parseInt(timeMatch[1]);
  const period = timeMatch[2];

  if (period === "pm" && hour < 12) {
    hour += 12;
  }

  if (period === "am" && hour === 12) {
    hour = 0;
  }

  return `${hour.toString().padStart(2, "0")}:00`;
}

// ---------------- SERVICE ----------------

function extractService(message) {
  if (message.includes("skin")) return "skin consultation";
  if (message.includes("dental") || message.includes("tooth"))
    return "dental consultation";
  if (message.includes("eye")) return "eye checkup";
  if (message.includes("general")) return "general consultation";
  if (message.includes("checkup")) return "checkup";

  return "general consultation";
}

// ---------------- MAIN PARSER ----------------

function parseMessage(message) {
  const normalized = normalizeMessage(message);

  return {
    intent: extractIntent(normalized),
    date: extractDate(normalized),
    time: extractTime(normalized),
    service: extractService(normalized),
  };
}

module.exports = {
  parseMessage,
};