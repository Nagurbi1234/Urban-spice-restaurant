import { Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function QuantityControl({ id, quantity }) {
  const { adjust } = useCart();
  return (
    <div className="qty-control">
      <button onClick={() => adjust(id, -1)} data-testid={`button-decrease-${id}`}>
        <Minus size={13} />
      </button>
      <span data-testid={`text-quantity-${id}`}>{quantity}</span>
      <button onClick={() => adjust(id, 1)} data-testid={`button-increase-${id}`}>
        <Plus size={13} />
      </button>
    </div>
  );
}
