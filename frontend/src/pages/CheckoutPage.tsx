import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { mockApi } from "../mocks/mockApi";
import type { Address } from "../types";

type Step = "address" | "payment";

export function CheckoutPage() {
  const { lines, restaurantId, subtotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("address");
  const [restaurantName, setRestaurantName] = useState("");

  const [address, setAddress] = useState<Address>({ line1: "", city: "", zip: "", instructions: "" });
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [placing, setPlacing] = useState(false);

  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (restaurantId) {
      mockApi.getRestaurant(restaurantId).then((r) => r && setRestaurantName(r.name));
    }
  }, [restaurantId]);

  if (lines.length === 0 || !restaurantId) {
    return <p className="status-text">Your cart is empty — add items before checking out.</p>;
  }

  function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address.line1.trim() || !address.city.trim() || !address.zip.trim()) return;
    setStep("payment");
  }

  function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cardName.trim() || cardNumber.replace(/\s/g, "").length < 4 || !expiry.trim() || !cvv.trim()) {
      return;
    }
    setPlacing(true);
    // No real payment gateway yet — this just simulates a brief processing delay.
    setTimeout(() => {
      const order = placeOrder({
        restaurantId,
        restaurantName,
        items: lines,
        address,
      });
      clearCart();
      setPlacing(false);
      navigate(`/order-confirmation/${order.id}`);
    }, 700);
  }

  return (
    <div>
      <h1 className="page-title">Checkout</h1>

      <ol className="checkout-steps">
        <li className={step === "address" ? "checkout-steps__active" : "checkout-steps__done"}>
          1. Address
        </li>
        <li className={step === "payment" ? "checkout-steps__active" : ""}>2. Payment</li>
      </ol>

      {step === "address" && (
        <form className="checkout-form" onSubmit={handleAddressSubmit}>
          <label>
            Street address
            <input
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
              placeholder="123 MG Road"
              required
            />
          </label>
          <label>
            City
            <input
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              placeholder="Indore"
              required
            />
          </label>
          <label>
            ZIP / Postal code
            <input
              value={address.zip}
              onChange={(e) => setAddress({ ...address, zip: e.target.value })}
              placeholder="452001"
              required
            />
          </label>
          <label>
            Delivery instructions (optional)
            <textarea
              value={address.instructions}
              onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
              placeholder="Gate code, floor, landmark…"
              rows={2}
            />
          </label>
          <button type="submit" className="btn-primary">
            Continue to payment
          </button>
        </form>
      )}

      {step === "payment" && (
        <form className="checkout-form" onSubmit={handlePaymentSubmit}>
          <p className="status-text notice">
            This is a UI-only mock — no real card is charged.
          </p>
          <label>
            Name on card
            <input
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Priya Sharma"
              required
            />
          </label>
          <label>
            Card number
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
              inputMode="numeric"
              required
            />
          </label>
          <div className="checkout-form__row">
            <label>
              Expiry
              <input
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                required
              />
            </label>
            <label>
              CVV
              <input
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                inputMode="numeric"
                required
              />
            </label>
          </div>

          <div className="cart-total">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-total cart-total--muted">
            <span>Delivery fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="cart-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button type="submit" className="btn-primary" disabled={placing}>
            {placing ? "Placing order…" : `Place order · $${total.toFixed(2)}`}
          </button>
          <button
            type="button"
            className="link-back checkout-form__back"
            onClick={() => setStep("address")}
          >
            ← Back to address
          </button>
        </form>
      )}
    </div>
  );
}
