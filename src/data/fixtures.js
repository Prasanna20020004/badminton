// The actual draw (brackets, teams, byes) is generated once and persisted —
// see src/utils/drawEngine.js (randomization + pairing rules) and
// src/utils/fixtureStore.js (persistence so a reload doesn't reshuffle).
// This file only lists the fixed category keys, in display order.

export const FIXTURE_CATEGORY_KEYS = ["male", "female", "mensd", "mixedd"];
