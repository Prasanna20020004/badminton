// Builds a randomized tournament draw from the participants list. Pure
// functions only — no storage access (that's fixtureStore.js's job) — so the
// randomization logic can be reasoned about and tested on its own.
//
// Rules the generator must respect, on top of plain randomization:
//  1. A pair of players who face each other in the singles first round must
//     never end up as doubles teammates. Doubles pairing happens *after*
//     the singles brackets, using the singles first-round matchups as a
//     forbidden list.
//  2. Within every first round, CTGT-vs-CTGT matches are scheduled before
//     Intelizign-vs-Intelizign matches, with CTGT/Intelizign crossover and
//     bye matches as the hinge between them — so Intelizign's matches
//     always land last in the schedule. This only applies to the first
//     round: later rounds are just winners-of-earlier-matches, so there's
//     no organization identity left to sort by.
//  3. Doubles teams are formed within one org only (CTGT with CTGT,
//     Intelizign with Intelizign) wherever possible. A CTGT player must
//     always end up on a team — if CTGT's count is odd, that leftover
//     player is teamed with an Intelizign player instead of being left
//     partnerless. An Intelizign player, on the other hand, is allowed to
//     be left without a partner (and shown as a solo "needs partner" team)
//     since Intelizign's roster is still placeholder.

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function roundLabel(numMatches) {
  const size = numMatches * 2;
  if (size === 2) return "Final";
  if (size === 4) return "Semifinal";
  if (size === 8) return "Quarterfinal";
  return `Round of ${size}`;
}

function pairKey(a, b) {
  return [a, b].sort().join("||");
}

function pairSequentialAdjacent(list) {
  const pairs = [];
  for (let i = 0; i < list.length - 1; i += 2) pairs.push([list[i], list[i + 1]]);
  return pairs;
}

// Builds the rest of the bracket from a completed round's match list. A
// round doesn't need to be a power-of-two size: if it has an odd number of
// matches, the last one's winner gets a bye into the next round rather than
// crashing — this only ever happens deeper in the bracket (round 1 is built
// to need as few byes as possible by buildGroupedBracket below).
function roundsFromFirstRound(firstRound, startMatchNum) {
  let matchNum = startMatchNum;
  const rounds = [[roundLabel(firstRound.length), firstRound]];
  let prevRound = firstRound;
  while (prevRound.length > 1) {
    const nextRound = [];
    for (let i = 0; i < prevRound.length; i += 2) {
      const hasPartner = i + 1 < prevRound.length;
      nextRound.push({
        num: matchNum++,
        a: { ref: prevRound[i].num },
        b: hasPartner ? { ref: prevRound[i + 1].num } : "BYE",
      });
    }
    rounds.push([roundLabel(nextRound.length), nextRound]);
    prevRound = nextRound;
  }
  return rounds;
}

// Builds a single-elimination bracket from two already-formed entrant lists
// (player names, or "A / B" doubles-team strings) — one from CTGT, one from
// Intelizign — so CTGT matches are scheduled first and Intelizign-only
// matches last. Each group is shuffled and paired up internally so CTGT only
// faces CTGT and Intelizign only faces Intelizign, using as few byes as
// mathematically possible:
//  - If both groups have an odd one out, they're crossed into one
//    CTGT/Intelizign match instead of either taking a bye.
//  - Only if exactly one group is left with an odd one out (impossible to
//    avoid without inventing an opponent) does that single leftover get a
//    bye — which can only ever happen on one side, never both.
// `options.forcedPairs` pins specific CTGT players together as matches,
// pulled out of the shuffle entirely. `options.forcedCrossover` pins one
// CTGT player as the one who plays the CTGT/Intelizign crossover match
// (instead of whichever player randomly ends up as the odd one out) — these
// exist to satisfy specific organizer requests about who plays whom.
function buildGroupedBracket(ctgtItemsIn, intelizignItemsIn, options = {}) {
  const { forcedPairs, forcedCrossover } = options;

  let pool = [...ctgtItemsIn];
  const forcedPairMatches = [];
  (forcedPairs || []).forEach((pair) => {
    if (pool.includes(pair[0]) && pool.includes(pair[1])) {
      forcedPairMatches.push(pair);
      pool = pool.filter((n) => n !== pair[0] && n !== pair[1]);
    }
  });
  let forcedCrossoverName = null;
  if (forcedCrossover && pool.includes(forcedCrossover)) {
    forcedCrossoverName = forcedCrossover;
    pool = pool.filter((n) => n !== forcedCrossoverName);
  }

  let ctgtPool = shuffle(pool);
  let intelizignPool = shuffle(intelizignItemsIn);

  let crossoverPair = null;
  if (forcedCrossoverName && intelizignPool.length > 0) {
    const partner = intelizignPool[intelizignPool.length - 1];
    intelizignPool = intelizignPool.slice(0, -1);
    crossoverPair = [forcedCrossoverName, partner];
  } else if (forcedCrossoverName) {
    // No Intelizign players to cross over with — treat them as an ordinary
    // CTGT entrant instead.
    ctgtPool = [...ctgtPool, forcedCrossoverName];
  } else if (ctgtPool.length % 2 !== 0 && intelizignPool.length % 2 !== 0) {
    crossoverPair = [ctgtPool[ctgtPool.length - 1], intelizignPool[intelizignPool.length - 1]];
    ctgtPool = ctgtPool.slice(0, -1);
    intelizignPool = intelizignPool.slice(0, -1);
  }

  const ctgtMatches = pairSequentialAdjacent(ctgtPool);
  if (ctgtPool.length % 2 !== 0) ctgtMatches.push([ctgtPool[ctgtPool.length - 1], "BYE"]);
  ctgtMatches.unshift(...forcedPairMatches);
  const intelizignMatches = pairSequentialAdjacent(intelizignPool);
  if (intelizignPool.length % 2 !== 0) {
    intelizignMatches.push([intelizignPool[intelizignPool.length - 1], "BYE"]);
  }

  const orderedPairs = [
    ...ctgtMatches,
    ...(crossoverPair ? [crossoverPair] : []),
    ...intelizignMatches,
  ];

  let matchNum = 1;
  const firstRound = [];
  const firstRoundPairKeys = new Set();
  orderedPairs.forEach(([a, b]) => {
    firstRound.push({ num: matchNum++, a, b });
    if (a !== "BYE" && b !== "BYE") firstRoundPairKeys.add(pairKey(a, b));
  });

  return { rounds: roundsFromFirstRound(firstRound, matchNum), firstRoundPairKeys };
}

function drawSize(bracket) {
  return bracket.rounds[0][1].length * 2;
}

// Pairs up a pool of names into teams of two, avoiding any pair whose key is
// in forbiddenKeys when at all possible. Falls back to a greedy repair if
// random reshuffling can't find a fully clean pairing (only possible with
// very small / heavily-constrained pools).
function pairPool(pool, forbiddenKeys, maxAttempts = 500) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const shuffled = shuffle(pool);
    const pairs = [];
    let ok = true;
    for (let i = 0; i < shuffled.length - 1; i += 2) {
      const a = shuffled[i];
      const b = shuffled[i + 1];
      if (forbiddenKeys.has(pairKey(a, b))) {
        ok = false;
        break;
      }
      pairs.push([a, b]);
    }
    if (ok) return pairs;
  }
  return greedyPair(pool, forbiddenKeys);
}

function greedyPair(items, forbiddenKeys) {
  const shuffled = shuffle(items);
  const used = new Array(shuffled.length).fill(false);
  const pairs = [];
  for (let i = 0; i < shuffled.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    let partner = -1;
    for (let j = i + 1; j < shuffled.length; j++) {
      if (used[j]) continue;
      if (!forbiddenKeys.has(pairKey(shuffled[i], shuffled[j]))) {
        partner = j;
        break;
      }
    }
    if (partner === -1) {
      for (let j = i + 1; j < shuffled.length; j++) {
        if (!used[j]) {
          partner = j;
          break;
        }
      }
    }
    if (partner !== -1) {
      used[partner] = true;
      pairs.push([shuffled[i], shuffled[partner]]);
    }
  }
  return pairs;
}

// Pairs two equal-length lists against each other (used for mixed-gender
// pairing), avoiding forbidden combinations where possible.
function pairAcross(listA, listB, forbiddenKeys, maxAttempts = 500) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const shuffledB = shuffle(listB);
    const pairs = [];
    let ok = true;
    for (let i = 0; i < listA.length; i++) {
      if (forbiddenKeys.has(pairKey(listA[i], shuffledB[i]))) {
        ok = false;
        break;
      }
      pairs.push([listA[i], shuffledB[i]]);
    }
    if (ok) return pairs;
  }
  // Greedy fallback: bipartite version of greedyPair.
  const remainingB = [...listB];
  const pairs = [];
  for (const a of listA) {
    let idx = remainingB.findIndex((b) => !forbiddenKeys.has(pairKey(a, b)));
    if (idx === -1) idx = 0;
    pairs.push([a, remainingB[idx]]);
    remainingB.splice(idx, 1);
  }
  return pairs;
}

function teamsFromPairs(pairs) {
  return pairs.map(([a, b]) => `${a} / ${b}`);
}

const isIntelizign = (p) => p.org === "Intelizign";
const isFemale = (p, femaleNames) => femaleNames.has(p.name);

function splitByOrg(pool) {
  return { ctgt: pool.filter((p) => !isIntelizign(p)), intelizign: pool.filter(isIntelizign) };
}

// Forms 2-person teams from a single-org pool of player names, avoiding
// forbidden pairs. Returns the raw pairs plus any odd-one-out name (not yet
// turned into a solo team — that decision is made by resolveCrossOrgLeftover,
// since whether a leftover stays solo depends on which org it belongs to).
function formOrgTeams(names, forbiddenKeys) {
  let pool = shuffle(names);
  let leftover = null;
  if (pool.length % 2 !== 0) {
    leftover = pool[pool.length - 1];
    pool = pool.slice(0, -1);
  }
  return { pairs: pairPool(pool, forbiddenKeys), leftover };
}

// Same as formOrgTeams, but for a Mixed Doubles pool: pairs as many true
// mixed (M/F) teams as possible first, then pairs whichever gender has
// players left over among themselves.
function formOrgMixedTeams(pool, femaleNames, forbiddenKeys) {
  const females = shuffle(pool.filter((p) => isFemale(p, femaleNames)).map((p) => p.name));
  const males = shuffle(pool.filter((p) => !isFemale(p, femaleNames)).map((p) => p.name));
  const mixedCount = Math.min(females.length, males.length);
  const trueMixedFemales = females.slice(0, mixedCount);
  const trueMixedMales = males.slice(0, mixedCount);

  let leftoverPool = [...females.slice(mixedCount), ...males.slice(mixedCount)];
  let leftover = null;
  if (leftoverPool.length % 2 !== 0) {
    leftover = leftoverPool[leftoverPool.length - 1];
    leftoverPool = leftoverPool.slice(0, -1);
  }

  const trueMixedPairs = pairAcross(trueMixedFemales, trueMixedMales, forbiddenKeys);
  const sameGenderPairs = pairPool(leftoverPool, forbiddenKeys);

  return {
    pairs: [...trueMixedPairs, ...sameGenderPairs],
    leftover,
    mixedCount: trueMixedPairs.length,
    sameGenderCount: sameGenderPairs.length,
  };
}

// Ensures no CTGT player is left without a partner: if CTGT has an odd one
// out, they're teamed with Intelizign's odd one out when there is one, or
// (if Intelizign paired up evenly) one member is pulled out of an existing
// Intelizign pair to partner the CTGT leftover — which frees that member's
// old partner to be the one left without a partner, which is fine since
// that's an Intelizign player. Only if there are no Intelizign players at
// all does the CTGT leftover stay solo (nobody to pair them with).
function resolveCrossOrgLeftover(ctgtResult, intelizignResult, forbiddenKeys) {
  const ctgtPairs = ctgtResult.pairs;
  let intelizignPairs = intelizignResult.pairs;
  const ctgtLeftover = ctgtResult.leftover;
  let intelizignLeftover = intelizignResult.leftover;
  let crossPair = null;

  if (ctgtLeftover && intelizignLeftover) {
    crossPair = [ctgtLeftover, intelizignLeftover];
    intelizignLeftover = null;
  } else if (ctgtLeftover && intelizignPairs.length > 0) {
    let stealIdx = intelizignPairs.length - 1;
    for (let i = intelizignPairs.length - 1; i >= 0; i--) {
      const [x] = intelizignPairs[i];
      if (!forbiddenKeys.has(pairKey(ctgtLeftover, x))) {
        stealIdx = i;
        break;
      }
    }
    const [a, b] = intelizignPairs[stealIdx];
    intelizignPairs = [...intelizignPairs.slice(0, stealIdx), ...intelizignPairs.slice(stealIdx + 1)];
    if (forbiddenKeys.has(pairKey(ctgtLeftover, a))) {
      crossPair = [ctgtLeftover, b];
      intelizignLeftover = a;
    } else {
      crossPair = [ctgtLeftover, a];
      intelizignLeftover = b;
    }
  }
  // else: ctgtLeftover (if any) has no Intelizign player available at all —
  // stays solo, which is unavoidable.

  const ctgtTeams = teamsFromPairs(ctgtPairs);
  const unresolvedCtgtLeftover = ctgtLeftover && !crossPair ? ctgtLeftover : null;
  if (crossPair) ctgtTeams.push(`${crossPair[0]} / ${crossPair[1]}`);
  if (unresolvedCtgtLeftover) ctgtTeams.push(`${unresolvedCtgtLeftover} (needs partner)`);

  const intelizignTeams = teamsFromPairs(intelizignPairs);
  if (intelizignLeftover) intelizignTeams.push(`${intelizignLeftover} (needs partner)`);

  return {
    ctgtTeams,
    intelizignTeams,
    unresolvedCtgtLeftover,
    intelizignSolo: intelizignLeftover,
  };
}

function singlesSubtitle(entrants, byes) {
  const intelizign = entrants.filter(isIntelizign).length;
  const ctgt = entrants.length - intelizign;
  const orgPart = intelizign > 0 ? ` (${ctgt} CTGT + ${intelizign} Intelizign)` : "";
  const byePart =
    byes > 0 ? `${byes} first-round bye${byes > 1 ? "s" : ""}.` : "a full draw, no byes.";
  return `${entrants.length} entrants${orgPart} — ${byePart}`;
}

function doublesSubtitle(teamCount, size, intelizignTeams, mixedTeams) {
  const ctgtTeams = teamCount - intelizignTeams;
  const orgPart =
    intelizignTeams > 0 ? ` (${ctgtTeams} CTGT + ${intelizignTeams} Intelizign)` : "";
  const mixedPart =
    typeof mixedTeams === "number"
      ? ` ${mixedTeams} true mixed (M/F) pair${mixedTeams === 1 ? "" : "s"}, the rest same-gender.`
      : "";
  return `${teamCount} teams${orgPart} — a ${size}-draw.${mixedPart}`;
}

// Two different people happen to share the first name "Prasanna" — keep
// them off the same doubles team so the scoreboard/bracket stays
// unambiguous (e.g. never "Prasanna Kotkar / Prasanna Karvande").
const NEVER_TEAMMATES = [["Prasanna Kotkar", "Prasanna Karvande"]];

// Organizer-requested Male Singles matchups: these specific pairs always
// play each other, and Prasanna Karvande is always the one who plays the
// CTGT/Intelizign crossover match rather than a randomly-chosen player.
const MALE_SINGLES_FORCED_MATCHUPS = {
  forcedPairs: [
    ["Lalit Wagh", "Aditya Parui"],
    ["Prasanna Kotkar", "Sameer Gupta"],
    ["Rahul Bhalerao", "Nitin Sagare"],
  ],
  forcedCrossover: "Prasanna Karvande",
};

// Organizer-requested: Sameer Gupta's Men's Doubles team is always with
// Intelizign Player 1 specifically (rather than whichever CTGT/Intelizign
// leftover randomly gets paired together).
const MENS_DOUBLES_FORCED_TEAM = ["Sameer Gupta", "Intelizign Player 1"];

const INTELIZIGN_SCHEDULE_NOTE =
  "Intelizign matches are scheduled after the CTGT matches in each round.";
const INTELIZIGN_PLACEHOLDER_NOTE =
  "Intelizign slots are placeholders — swap in real names once Intelizign confirms their players.";

// Extracts the singles-opponent forbidden-pair keys back out of an
// already-built category (used to reshuffle one doubles category alone
// without rebuilding the singles brackets it depends on).
export function firstRoundPairKeysOf(category) {
  const keys = new Set();
  category.rounds[0][1].forEach((m) => {
    if (typeof m.a === "string" && typeof m.b === "string" && m.a !== "BYE" && m.b !== "BYE") {
      keys.add(pairKey(m.a, m.b));
    }
  });
  return keys;
}

function teamForbiddenKeysFrom(forbiddenPairKeys) {
  return new Set([...forbiddenPairKeys, ...NEVER_TEAMMATES.map(([a, b]) => pairKey(a, b))]);
}

export function buildMensDoublesCategory(mensDoublesPool, forbiddenPairKeys) {
  const teamForbiddenKeys = teamForbiddenKeysFrom(forbiddenPairKeys);
  const mensSplit = splitByOrg(mensDoublesPool);

  let ctgtNames = mensSplit.ctgt.map((p) => p.name);
  let intelizignNames = mensSplit.intelizign.map((p) => p.name);
  let forcedTeam = null;
  const [forcedA, forcedB] = MENS_DOUBLES_FORCED_TEAM;
  if (ctgtNames.includes(forcedA) && intelizignNames.includes(forcedB)) {
    forcedTeam = `${forcedA} / ${forcedB}`;
    ctgtNames = ctgtNames.filter((n) => n !== forcedA);
    intelizignNames = intelizignNames.filter((n) => n !== forcedB);
  }

  const mensCtgtResult = formOrgTeams(ctgtNames, teamForbiddenKeys);
  const mensIntelizignResult = formOrgTeams(intelizignNames, teamForbiddenKeys);
  const mensResolved = resolveCrossOrgLeftover(mensCtgtResult, mensIntelizignResult, teamForbiddenKeys);
  if (forcedTeam) mensResolved.ctgtTeams = [...mensResolved.ctgtTeams, forcedTeam];
  const mensBracket = buildGroupedBracket(mensResolved.ctgtTeams, mensResolved.intelizignTeams);

  const mensSoloName = mensResolved.unresolvedCtgtLeftover || mensResolved.intelizignSolo;
  const mensdNoteParts = [];
  if (mensSoloName) {
    mensdNoteParts.push(`${mensSoloName} has no partner yet — find them a teammate before their match.`);
  }
  if (forcedTeam) {
    mensdNoteParts.push(
      "Intelizign only plays singles, except Sameer Gupta's team is paired with Intelizign Player 1 as a one-off exception."
    );
  }
  if (mensResolved.intelizignTeams.length > 0) {
    mensdNoteParts.push(INTELIZIGN_SCHEDULE_NOTE);
  }
  return {
    label: "Men's Doubles",
    subtitle: doublesSubtitle(
      mensResolved.ctgtTeams.length + mensResolved.intelizignTeams.length,
      drawSize(mensBracket),
      mensResolved.intelizignTeams.length
    ),
    note: mensdNoteParts.length ? mensdNoteParts.join(" ") : undefined,
    rounds: mensBracket.rounds,
  };
}

export function buildMixedDoublesCategory(mixedDoublesPool, femaleNames, forbiddenPairKeys) {
  const teamForbiddenKeys = teamForbiddenKeysFrom(forbiddenPairKeys);
  const mixedSplit = splitByOrg(mixedDoublesPool);
  const mixedCtgtResult = formOrgMixedTeams(mixedSplit.ctgt, femaleNames, teamForbiddenKeys);
  const mixedIntelizignResult = formOrgMixedTeams(mixedSplit.intelizign, femaleNames, teamForbiddenKeys);
  const mixedResolved = resolveCrossOrgLeftover(mixedCtgtResult, mixedIntelizignResult, teamForbiddenKeys);
  const mixedBracket = buildGroupedBracket(mixedResolved.ctgtTeams, mixedResolved.intelizignTeams);

  const mixedTotalTeams = mixedResolved.ctgtTeams.length + mixedResolved.intelizignTeams.length;
  const mixedMixedCount = mixedCtgtResult.mixedCount + mixedIntelizignResult.mixedCount;
  const mixedSameGenderCount = mixedCtgtResult.sameGenderCount + mixedIntelizignResult.sameGenderCount;
  const mixedSoloName = mixedResolved.unresolvedCtgtLeftover || mixedResolved.intelizignSolo;
  const mixeddNoteParts = [
    `${mixedMixedCount} true mixed (M/F) pair${mixedMixedCount === 1 ? "" : "s"}; the other ${mixedSameGenderCount} are same-gender pairs because not enough women entered Mixed Doubles.`,
  ];
  if (mixedSoloName) {
    mixeddNoteParts.push(`${mixedSoloName} has no partner yet — find them a teammate before their match.`);
  }
  if (mixedSplit.intelizign.length > 0) {
    mixeddNoteParts.push("Intelizign pairs are placeholders until Intelizign confirms names.", INTELIZIGN_SCHEDULE_NOTE);
  }
  return {
    label: "Mixed Doubles",
    subtitle: doublesSubtitle(mixedTotalTeams, drawSize(mixedBracket), mixedResolved.intelizignTeams.length, mixedMixedCount),
    note: mixeddNoteParts.join(" "),
    rounds: mixedBracket.rounds,
  };
}

export function buildFixtures(participants) {
  const maleEntrants = participants.filter((p) => p.categories.includes("Male Singles"));
  const femaleEntrants = participants.filter((p) => p.categories.includes("Female Singles"));
  const mensDoublesPool = participants.filter((p) => p.categories.includes("Men's Doubles"));
  const mixedDoublesPool = participants.filter((p) => p.categories.includes("Mixed Doubles"));

  const femaleNames = new Set(femaleEntrants.map((p) => p.name));

  // --- Singles brackets first, so we know who opposes whom. ---
  const maleSplit = splitByOrg(maleEntrants);
  const maleBracket = buildGroupedBracket(
    maleSplit.ctgt.map((p) => p.name),
    maleSplit.intelizign.map((p) => p.name),
    MALE_SINGLES_FORCED_MATCHUPS
  );

  const femaleSplit = splitByOrg(femaleEntrants);
  const femaleBracket = buildGroupedBracket(
    femaleSplit.ctgt.map((p) => p.name),
    femaleSplit.intelizign.map((p) => p.name)
  );

  const forbiddenPairKeys = new Set([
    ...maleBracket.firstRoundPairKeys,
    ...femaleBracket.firstRoundPairKeys,
  ]);

  const male = {
    label: "Male Singles",
    subtitle: singlesSubtitle(maleEntrants, drawSize(maleBracket) - maleEntrants.length),
    note: maleEntrants.some(isIntelizign)
      ? `${INTELIZIGN_PLACEHOLDER_NOTE} ${INTELIZIGN_SCHEDULE_NOTE}`
      : undefined,
    rounds: maleBracket.rounds,
  };

  const female = {
    label: "Female Singles",
    subtitle: singlesSubtitle(femaleEntrants, drawSize(femaleBracket) - femaleEntrants.length),
    rounds: femaleBracket.rounds,
  };

  const mensd = buildMensDoublesCategory(mensDoublesPool, forbiddenPairKeys);
  const mixedd = buildMixedDoublesCategory(mixedDoublesPool, femaleNames, forbiddenPairKeys);

  return { male, female, mensd, mixedd };
}
