import { useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useOrders } from "../context/OrdersContext";

export function StoreSettingsPage() {
  const { activeRestaurant, restaurants } = useAdminAuth();
  const { soundEnabled, setSoundEnabled, autoSimulate, setAutoSimulate } = useOrders();

  const [deliveryRadius, setDeliveryRadius] = useState("5.0");
  const [estimatedPrepTime, setEstimatedPrepTime] = useState("20");
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [savedFeedback, setSavedFeedback] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  }

  const currentStore =
    activeRestaurant || (restaurants.length > 0 ? restaurants[0] : null);

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: 4 }}>Store Settings</h1>
        <p style={{ color: "var(--ink-muted)", fontSize: "0.92rem" }}>
          Configure operating hours, dispatch radii, notification preferences, and store status.
        </p>
      </div>

      {savedFeedback && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#d1fae5",
            border: "1px solid #6ee7b7",
            borderRadius: "var(--radius-md)",
            color: "#065f46",
            fontSize: "0.88rem",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          ✓ Store settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Store Profile Card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)",
            padding: 24,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3 style={{ fontSize: "1.15rem", marginBottom: 16 }}>Location Profile</h3>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Active Store Context</label>
            <div style={{ fontWeight: 600, fontSize: "1rem", color: "var(--ink-primary)" }}>
              {currentStore ? `${currentStore.emoji} ${currentStore.name}` : "All Stores"}
            </div>
            {currentStore && (
              <div style={{ fontSize: "0.82rem", color: "var(--ink-muted)", marginTop: 2 }}>
                📍 {currentStore.address} • 📞 {currentStore.phone}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              backgroundColor: "var(--surface-subtle)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div>
              <span style={{ fontWeight: 600, fontSize: "0.9rem", display: "block" }}>
                Accepting Orders Online
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>
                When switched off, customers will see your kitchen as "Currently Closed".
              </span>
            </div>
            <label className="switch-label">
              <input
                type="checkbox"
                className="switch-input"
                checked={isStoreOpen}
                onChange={(e) => setIsStoreOpen(e.target.checked)}
              />
              <span className="switch-slider" />
            </label>
          </div>
        </div>

        {/* Operational Parameters */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)",
            padding: 24,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3 style={{ fontSize: "1.15rem", marginBottom: 16 }}>Fulfillment Parameters</h3>

          <div className="form-row" style={{ marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="setting-prep">
                Default Kitchen Prep Time (Minutes)
              </label>
              <input
                id="setting-prep"
                className="form-input"
                type="number"
                min="5"
                max="90"
                value={estimatedPrepTime}
                onChange={(e) => setEstimatedPrepTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="setting-radius">
                Delivery Service Radius (Miles)
              </label>
              <input
                id="setting-radius"
                className="form-input"
                type="number"
                step="0.5"
                min="1"
                max="30"
                value={deliveryRadius}
                onChange={(e) => setDeliveryRadius(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Audio & Alert Preferences */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)",
            padding: 24,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3 style={{ fontSize: "1.15rem", marginBottom: 16 }}>Notification &amp; Simulation</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span style={{ fontWeight: 600, fontSize: "0.88rem", display: "block" }}>
                  Audible Incoming Order Chime
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>
                  Plays two-tone chime when a new customer order ticket is submitted.
                </span>
              </div>
              <label className="switch-label">
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                />
                <span className="switch-slider" />
              </label>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 14,
                borderTop: "1px solid var(--border-subtle)",
              }}
            >
              <div>
                <span style={{ fontWeight: 600, fontSize: "0.88rem", display: "block" }}>
                  Continuous Demo Order Generator (Auto-Simulation)
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>
                  Spawns a mock order every 25s for demonstration and presentation testing.
                </span>
              </div>
              <label className="switch-label">
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={autoSimulate}
                  onChange={(e) => setAutoSimulate(e.target.checked)}
                />
                <span className="switch-slider" />
              </label>
            </div>
          </div>
        </div>

        <div>
          <button type="submit" className="btn btn-primary">
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
