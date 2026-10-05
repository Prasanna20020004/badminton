// Persists the randomized draw so it is generated exactly once. Mirrors the
// pattern in winnersStore.js: localStorage is the source of truth, a custom
// event notifies other components/tabs, reads are open to everyone, writes
// (regenerating the draw) are gated on an admin session.

import participants from "../data/participants";
import {
  buildFixtures,
  buildMensDoublesCategory,
  buildMixedDoublesCategory,
  firstRoundPairKeysOf,
} from "./drawEngine";
import { isLoggedIn } from "../auth";
import { clearAllResults, clearCategoryResults } from "./winnersStore";

// Bump this if the draw shape or generation rules ever change, so stale
// stored draws (built under the old rules) are discarded instead of lingering.
const STORAGE_KEY = "ctgt_fixture_draw_v7";
const EVENT_NAME = "ctgt-fixture-draw-updated";

let cached = null;

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStored(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore (e.g. storage disabled) — draw still works for this session via `cached`
  }
}

function generate() {
  return buildFixtures(participants);
}

// Returns the draw, generating and persisting it on first call only. Every
// later call (including after a page reload) returns the same draw.
export function getFixtures() {
  if (cached) return cached;
  let data = readStored();
  if (!data) {
    data = generate();
    writeStored(data);
  }
  cached = data;
  return data;
}

// Admin-only: throws the current draw away and generates a brand new one.
// Also clears recorded results, since match numbers from the old draw no
// longer mean anything once the draw changes.
export function regenerateFixtures() {
  if (!isLoggedIn()) return false;
  cached = generate();
  writeStored(cached);
  clearAllResults();
  window.dispatchEvent(new Event(EVENT_NAME));
  return true;
}

// Admin-only: reshuffles just one doubles category (Men's or Mixed Doubles),
// leaving Male Singles, Female Singles, and the other doubles category
// untouched. Reuses the existing singles brackets' first-round matchups as
// the forbidden-pair list, same as a full regeneration would.
export function regenerateCategory(categoryKey) {
  if (!isLoggedIn()) return false;
  if (categoryKey !== "mensd" && categoryKey !== "mixedd") return false;

  const current = getFixtures();
  const forbiddenPairKeys = new Set([
    ...firstRoundPairKeysOf(current.male),
    ...firstRoundPairKeysOf(current.female),
  ]);

  let updatedCategory;
  if (categoryKey === "mensd") {
    const mensDoublesPool = participants.filter((p) => p.categories.includes("Men's Doubles"));
    updatedCategory = buildMensDoublesCategory(mensDoublesPool, forbiddenPairKeys);
  } else {
    const mixedDoublesPool = participants.filter((p) => p.categories.includes("Mixed Doubles"));
    const femaleNames = new Set(
      participants.filter((p) => p.categories.includes("Female Singles")).map((p) => p.name)
    );
    updatedCategory = buildMixedDoublesCategory(mixedDoublesPool, femaleNames, forbiddenPairKeys);
  }

  cached = { ...current, [categoryKey]: updatedCategory };
  writeStored(cached);
  clearCategoryResults(categoryKey);
  window.dispatchEvent(new Event(EVENT_NAME));
  return true;
}

export function subscribeToFixtures(callback) {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}
