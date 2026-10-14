import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import PageFrame from "../components/PageFrame";
import QuantityControl from "../components/QuantityControl";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useMutation } from "../hooks/useApi";
import * as orderService from "../services/orderService";
import { money } from "../utils/format";

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=200";

export default function CheckoutPage() {
  const { items, subtotal, tax, deliveryFee, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || "");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const create = useMutation((data) => orderService.createOrder(data));

  const placeOrder = () => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    create.mutate(
      { items, deliveryAddress: address, paymentMethod },
      {
        onSuccess: (order) => {
          clear();
          navigate(`/orders/${order.id}`);
        },
      }
    );
  };

  return (
    <PageFrame eyebrow="Your table" title="Review before it hits the kitchen.">
      {items.length === 0 ? (
        <div className="dashed-box" data-testid="empty-cart">
          <ShoppingBag />
          <h3>Your table is empty.</h3>
          <p>Add something from the menu to get started.</p>
        </div>
      ) : (
        <div className="checkout-grid">
          <div>
            <p className="eyebrow" style={{ marginBottom: 20 }}>
              Your order
            </p>
            <div className="cart-list">
              {items.map((item) => (
                <div key={item.menuItemId} className="cart-row" data-testid={`row-cart-${item.menuItemId}`}>
                  <img src={item.image || FALLBACK_IMAGE} alt={item.name} />
                  <div className="cart-row-info">
                    <p className="font-display">{item.name}</p>
                    <p>{money(item.price)} each</p>
                  </div>
                  <QuantityControl id={item.menuItemId} quantity={item.quantity} />
                  <span className="cart-row-total">{money(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="checkout-panel">
            <p className="eyebrow" style={{ color: "var(--color-gold)" }}>
              Delivery details
            </p>
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              rows={3}
              placeholder="Delivery address"
              data-testid="textarea-delivery-address"
            />
            <p className="eyebrow" style={{ marginTop: 28, color: "var(--color-gold)" }}>
              Payment method
            </p>
            <div className="payment-options">
              {[["cod", "Cash on delivery"], ["online", "Pay online"]].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setPaymentMethod(value)}
                  className={`payment-option${paymentMethod === value ? " active" : ""}`}
                  data-testid={`button-payment-${value}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "var(--color-text-light)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Tax</span>
                <span>{money(tax)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Delivery fee</span>
                <span>{money(deliveryFee)}</span>
              </div>
            </div>

            <div className="checkout-total">
              <span className="eyebrow" style={{ color: "var(--color-text-light)" }}>
                Total
              </span>
              <span className="checkout-total-value font-display">{money(total)}</span>
            </div>

            <button onClick={placeOrder} disabled={create.isPending || !address} className="btn btn-gold" data-testid="button-place-order">
              {create.isPending ? "Placing order…" : "Place order"}
            </button>
            {create.isError && (
              <p style={{ marginTop: 12, fontSize: 14, color: "#f1a992" }} data-testid="status-order-error">
                {create.error?.message || "We couldn’t place that order."}
              </p>
            )}
          </div>
        </div>
      )}
    </PageFrame>
  );
}
