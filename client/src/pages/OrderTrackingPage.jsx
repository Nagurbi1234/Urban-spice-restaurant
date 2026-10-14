import { useParams } from "react-router-dom";
import { CheckCircle2, ChefHat, CookingPot, PackageCheck, Truck } from "lucide-react";
import PageFrame from "../components/PageFrame";
import { LoadingBlock, ErrorBlock } from "../components/StateBlocks";
import { useFetch } from "../hooks/useApi";
import * as orderService from "../services/orderService";
import { money, formatDate } from "../utils/format";

const steps = [
  ["Pending", "Order received", CheckCircle2],
  ["Confirmed", "Kitchen confirmed", ChefHat],
  ["Preparing", "On the fire", CookingPot],
  ["Out for Delivery", "On its way", Truck],
  ["Delivered", "Enjoy the meal", PackageCheck],
];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const query = useFetch(() => orderService.getOrder(id), [id]);

  if (query.isLoading) {
    return (
      <PageFrame eyebrow="Order tracking" title="Following your order.">
        <LoadingBlock label="Locating your order…" />
      </PageFrame>
    );
  }

  if (query.isError || !query.data) {
    return (
      <PageFrame eyebrow="Order tracking" title="Following your order.">
        <ErrorBlock onRetry={() => query.refetch()} />
      </PageFrame>
    );
  }

  const order = query.data;
  const activeIndex = order.orderStatus === "Cancelled" ? -1 : steps.findIndex(([status]) => status === order.orderStatus);

  return (
    <PageFrame eyebrow="Order tracking" title={`Order ${order.id.slice(-8).toUpperCase()}`}>
      <div className="tracking-grid">
        <div className="tracking-status-panel">
          <div className="tracking-status-head">
            <div>
              <p className="eyebrow" style={{ color: "var(--color-gold)" }}>
                {formatDate(order.createdAt)}
              </p>
              <h2 className="font-display" style={{ marginTop: 8, fontSize: 30 }}>
                {order.orderStatus === "Cancelled" ? "Order cancelled" : "On its way to you"}
              </h2>
            </div>
            <span className="pill pill-green">{order.paymentStatus}</span>
          </div>

          <div className="tracking-steps">
            {steps.map(([status, label, Icon], index) => (
              <div key={status} className="tracking-step">
                <span className={`tracking-step-icon${index <= activeIndex ? " active" : ""}`}>
                  <Icon size={17} />
                </span>
                <div>
                  <p className={`tracking-step-title${index <= activeIndex ? " active" : ""}`}>{label}</p>
                  <p className="tracking-step-desc">{status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tracking-summary">
          <p className="eyebrow">Order summary</p>
          {order.items.map((item) => (
            <div key={item.name} className="tracking-item-row">
              <span>
                {item.quantity} × {item.name}
              </span>
              <span>{money(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="tracking-total-row">
            <span>Total</span>
            <span>{money(order.totalAmount)}</span>
          </div>
          <p style={{ marginTop: 20, fontSize: 12, color: "var(--color-text-mid)" }}>
            Delivering to: {order.deliveryAddress || "—"}
          </p>
        </div>
      </div>
    </PageFrame>
  );
}
