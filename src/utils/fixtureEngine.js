// Pure functions for turning fixture data + recorded picks into resolved
// match results. No side effects, no storage access — easy to reuse in
// both the public (read-only) and admin (editable) views.

export function flatMatches(rounds) {
  return rounds.flatMap(([, matches]) => matches).sort((a, b) => a.num - b.num);
}

export function resolveSide(side, winners) {
  if (side === "BYE") return { text: "BYE", kind: "bye" };
  if (side && typeof side === "object" && "ref" in side) {
    const w = winners[side.ref];
    return w ? { text: w, kind: "literal" } : { text: `Winner M${side.ref}`, kind: "pending" };
  }
  return { text: side, kind: "literal" };
}

// picks: { [matchNum]: "a" | "b" } — the admin's recorded choices.
// Byes are resolved automatically regardless of picks. A pick only takes
// effect once both sides of its match are literal (not still pending on an
// earlier match), and is otherwise ignored — so if an earlier result
// changes, anything downstream that no longer makes sense quietly reverts
// to "not yet decided" rather than showing a stale name.
export function computeWinners(rounds, picks) {
  const matches = flatMatches(rounds);
  const winners = {};
  matches.forEach((m) => {
    const A = resolveSide(m.a, winners);
    const B = resolveSide(m.b, winners);
    if (A.kind === "bye" && B.kind === "literal") {
      winners[m.num] = B.text;
      return;
    }
    if (B.kind === "bye" && A.kind === "literal") {
      winners[m.num] = A.text;
      return;
    }
    if (A.kind === "literal" && B.kind === "literal") {
      const pick = picks[m.num];
      if (pick === "a") winners[m.num] = A.text;
      else if (pick === "b") winners[m.num] = B.text;
    }
  });
  return winners;
}

export function championOf(rounds, winners) {
  const matches = flatMatches(rounds);
  const finalMatch = matches[matches.length - 1];
  return winners[finalMatch.num];
}
