import { useState } from "react";
import { Check, CalendarDays, Clock3, MapPin, Phone } from "lucide-react";
import PageFrame from "../components/PageFrame";
import Field from "../components/Field";
import { LoadingBlock } from "../components/StateBlocks";
import { useAuth } from "../context/AuthContext";
import { useFetch, useMutation } from "../hooks/useApi";
import * as reservationService from "../services/reservationService";

export default function ReservationsPage() {
  const { user } = useAuth();
  const query = useFetch(() => (user ? reservationService.getReservations() : Promise.resolve([])), [user]);
  const create = useMutation((data) => reservationService.createReservation(data));
  const [done, setDone] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "20:00", guests: "2", specialRequest: "" });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    if (!user) {
      create.mutate(null, { onError: () => {} });
      return;
    }
    create.mutate({ ...form, guests: Number(form.guests) }, { onSuccess: (reservation) => setDone(reservation) });
  };

  const reservations = query.data ?? [];

  return (
    <PageFrame
      eyebrow="Reservations"
      title="Make an evening of it."
      intro="Tell us when you’re coming and we’ll take care of the rest. For groups larger than 10, call the restaurant directly."
    >
      <div className="reservations-grid">
        <div className="reservation-panel">
          {!user ? (
            <div className="success-panel">
              <p style={{ fontSize: 14, color: "var(--color-text-light)" }}>
                Please <a href="/login" style={{ color: "var(--color-gold)", fontWeight: 700 }}>log in</a> to request a
                reservation.
              </p>
            </div>
          ) : done ? (
            <div className="success-panel">
              <div className="success-icon">
                <Check />
              </div>
              <p className="eyebrow" style={{ marginTop: 28 }}>
                Reservation requested
              </p>
              <h2 className="font-display" style={{ marginTop: 12, fontSize: 36 }}>
                We’ll see you at the table.
              </h2>
              <p style={{ marginTop: 16, maxWidth: 380, fontSize: 14, lineHeight: 1.6, color: "var(--color-text-light)" }}>
                {done.date} at {done.time} · {done.guests} guests. A confirmation is on its way.
              </p>
              <button
                onClick={() => setDone(null)}
                className="link-arrow underline"
                style={{ marginTop: 32, color: "var(--color-gold)", borderColor: "var(--color-gold)" }}
                data-testid="button-new-reservation"
              >
                Make another reservation
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="reservation-form">
              <p className="eyebrow" style={{ color: "var(--color-gold)" }}>
                Request a table
              </p>
              <div className="form-row-2">
                <Field label="Name" value={form.name} onChange={(v) => update("name", v)} required dark />
                <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required dark />
                <Field label="Phone" value={form.phone} onChange={(v) => update("phone", v)} required dark />
                <Field label="Guests" type="number" min="1" value={form.guests} onChange={(v) => update("guests", v)} required dark />
              </div>
              <div className="form-row-2">
                <Field
                  label="Date"
                  type="date"
                  value={form.date}
                  onChange={(v) => update("date", v)}
                  required
                  dark
                  min={new Date().toISOString().slice(0, 10)}
                />
                <label className="field">
                  <span className="field-label dark">Preferred time</span>
                  <select
                    value={form.time}
                    onChange={(event) => update("time", event.target.value)}
                    className="field-input dark"
                    data-testid="select-reservation-time"
                  >
                    <option style={{ color: "#54251e" }}>18:30</option>
                    <option style={{ color: "#54251e" }}>20:00</option>
                    <option style={{ color: "#54251e" }}>21:30</option>
                  </select>
                </label>
              </div>
              <label className="field">
                <span className="field-label dark">Anything we should know?</span>
                <textarea
                  value={form.specialRequest}
                  onChange={(event) => update("specialRequest", event.target.value)}
                  rows={3}
                  className="field-input dark"
                  style={{ resize: "none" }}
                  placeholder="A birthday, allergies, a favourite corner…"
                  data-testid="textarea-reservation-request"
                />
              </label>
              <button disabled={create.isPending} className="btn btn-gold" data-testid="button-submit-reservation">
                {create.isPending ? "Checking the diary…" : "Request reservation"}
              </button>
              {create.isError && (
                <p style={{ fontSize: 14, color: "#f1a992" }} data-testid="status-reservation-error">
                  We couldn’t save that request. Please try again.
                </p>
              )}
            </form>
          )}
        </div>

        <aside>
          <p className="eyebrow aside-title">Your upcoming tables</p>
          {query.isLoading ? (
            <LoadingBlock label="Finding your reservations…" />
          ) : reservations.length ? (
            <div>
              {reservations.map((reservation) => (
                <div key={reservation.id} className="reservation-card" data-testid={`card-reservation-${reservation.id}`}>
                  <div className="reservation-card-head">
                    <div>
                      <p className="reservation-card-date font-display">{reservation.date}</p>
                      <p className="reservation-card-meta">
                        {reservation.time} · {reservation.guests} guests
                      </p>
                    </div>
                    <span className="pill pill-green">{reservation.status}</span>
                  </div>
                  <p className="reservation-card-id">Booking {reservation.id}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashed-box" data-testid="empty-reservations">
              <CalendarDays />
              <h3>No tables booked yet.</h3>
              <p>Your next good evening can start here.</p>
            </div>
          )}
          <div className="contact-list">
            <p className="contact-list-item">
              <Clock3 size={16} /> Tue–Sun · 12 pm–11 pm
            </p>
            <p className="contact-list-item">
              <Phone size={16} /> +91 22 4890 1717
            </p>
            <p className="contact-list-item">
              <MapPin size={16} /> 17 Market Street, Fort
            </p>
          </div>
        </aside>
      </div>
    </PageFrame>
  );
}
