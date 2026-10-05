// Display names for the Intelizign placeholder slots ("Intelizign Player 1" … "Intelizign Player 12").
// The fixture data keeps the placeholder labels; the admin can attach a real name to each one here,
// and every view (public fixture, admin fixture, entry list) shows the real name instead.
// Like results, this is stored in the browser — no backend. Writes require an admin session.

import { isLoggedIn } from "../auth";

const STORAGE_KEY = "ctgt_intelizign_names";
const EVENT_NAME = "ctgt-intelizign-names-updated";
const PLACEHOLDER = /Intelizign Player (\d+)/g;

export function getNames() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// names: { [placeholder]: "Real Name" }; empty values are dropped (placeholder shows again).
export function saveNames(names) {
  if (!isLoggedIn()) return false;
  const clean = {};
  Object.entries(names).forEach(([k, v]) => {
    const t = (v || "").trim();
    if (t) clean[k] = t;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  window.dispatchEvent(new Event(EVENT_NAME));
  return true;
}

export function subscribeToNames(callback) {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

// Replace any placeholder inside a label (works for singles names and "A / B" team labels).
export function applyNames(text, names) {
  if (typeof text !== "string") return text;
  return text.replace(PLACEHOLDER, (m) => names[m] || m);
}
