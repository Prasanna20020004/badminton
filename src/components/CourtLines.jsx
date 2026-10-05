// Decorative badminton court markings, rendered faint in the hero background.
// Purely structural — echoes the doubles sidelines, service courts and centre line.
export default function CourtLines() {
  return (
    <svg
      className="hero__lines"
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke="#ffffff" strokeOpacity="0.16" strokeWidth="2" fill="none">
        <rect x="120" y="40" width="960" height="420" />
        <rect x="160" y="40" width="880" height="420" />
        <line x1="600" y1="40" x2="600" y2="460" />
        <line x1="120" y1="130" x2="1080" y2="130" />
        <line x1="120" y1="370" x2="1080" y2="370" />
        <line x1="400" y1="40" x2="400" y2="460" />
        <line x1="800" y1="40" x2="800" y2="460" />
      </g>
    </svg>
  );
}
