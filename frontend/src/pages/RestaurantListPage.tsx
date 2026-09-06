import { useEffect, useState } from "react";
import type { Restaurant } from "../types";
import { mockApi } from "../mocks/mockApi";
import { RestaurantCard } from "../components/RestaurantCard";

export function RestaurantListPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    mockApi.getRestaurants().then((data) => {
      if (!cancelled) {
        setRestaurants(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <h1 className="page-title">What are you craving?</h1>
      {loading ? (
        <p className="status-text">Loading restaurants…</p>
      ) : (
        <div className="restaurant-grid">
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </>
  );
}
