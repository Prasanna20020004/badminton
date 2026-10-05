import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <span>CTGT Badminton Tournament, 2026.</span>
        <Link to="/admin">Organizer login</Link>
      </div>
    </footer>
  );
}
