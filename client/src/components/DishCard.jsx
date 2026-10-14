import { Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1200";

export default function DishCard({ item, onAdd }) {
  const { add } = useCart();
  return (
    <article className="dish-card" data-testid={`card-dish-${item.id}`}>
      <div className="dish-card-image-wrap">
        <img src={item.image || FALLBACK_IMAGE} alt={item.name} />
        <span className="dish-card-tag">{item.category}</span>
        {item.isVegetarian && <span className="dish-card-veg">Vegetarian</span>}
      </div>
      <div className="dish-card-body">
        <div className="dish-card-head">
          <h3 className="font-display">{item.name}</h3>
          <span className="dish-card-price">₹{item.price}</span>
        </div>
        <p className="dish-card-desc">{item.description}</p>
        <div className="dish-card-footer">
          <span className="dish-card-rating">★ {Number(item.rating ?? 4.5).toFixed(1)}</span>
          <button
            onClick={() => {
              add(item);
              onAdd?.(item);
            }}
            className="dish-card-add"
            data-testid={`button-add-${item.id}`}
          >
            Add to table <Plus size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
