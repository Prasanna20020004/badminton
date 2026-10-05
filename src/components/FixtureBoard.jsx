import { useState } from "react";
import { FIXTURE_CATEGORY_KEYS } from "../data/fixtures";
import useFixtures from "../hooks/useFixtures";
import FixtureTable from "./FixtureTable";

export default function FixtureBoard({ editable = false }) {
  const [active, setActive] = useState(FIXTURE_CATEGORY_KEYS[0]);
  const fixtures = useFixtures();

  return (
    <div className="fixture-board">
      <div className="fixture-board__tabs">
        {FIXTURE_CATEGORY_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={
              "fixture-board__tab" + (active === key ? " fixture-board__tab--active" : "")
            }
            onClick={() => setActive(key)}
          >
            {fixtures[key].label}
          </button>
        ))}
      </div>
      <FixtureTable categoryKey={active} editable={editable} />
    </div>
  );
}
