import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CircleUserRound, Menu, Sparkles, ShoppingBag, X } from "lucide-react";
import { useCart } from "../context/CartContext";

const links = [
  ["/", "Home"],
  ["/menu", "Menu"],
  ["/about", "Our story"],
  ["/gallery", "Gallery"],
  ["/reservations", "Reservations"],
];

export default function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link to="/" className="logo-link" data-testid="link-logo">
          <span className="logo-badge">
            <Sparkles size={17} />
          </span>
          <span>
            <span className="logo-title font-display">Urban Spice</span>
            <span className="logo-subtitle">A city table</span>
          </span>
        </Link>

        <nav className="main-nav">
          {links.map(([href, label]) => (
            <Link
              key={href}
              to={href}
              className={pathname === href ? "active" : ""}
              data-testid={`link-nav-${label.toLowerCase().replaceAll(" ", "-")}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link to="/profile" className="icon-btn icon-btn-profile" data-testid="link-profile">
            <CircleUserRound size={20} />
          </Link>
          <Link to="/checkout" className="cart-btn" data-testid="link-cart">
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="cart-count" data-testid="text-cart-count">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="menu-toggle"
            aria-label="Toggle menu"
            data-testid="button-toggle-menu"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-nav">
          {links.map(([href, label]) => (
            <Link
              onClick={() => setOpen(false)}
              key={href}
              to={href}
              data-testid={`link-mobile-${label.toLowerCase().replaceAll(" ", "-")}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
