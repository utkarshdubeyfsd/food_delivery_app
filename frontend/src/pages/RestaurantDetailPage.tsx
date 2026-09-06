import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { MenuItem, Restaurant } from "../types";
import { mockApi } from "../mocks/mockApi";
import { MenuItemRow } from "../components/MenuItemRow";
import { useCart } from "../context/CartContext";

export function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lines, itemCount, subtotal } = useCart();

  const [restaurant, setRestaurant] = useState<Restaurant | undefined>();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([mockApi.getRestaurant(id), mockApi.getMenu(id)]).then(([r, m]) => {
      if (!cancelled) {
        setRestaurant(r);
        setMenu(m);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p className="status-text">Loading menu…</p>;
  if (!restaurant) return <p className="status-text status-error">Restaurant not found.</p>;

  const grouped = groupByCategory(menu);
  const cartBelongsHere = lines.length === 0 || lines[0].menuItem.restaurantId === restaurant.id;

  return (
    <div>
      <Link className="link-back" to="/">
        ← All restaurants
      </Link>

      <header className="menu-header">
        <span className="menu-header__emoji" aria-hidden="true">
          {restaurant.emoji}
        </span>
        <div>
          <h2>{restaurant.name}</h2>
          <p className="restaurant-card__meta">
            {restaurant.cuisine} · {restaurant.deliveryTimeMins} min · ★{" "}
            {restaurant.rating.toFixed(1)}
          </p>
        </div>
      </header>

      {!cartBelongsHere && (
        <p className="status-text notice">
          Adding items here will replace your current cart from another restaurant.
        </p>
      )}

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="menu-section">
          <h4 className="menu-section__title">{category}</h4>
          {items.map((item) => (
            <MenuItemRow key={item.id} item={item} />
          ))}
        </section>
      ))}

      {itemCount > 0 && cartBelongsHere && (
        <button className="cart-bar" onClick={() => navigate("/cart")}>
          View cart · {itemCount} {itemCount === 1 ? "item" : "items"} · $
          {subtotal.toFixed(2)}
        </button>
      )}
    </div>
  );
}

function groupByCategory(menu: MenuItem[]): Record<string, MenuItem[]> {
  return menu.reduce<Record<string, MenuItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});
}
