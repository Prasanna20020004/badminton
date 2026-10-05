import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import participants from "../data/participants";
import { logout } from "../auth";
import FixtureBoard from "../components/FixtureBoard";
import IntelizignNames from "../components/IntelizignNames";
import useIntelizignNames from "../hooks/useIntelizignNames";

const CATEGORIES = ["Male Singles", "Female Singles", "Men's Doubles", "Mixed Doubles"];

export default function AdminDashboard() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState("entries"); // "entries" | "fixture" | "names"
  const navigate = useNavigate();
  const [names, fmt] = useIntelizignNames();

  const counts = useMemo(() => {
    const c = {};
    participants.forEach((p) => p.categories.forEach((cat) => (c[cat] = (c[cat] || 0) + 1)));
    return c;
  }, []);

  const filtered = useMemo(() => {
    return participants.filter((p) => {
      const matchesQuery =
        query.trim() === "" ||
        fmt(p.name).toLowerCase().includes(query.trim().toLowerCase()) ||
        p.name.toLowerCase().includes(query.trim().toLowerCase()) ||
        p.email.toLowerCase().includes(query.trim().toLowerCase());
      const matchesCategory = category === "all" || p.categories.includes(category);
      return matchesQuery && matchesCategory;
    });
  }, [query, category, names]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSignOut() {
    logout();
    navigate("/admin");
  }

  return (
    <div>
      <div className="admin-bar">
        <div className="wrap admin-bar__inner">
          <span className="admin-bar__title">
            CTGT Badminton <span>· Organizer view</span>
          </span>
          <button className="btn btn--ghost" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>

      <div className="wrap dash">
        <div className="dash__stats">
          <div className="dash__stat">
            <b>{participants.length}</b>
            <span>Total players</span>
          </div>
          {CATEGORIES.map((cat) => (
            <div className="dash__stat" key={cat}>
              <b>{counts[cat] || 0}</b>
              <span>{cat}</span>
            </div>
          ))}
        </div>

        <div className="dash__view-toggle">
          <button
            type="button"
            className={"dash__view-btn" + (view === "entries" ? " dash__view-btn--active" : "")}
            onClick={() => setView("entries")}
          >
            Entry list
          </button>
          <button
            type="button"
            className={"dash__view-btn" + (view === "fixture" ? " dash__view-btn--active" : "")}
            onClick={() => setView("fixture")}
          >
            Fixture — record results
          </button>
          <button
            type="button"
            className={"dash__view-btn" + (view === "names" ? " dash__view-btn--active" : "")}
            onClick={() => setView("names")}
          >
            Intelizign names
          </button>
        </div>

        {view === "fixture" && <FixtureBoard editable={true} />}

        {view === "names" && <IntelizignNames />}

        {view === "entries" && (
          <>
            <div className="dash__controls">
              <input
                type="text"
                placeholder="Search by name or email…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="all">All categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <p className="dash__count">
              Showing {filtered.length} of {participants.length} players
            </p>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Categories</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr key={p.id}>
                      <td>{i + 1}</td>
                      <td>
                        {fmt(p.name)}
                        {fmt(p.name) !== p.name && <div className="muted" style={{ fontSize: 12 }}>{p.name}</div>}
                      </td>
                      <td>{p.email ? p.email : <span className="muted">—</span>}</td>
                      <td>
                        {p.categories.map((c) => (
                          <span className="tag" key={c}>
                            {c}
                          </span>
                        ))}
                      </td>
                      <td style={{ whiteSpace: "pre-line" }}>{p.comments ? p.comments : <span className="muted">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <div className="empty">No players match that search.</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
