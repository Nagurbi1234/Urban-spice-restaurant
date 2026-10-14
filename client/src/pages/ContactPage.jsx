import { useState } from "react";
import { Check, Mail, MapPin, Phone } from "lucide-react";
import PageFrame from "../components/PageFrame";
import Field from "../components/Field";
import { useMutation } from "../hooks/useApi";
import * as contactService from "../services/contactService";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const mutation = useMutation((data) => contactService.sendContactMessage(data));

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    mutation.mutate(form, { onSuccess: () => setSent(true) });
  };

  return (
    <PageFrame
      eyebrow="Get in touch"
      title="Questions, feedback, or just saying hello."
      intro="Whether it’s a private event, a compliment for the chef, or a correction — we read every message."
    >
      <div className="contact-grid">
        <div className="contact-form-panel">
          {sent ? (
            <div className="contact-success">
              <div className="success-icon">
                <Check />
              </div>
              <h2 className="font-display" style={{ marginTop: 20, fontSize: 32, color: "var(--color-brown-deep)" }}>
                Message sent.
              </h2>
              <p style={{ marginTop: 8, fontSize: 14, color: "var(--color-text-mid)" }}>
                Thanks for reaching out — we’ll be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="contact-form">
              <div className="form-row-2">
                <Field label="Name" value={form.name} onChange={(v) => update("name", v)} required />
                <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
              </div>
              <Field label="Subject" value={form.subject} onChange={(v) => update("subject", v)} required />
              <label className="field">
                <span className="field-label">Message</span>
                <textarea
                  value={form.message}
                  onChange={(event) => update("message", event.target.value)}
                  rows={5}
                  required
                  minLength={10}
                  className="field-input"
                  style={{ resize: "none" }}
                  data-testid="textarea-contact-message"
                />
              </label>
              <button disabled={mutation.isPending} className="btn btn-rust" data-testid="button-submit-contact">
                {mutation.isPending ? "Sending…" : "Send message"}
              </button>
              {mutation.isError && (
                <p style={{ fontSize: 14, color: "var(--color-rust)" }} data-testid="status-contact-error">
                  {mutation.error?.message || "That didn’t go through. Please try again."}
                </p>
              )}
            </form>
          )}
        </div>

        <div>
          <p className="eyebrow">Find us</p>
          <div className="contact-info">
            <p>
              <strong>Address</strong>
              <br />
              17 Market Street, Fort, Mumbai 400001
            </p>
            <p>
              <strong>Hours</strong>
              <br />
              Tue–Sun · 12 pm – 11 pm
            </p>
            <p className="contact-list-item">
              <Phone size={16} /> +91 22 4890 1717
            </p>
            <p className="contact-list-item">
              <Mail size={16} /> hello@urbanspice.test
            </p>
            <p className="contact-list-item">
              <MapPin size={16} /> Fort, Mumbai
            </p>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
