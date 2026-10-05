import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CourtLines from "../components/CourtLines";
import CategoryIcon from "../components/CategoryIcon";
import FixtureBoard from "../components/FixtureBoard";
import participants from "../data/participants";

const CATEGORY_ORDER = [
  { name: "Male Singles", type: "singles" },
  { name: "Female Singles", type: "singles" },
  { name: "Men's Doubles", type: "doubles" },
  { name: "Mixed Doubles", type: "doubles" },
];

const FAQS = [
  {
    q: "When does the tournament take place?",
    a: "The organizing committee will confirm the match-day schedule once the draw is finalized. Keep an eye on the CTGT internal announcements.",
  },
  {
    q: "Do I need to bring my own racket?",
    a: "If you have one, bring it. A limited number of spares will be available at the venue for players who need one.",
  },
  {
    q: "Will it be indoors or outdoors?",
    a: "Matches will be played on a closed, indoor court, weather won't be a factor.",
  },
  {
    q: "Registrations are closed — can I still get in?",
    a: "The entry list is locked for this edition. Reach out to the organizing committee if you'd like to be added to a waitlist.",
  },
];

function useCategoryCounts() {
  const counts = {};
  participants.forEach((p) => {
    p.categories.forEach((c) => {
      counts[c] = (counts[c] || 0) + 1;
    });
  });
  return counts;
}

export default function Home() {
  const counts = useCategoryCounts();
  const totalPlayers = participants.length;
  const totalEntries = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div>
      <Navbar />

      <section className="hero">
        <CourtLines />
        <div className="wrap hero__inner">
          <span className="hero__badge">Registrations closed</span>
          <h1>CTGT Badminton Tournament</h1>
          <p className="hero__sub">
            Registration's closed and the draw is up next. Here's the board —
            who's registered, how each category is shaping up, and what to
            expect on match day.
          </p>

          <div className="hero__facts">
            <div className="hero__fact">
              <b>{totalPlayers}</b>
              <span>Players registered</span>
            </div>
            <div className="hero__fact">
              <b>{CATEGORY_ORDER.length}</b>
              <span>Categories on offer</span>
            </div>
            <div className="hero__fact">
              <b>{totalEntries}</b>
              <span>Total category entries</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="categories">
        <div className="wrap">
          <div className="section__head">
            <h2>Categories</h2>
            <p>How the entry list breaks down across each event.</p>
          </div>

          <div className="categories">
            {CATEGORY_ORDER.map((cat) => (
              <div className="category" key={cat.name}>
                <div className="category__icon" style={{ color: "#0f3d2e" }}>
                  <CategoryIcon type={cat.type} />
                </div>
                <h3>{cat.name}</h3>
                <div className="category__count">
                  <b>{counts[cat.name] || 0}</b>
                  <span>players entered</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="fixture">
        <div className="wrap">
          <div className="section__head">
            <h2>Fixture</h2>
            <p>The draw for each category. Results are posted by the organizers as matches finish.</p>
          </div>

          <FixtureBoard editable={false} />
        </div>
      </section>

      <section className="section section--raised" id="faq">
        <div className="wrap">
          <div className="section__head">
            <h2>Match-day info</h2>
            <p>Answers to what players have already been asking.</p>
          </div>

          <div className="faq">
            {FAQS.map((item) => (
              <div className="faq__item" key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
