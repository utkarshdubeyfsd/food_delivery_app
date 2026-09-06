# Harvest & Home — Food Delivery App

## Current phase: Frontend — Customer App (UI-first, mocked data)

This phase is a **click-through prototype with zero backend dependency**.
Every screen works against static mock data and client-side state — nothing
calls the Flask API in `backend/` yet (that code is still there from the
earlier phase and still runs standalone, but the frontend doesn't talk to it
right now).

### What's built

- **App shell** — top bar + bottom tab navigation (Home / Cart / Orders /
  Account), routed with `react-router-dom`
- **Restaurant listing** — mock data, simulated loading state
- **Restaurant detail + menu** — grouped by category, add/remove steppers
- **Cart** — pure client-side state (React Context), no persistence
- **Checkout flow** — two-step UI: address → payment (card fields are
  collected but never sent anywhere — no real payment gateway yet)
- **Order confirmation + order status** — status starts at "placed" and
  auto-advances through accepted → preparing → out for delivery → delivered
  every few seconds, to make the tracking screen feel alive
- **Auth screens** — login/signup forms; any email+password combination
  "succeeds" and sets a mock user in context. No real validation, no backend.

### Project structure (frontend)

```
frontend/src/
├── App.tsx                  # routes + providers
├── main.tsx                 # entry point, wraps App in BrowserRouter
├── styles.css
├── types.ts                 # shared types incl. Order, OrderStatus, MockUser
├── layout/
│   └── AppShell.tsx          # top bar + bottom nav + <Outlet/>
├── context/
│   ├── CartContext.tsx       # client-side cart state
│   ├── AuthContext.tsx       # mock auth state
│   └── OrdersContext.tsx     # placed orders + mock status progression
├── mocks/
│   ├── restaurants.ts        # static restaurant data
│   ├── menus.ts               # static menu data
│   └── mockApi.ts            # same function shapes a real API client will have —
│                              # swap the bodies for fetch() calls later, nothing
│                              # that calls this module needs to change
├── components/
│   ├── RestaurantCard.tsx
│   ├── MenuItemRow.tsx
│   ├── CartLineRow.tsx
│   └── StatusTimeline.tsx
└── pages/
    ├── RestaurantListPage.tsx
    ├── RestaurantDetailPage.tsx
    ├── CartPage.tsx
    ├── CheckoutPage.tsx
    ├── OrderConfirmationPage.tsx
    ├── OrderStatusPage.tsx
    ├── OrdersListPage.tsx
    ├── LoginPage.tsx
    ├── SignupPage.tsx
    └── AccountPage.tsx
```

### Running it

```bash
cd frontend
npm install
npm run dev
```

Opens on **http://localhost:5173**. No backend needs to be running.

## Phase 2 — Frontend: Admin Dashboard (UI-first, mocked data)

The `admin/` folder contains the administrative dashboard for restaurant operations, menu management, and real-time incoming order dispatch.

### What's built

- **Admin Auth & Role Switcher** (`/login`) — quick 1-click profiles (Super Admin, Store Manager, Kitchen Lead) or custom credentials with route protection.
- **Overview Dashboard** (`/`) — real-time KPIs (revenue, pending reviews, kitchen tickets, out for delivery), store switcher, and recent tickets feed.
- **Menu Management UI** (`/menu`) — add new items (with dietary tags, pricing, description, emoji), edit existing items, delete items with confirmation modal, and toggle live stock availability ("In Stock" / "Sold Out").
- **Incoming Orders Hub** (`/orders`) — real-time order queue with status tabs (`Placed`, `Accepted`, `Preparing`, `Out for Delivery`, `Delivered`), step-by-step advance buttons, item breakdown, customer details, and cancellation.
- **Simulation Engine** — manual "Simulate Order" button + automated order generation every 25s with synthesized audible chimes and slide-in toast notifications.
- **Store Settings** (`/settings`) — kitchen parameters, prep times, delivery radius, and notification controls.

### Running the Admin Dashboard

```bash
cd admin
npm install
npm run dev
```

Opens on **http://localhost:5174**. Can run simultaneously with the customer app on port 5173.

## The backend (from the previous phase)

`backend/` still contains a working Flask API (CSV-backed restaurants,
menu, and orders) from the earlier "wire it to a real API" pass. It's not
connected to the frontend right now — see `backend/README` behavior via
`app.py` if you want to run it standalone. Reconnecting the two is the next
step once this UI-first prototype is signed off.

## Next steps

- Connect `mocks/mockAdminApi.ts` and `frontend/src/mocks/mockApi.ts` to backend API endpoints
- Real JWT auth across Customer and Admin applications
- Payment gateway integration
- Delivery partner app + live tracking via WebSockets

