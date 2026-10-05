import { useEffect, useState } from "react";
import { getPicks, subscribeToResults } from "../utils/winnersStore";

export default function useFixturePicks(categoryKey) {
  const [picks, setPicks] = useState(() => getPicks(categoryKey));

  useEffect(() => {
    setPicks(getPicks(categoryKey));
    const unsubscribe = subscribeToResults(() => setPicks(getPicks(categoryKey)));
    return unsubscribe;
  }, [categoryKey]);

  return picks;
}
