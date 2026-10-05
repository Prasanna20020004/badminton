import { computeWinners, resolveSide, championOf } from "../utils/fixtureEngine";
import { setPick } from "../utils/winnersStore";
import useFixturePicks from "../hooks/useFixturePicks";
import useIntelizignNames from "../hooks/useIntelizignNames";
import useFixtures from "../hooks/useFixtures";

function sideClassName(side, decidedText) {
  const classes = ["fixture__side"];
  if (side.kind === "bye") classes.push("fixture__side--bye");
  if (side.kind === "pending") classes.push("fixture__side--pending");
  if (decidedText && side.kind === "literal" && decidedText === side.text) {
    classes.push("fixture__side--winner");
  }
  return classes.join(" ");
}

export default function FixtureTable({ categoryKey, editable = false }) {
  const fixtures = useFixtures();
  const cat = fixtures[categoryKey];
  const picks = useFixturePicks(categoryKey);
  const [, fmt] = useIntelizignNames();
  const winners = computeWinners(cat.rounds, picks);
  const champion = championOf(cat.rounds, winners);

  function handleChange(matchNum, value) {
    setPick(categoryKey, matchNum, value);
  }

  return (
    <div className="fixture">
      <p className="fixture__subtitle">{cat.subtitle}</p>
      {cat.note && <div className="fixture__note">{cat.note}</div>}
      {champion && (
        <div className="fixture__champion">🏆 {cat.label} champion: {fmt(champion)}</div>
      )}

      <div className="table-wrap">
        <table className="table fixture__table">
          <thead>
            <tr>
              <th>Round</th>
              <th>Match</th>
              <th>Player / Team A</th>
              <th>Player / Team B</th>
              <th>Winner</th>
            </tr>
          </thead>
          <tbody>
            {cat.rounds.map(([roundName, matches]) =>
              matches.map((m, idx) => {
                const A = resolveSide(m.a, winners);
                const B = resolveSide(m.b, winners);
                const decidedText = winners[m.num];
                const pick = picks[m.num] || "";
                const hasBye = A.kind === "bye" || B.kind === "bye";
                const isPending = A.kind === "pending" || B.kind === "pending";

                let winnerCell;
                if (hasBye) {
                  winnerCell = <span className="fixture__bye-tag">Bye — advances automatically</span>;
                } else if (isPending) {
                  winnerCell = editable ? (
                    <select className="fixture__select" disabled>
                      <option>Waiting…</option>
                    </select>
                  ) : (
                    <span className="fixture__tbd">Pending</span>
                  );
                } else if (editable) {
                  winnerCell = (
                    <span className="fixture__winner-cell">
                      <select
                        className="fixture__select"
                        value={pick}
                        onChange={(e) => handleChange(m.num, e.target.value)}
                      >
                        <option value="">Select winner</option>
                        <option value="a">{fmt(A.text)}</option>
                        <option value="b">{fmt(B.text)}</option>
                      </select>
                      {pick && (
                        <button
                          type="button"
                          className="fixture__clear"
                          onClick={() => handleChange(m.num, "")}
                        >
                          clear
                        </button>
                      )}
                    </span>
                  );
                } else {
                  winnerCell = decidedText ? (
                    <span className="fixture__decided">{fmt(decidedText)}</span>
                  ) : (
                    <span className="fixture__tbd">TBD</span>
                  );
                }

                return (
                  <tr key={m.num}>
                    <td className="fixture__round-col">{idx === 0 ? roundName : ""}</td>
                    <td className="fixture__match-col">M{m.num}</td>
                    <td>
                      <span className={sideClassName(A, decidedText)}>
                        {A.kind === "bye" ? "BYE" : fmt(A.text)}
                      </span>
                    </td>
                    <td>
                      <span className={sideClassName(B, decidedText)}>
                        {B.kind === "bye" ? "BYE" : fmt(B.text)}
                      </span>
                    </td>
                    <td>{winnerCell}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
