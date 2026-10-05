import { useEffect, useState } from "react";
import { getNames, subscribeToNames, applyNames } from "../utils/namesStore";

// Returns [names, fmt] — fmt(label) swaps Intelizign placeholders for their real names.
export default function useIntelizignNames() {
  const [names, setNames] = useState(getNames);
  useEffect(() => subscribeToNames(() => setNames(getNames())), []);
  return [names, (text) => applyNames(text, names)];
}
