import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from "../components/Field";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setPending(true);
    register(form)
      .then(() => navigate("/", { replace: true }))
      .catch((err) => setError(err.message))
      .finally(() => setPending(false));
  };

  return (
    <div className="auth-shell">
      <div className="auth-side">
        <span className="auth-side-logo font-display">Urban Spice</span>
        <div>
          <h1 className="font-display">Pull up a chair. It only takes a minute.</h1>
          <p style={{ marginTop: 20, maxWidth: 380, fontSize: 14, lineHeight: 1.6, color: "var(--color-text-light)" }}>
            One account for ordering, reservations and everything in between.
          </p>
        </div>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form-inner">
          <p className="eyebrow">Join the table</p>
          <h1 className="font-display">Create account</h1>
          <p>Already have one? Log in instead.</p>
          <form onSubmit={submit} className="auth-form">
            <Field label="Full name" value={form.name} onChange={(v) => update("name", v)} required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
            <Field label="Phone" value={form.phone} onChange={(v) => update("phone", v)} />
            <Field
              label="Password"
              type="password"
              value={form.password}
              onChange={(v) => update("password", v)}
              required
              minLength={6}
            />
            {error && (
              <p className="auth-error" data-testid="status-register-error">
                {error}
              </p>
            )}
            <button disabled={pending} className="btn btn-rust" data-testid="button-submit-register">
              {pending ? "Creating account…" : "Create account"}
            </button>
          </form>
          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login" data-testid="link-to-login">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
