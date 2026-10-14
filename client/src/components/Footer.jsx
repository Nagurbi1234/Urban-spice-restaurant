import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Instagram } from "lucide-react";
import * as contactService from "../services/contactService";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    if (!email || pending) return;
    setPending(true);
    contactService
      .subscribeNewsletter(email)
      .then(() => setSent(true))
      .catch(() => setSent(true)) // still confirm visually even on duplicate-email errors
      .finally(() => setPending(false));
  };

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <span className="footer-brand font-display">Urban Spice</span>
          <p className="footer-desc">
            A warm, bright table for food that travels well — from the subcontinent to the city and back.
          </p>
          <div className="footer-social">
            <Instagram size={18} />
            <span>@urbanspice.table</span>
          </div>
        </div>

        <div>
          <h3 className="footer-heading">Explore</h3>
          <div className="footer-links">
            <Link to="/menu" data-testid="footer-link-menu">The menu</Link>
            <Link to="/about" data-testid="footer-link-about">Our story</Link>
            <Link to="/gallery" data-testid="footer-link-gallery">Gallery</Link>
            <Link to="/reservations" data-testid="footer-link-reservations">Reservations</Link>
          </div>
        </div>

        <div>
          <h3 className="footer-heading">Visit</h3>
          <p className="footer-address">
            17 Market Street
            <br />
            Fort, Mumbai 400001
            <br />
            <br />
            Tue–Sun · 12 pm–11 pm
          </p>
        </div>

        <div>
          <h3 className="footer-heading">A note from the table</h3>
          <p className="footer-newsletter-text">
            Seasonal menus, new tables, no noise. One considered email every few weeks.
          </p>
          {sent ? (
            <p className="footer-newsletter-success" data-testid="status-newsletter-success">
              You’re on the list. See you soon.
            </p>
          ) : (
            <form className="footer-newsletter-form" onSubmit={submit}>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
                placeholder="Your email"
                data-testid="input-newsletter-email"
              />
              <button aria-label="Subscribe" data-testid="button-subscribe-newsletter">
                {pending ? "…" : <ArrowRight size={18} />}
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="footer-bottom">© 2025 Urban Spice · Made for long lunches and late dinners</div>
    </footer>
  );
}
