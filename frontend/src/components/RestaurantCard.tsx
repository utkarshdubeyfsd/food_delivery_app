import { useNavigate } from "react-router-dom";
import type { Restaurant } from "../types";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const navigate = useNavigate();

  return (
    <button
      className="restaurant-card"
      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
    >
      <span className="restaurant-card__emoji" aria-hidden="true">
        {restaurant.emoji}
      </span>
      <div className="restaurant-card__body">
        <h3>{restaurant.name}</h3>
        <p className="restaurant-card__meta">
          {restaurant.cuisine} · {restaurant.deliveryTimeMins} min · {restaurant.priceRange}
        </p>
        <p className="restaurant-card__rating">★ {restaurant.rating.toFixed(1)}</p>
      </div>
    </button>
  );
}
