import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useFetch, useMutation } from "../hooks/useApi";
import * as menuService from "../services/menuService";
import * as adminService from "../services/adminService";
import * as contactService from "../services/contactService";
import DishCard from "../components/DishCard";
import { fallbackMenu } from "../utils/format";

const pillars = [
  {
    title: "Smoke, acid, bloom.",
    text: "Embers, pickles, bright herbs and the kind of char you can smell from the street.",
  },
  {
    title: "Recipes with passports.",
    text: "A playful menu built from family kitchens, late-night carts and classic brasseries.",
  },
  {
    title: "Dinner, without the script.",
    text: "Come in curious. Leave with a new favourite, a full heart and maybe a reservation for next time.",
  },
];

export default function Home() {
  const menuQuery = useFetch(() => menuService.getMenu(), []);
  const health = useFetch(() => adminService.healthCheck().catch(() => null), []);
  const items = (menuQuery.data ?? fallbackMenu).slice(0, 3);
  const [email, setEmail] = useState("");
  const subscribe = useMutation((data) => contactService.subscribeNewsletter(data.email));

  return (
    <div>
      <section className="hero">
        <div className="hero-bg">
          <img
            src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1800"
            alt=""
          />
        </div>
        <div className="hero-inner">
          <div>
            <p className="hero-eyebrow">
              <span className="hero-eyebrow-line" />
              The city’s table
            </p>
            <h1 className="hero-title font-display">
              Come for the <i>flame.</i>
              <br />
              Stay for the story.
            </h1>
            <p className="hero-sub">
              Indian heat, Chinese theatre, Continental comfort — an evening of food with a little more point of
              view.
            </p>
            <div className="hero-cta">
              <Link to="/menu" className="btn btn-gold" data-testid="link-hero-menu">
                Explore the menu <ArrowRight size={17} />
              </Link>
              <Link to="/reservations" className="btn btn-outline" data-testid="link-hero-reserve">
                Reserve your table
              </Link>
            </div>
            <p className="hero-status" data-testid="status-kitchen">
              {health.data?.status === "ok" ? "Kitchen status · taking orders" : "Kitchen status · open for discovery"}
            </p>
          </div>
          <div className="hero-photo-wrap">
            <div className="hero-photo">
              <img
                src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1000"
                alt="A colourful Urban Spice dish"
              />
            </div>
            <div className="hero-badge">
              <p className="hero-badge-num font-display">17</p>
              <p className="hero-badge-text">Market Street · Fort</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">The first course</p>
            <h2 className="section-title font-display">A table with a pulse.</h2>
          </div>
          <Link to="/about" className="link-arrow" data-testid="link-home-story">
            Meet the people behind it <ArrowRight size={16} />
          </Link>
        </div>
        <div className="pillars">
          {pillars.map((pillar, index) => (
            <div key={pillar.title} className={`pillar${index === 1 ? " accent" : ""}`}>
              <span className="pillar-num">0{index + 1}</span>
              <h3 className="font-display">{pillar.title}</h3>
              <p>{pillar.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-tan">
        <div className="section dishes-split" style={{ padding: "80px 20px" }}>
          <div>
            <p className="eyebrow">From the pass</p>
            <h2 className="section-title font-display">What’s worth sharing tonight.</h2>
            <p style={{ marginTop: 20, maxWidth: 380, fontSize: 14, lineHeight: 1.6, color: "var(--color-text-mid)" }}>
              A few signatures to start the conversation. The rest is waiting on the menu.
            </p>
            <Link
              to="/menu"
              className="link-arrow underline"
              style={{ marginTop: 32 }}
              data-testid="link-home-dishes"
            >
              See all dishes <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid-auto-3">
            {items.map((item) => (
              <DishCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="cta-banner">
          <div>
            <p className="eyebrow">The good part</p>
            <h2 className="font-display">Your table is closer than you think.</h2>
            <p>Book for tonight, next week, or the occasion you’re still pretending is casual.</p>
          </div>
          <Link to="/reservations" className="btn btn-gold" data-testid="link-home-book">
            Find a time <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="newsletter-section">
        <p className="eyebrow">Keep a seat warm</p>
        <h2 className="font-display" style={{ marginTop: 12, fontSize: 36, color: "var(--color-brown-deep)" }}>
          A little Urban Spice, occasionally.
        </h2>
        <form
          className="newsletter-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (email) subscribe.mutate({ email });
          }}
        >
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
            placeholder="Email address"
            data-testid="input-home-email"
          />
          <button data-testid="button-home-subscribe">{subscribe.isPending ? "…" : <ArrowRight size={18} />}</button>
        </form>
      </section>
    </div>
  );
}
