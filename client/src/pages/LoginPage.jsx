import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Field from "../components/Field";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const redirectTo = location.state?.from || "/";

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setPending(true);
    login(form)
      .then(() => navigate(redirectTo, { replace: true }))
      .catch((err) => setError(err.message))
      .finally(() => setPending(false));
  };

  return (
    <div className="auth-shell">
      <div className="auth-side">
        <span className="auth-side-logo font-display">Urban Spice</span>
        <div>
          <h1 className="font-display">Good evenings start with a good login.</h1>
          <p style={{ marginTop: 20, maxWidth: 380, fontSize: 14, lineHeight: 1.6, color: "var(--color-text-light)" }}>
            Track orders, manage reservations, and get to your table faster next time.
          </p>
        </div>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form-inner">
          <p className="eyebrow">Welcome back</p>
          <h1 className="font-display">Log in</h1>
          <p>New to Urban Spice? Create an account in under a minute.</p>
          <form onSubmit={submit} className="auth-form">
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            <Field
              label="Password"
              type="password"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
              required
            />
            {error && (
              <p className="auth-error" data-testid="status-login-error">
                {error}
              </p>
            )}
            <button disabled={pending} className="btn btn-rust" data-testid="button-submit-login">
              {pending ? "Signing in…" : "Log in"}
            </button>
          </form>
          <p className="auth-switch">
            Don’t have an account?{" "}
            <Link to="/register" data-testid="link-to-register">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
