// Minimal line icons distinguishing singles (one shuttle) from doubles (two).
export default function CategoryIcon({ type }) {
  const shared = {
    viewBox: "0 0 40 40",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    xmlns: "http://www.w3.org/2000/svg",
  };

  if (type === "doubles") {
    return (
      <svg {...shared}>
        <circle cx="14" cy="12" r="5" />
        <path d="M14 17c-5 0-8 3-8 8v3h16v-3c0-5-3-8-8-8z" />
        <circle cx="27" cy="14" r="4" />
        <path d="M27 18c-4 0-6.5 2.5-6.5 6.5V28H33v-3.5c0-4-2-6.5-5.5-6.5z" opacity="0.6" />
      </svg>
    );
  }

  return (
    <svg {...shared}>
      <circle cx="20" cy="11" r="5.5" />
      <path d="M20 17c-6 0-9.5 3.5-9.5 9.5V30h19v-3.5C29.5 20.5 26 17 20 17z" />
    </svg>
  );
}
