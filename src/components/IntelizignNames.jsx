import { useEffect, useState } from "react";
import participants from "../data/participants";
import { saveNames } from "../utils/namesStore";
import useIntelizignNames from "../hooks/useIntelizignNames";

const SLOTS = participants.filter((p) => p.name.startsWith("Intelizign Player"));

export default function IntelizignNames() {
  const [names] = useIntelizignNames();
  const [draft, setDraft] = useState(names);
  const [status, setStatus] = useState("");

  useEffect(() => setDraft(names), [names]);

  const dirty = SLOTS.some((s) => (draft[s.name] || "").trim() !== (names[s.name] || ""));

  function handleSave() {
    setStatus(saveNames(draft) ? "Saved — the fixture now shows these names." : "Your session expired. Sign in again to save.");
  }

  return (
    <div className="names">
      <p className="names__intro">
        Type the real name next to each Intelizign slot. Leave a box empty to keep the placeholder.
        Names update everywhere — singles, doubles teams and the entry list. Results already recorded are kept.
      </p>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Slot</th>
              <th>Plays in</th>
              <th>Real name</th>
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((s) => (
              <tr key={s.name}>
                <td className="names__slot">{s.name}</td>
                <td>
                  {s.categories.map((c) => (
                    <span className="tag" key={c}>{c}</span>
                  ))}
                </td>
                <td>
                  <input
                    className="names__input"
                    type="text"
                    placeholder="Enter name…"
                    value={draft[s.name] || ""}
                    onChange={(e) => {
                      setStatus("");
                      setDraft({ ...draft, [s.name]: e.target.value });
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="names__actions">
        <button type="button" className="btn names__save" onClick={handleSave} disabled={!dirty}>
          Save names
        </button>
        {status && <span className="names__status">{status}</span>}
      </div>
    </div>
  );
}
