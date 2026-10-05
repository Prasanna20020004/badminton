// Results storage for the fixture. No backend — like the rest of this app,
// state lives in the browser. Reads are open to anyone (the public fixture
// view uses them); writes are gated on an active admin session, so results
// can only ever be changed from the admin dashboard.

import { isLoggedIn } from "../auth";

// Bumped to v2 when the final draw replaced the old one, so results recorded
// against the old match numbers are discarded instead of landing on new matches.
const STORAGE_KEY = "ctgt_fixture_results_v9";
const EVENT_NAME = "ctgt-fixture-results-updated";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function getPicks(categoryKey) {
  const all = readAll();
  return all[categoryKey] || {};
}

// side: "a" | "b" | "" (clear). Silently does nothing if called without an
// admin session — the dashboard is the only place in the UI that calls this.
export function setPick(categoryKey, matchNum, side) {
  if (!isLoggedIn()) return false;
  const all = readAll();
  const catPicks = { ...(all[categoryKey] || {}) };
  if (side) catPicks[matchNum] = side;
  else delete catPicks[matchNum];
  all[categoryKey] = catPicks;
  writeAll(all);
  return true;
}

// Wipes every category's recorded results. Used when the draw is
// regenerated, since old match numbers no longer mean anything.
export function clearAllResults() {
  if (!isLoggedIn()) return false;
  writeAll({});
  return true;
}

// Wipes just one category's recorded results — used when only that
// category's draw is reshuffled.
export function clearCategoryResults(categoryKey) {
  if (!isLoggedIn()) return false;
  const all = readAll();
  delete all[categoryKey];
  writeAll(all);
  return true;
}

// Notifies on changes made in this tab (custom event) and in other tabs of
// the same browser (native "storage" event). Returns an unsubscribe fn.
export function subscribeToResults(callback) {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}
