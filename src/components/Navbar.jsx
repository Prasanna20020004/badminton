import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <Link to="/" className="nav__mark">
          <strong>CTGT</strong>
          <span>BADMINTON</span>
        </Link>
        <ul className="nav__links">
          <li>
            <a href="#categories">Categories</a>
          </li>
          <li>
            <a href="#fixture">Fixture</a>
          </li>
          <li>
            <a href="#faq">Match-day info</a>
          </li>
        </ul>
      </div>
    </header>
  );
}
