# Harvest & Home — Admin Dashboard (Phase 2)

A dedicated, UI-first administrative dashboard prototype for **Harvest & Home** restaurant operations, menu engineering, and real-time incoming order dispatch.

This app runs standalone on **port 5174** with pure client-side state and mock data, matching the customer application on **port 5173**.

---

## Features

### 1. Authentication & Role Switcher (`/login`)
- Preset 1-click demo logins:
  - **Alex Sterling** — Super Admin (Full access across all locations)
  - **Priya Sharma** — Store Manager (*Spice Route*)
  - **Marco Rossi** — Kitchen Lead (*Bella Napoli*)
- Custom email/password credentials with role assignment.
- Route protection redirecting unauthenticated visitors to `/login`.

### 2. Overview Dashboard (`/`)
- Live KPIs: Today's revenue, orders pending kitchen review, active kitchen tickets, orders out for delivery.
- Recent incoming orders feed with quick single-click status progression.
- Store menu count with real-time in-stock vs. sold-out counts.
- Multi-location dropdown switcher in top header.

### 3. Menu Management UI (`/menu`)
- **Add Menu Item**: Dialog with fields for name, category, price, prep time, description, dietary badges (Vegetarian, Vegan, Gluten-Free, Spicy, Chef's Special), and emoji icons.
- **Edit Menu Item**: Pre-filled modal updating price, description, tags, and parameters.
- **Delete Menu Item**: Confirmation modal preventing accidental removals.
- **Real-time Stock Toggle**: Instant switch to mark items "In Stock" or "Sold Out".
- Dynamic search filtering and category tabs.

### 4. Incoming Orders & Dispatch Hub (`/orders`)
- Live order cards and tab filters (`All`, `Placed`, `Accepted`, `Preparing`, `Out for Delivery`, `Delivered`).
- Step-by-step status transitions directly on cards:
  $$\text{Placed} \longrightarrow \text{Accepted} \longrightarrow \text{Preparing} \longrightarrow \text{Out for Delivery} \longrightarrow \text{Delivered}$$
- Full Order Details modal: Customer info, phone, delivery address, special instructions, line items breakdown, subtotal, delivery fee, tax, and complete audit trail history.
- Order cancellation with customizable reason note.

### 5. Live Simulation Engine
- **⚡ Simulate Incoming Order**: Generates realistic randomized customer orders from active menus.
- **Audible Chime**: Synthesizes a two-tone chime via Web Audio API when tickets arrive.
- **Toast Alert Banner**: Slide-in notification banner when a new order arrives with 1-click "Accept" or "View".
- **Auto-Simulation**: Toggle continuous simulated order arrivals every 25 seconds for live demos.

---

## Running the Admin Dashboard

```bash
cd admin
npm install
npm run dev
```

The admin portal will open at:
👉 **http://localhost:5174**

Customer storefront runs concurrently at:
👉 **http://localhost:5173**
