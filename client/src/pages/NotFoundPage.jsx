import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <h1 className="font-display">404</h1>
      <p>This table doesn’t exist. Let’s find you a better seat.</p>
      <Link to="/" className="btn btn-rust" style={{ marginTop: 24 }} data-testid="link-home-from-404">
        Back to Urban Spice
      </Link>
    </div>
  );
}
