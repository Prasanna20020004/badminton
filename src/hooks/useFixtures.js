import { useEffect, useState } from "react";
import { getFixtures, subscribeToFixtures } from "../utils/fixtureStore";

// Returns the current draw (generated once, persisted thereafter). Re-renders
// if an admin regenerates the draw, in this tab or another.
export default function useFixtures() {
  const [fixtures, setFixtures] = useState(getFixtures);
  useEffect(() => subscribeToFixtures(() => setFixtures(getFixtures())), []);
  return fixtures;
}
