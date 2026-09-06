# Harvest & Home — Full-Stack Food Delivery & Kitchen Operations Platform

> **A modern, end-to-end food delivery and restaurant dispatch ecosystem featuring a responsive customer ordering portal, real-time kitchen operations dashboard, and RESTful API services.**

---

## 📌 Project Overview

**Harvest & Home** is an end-to-end food delivery and restaurant management platform designed for speed, usability, and scale. The system bridges consumer meal discovery with commercial kitchen dispatch workflows through two dedicated web applications supported by a modular backend service.

- **Customer Storefront (`frontend/`)**: An intuitive, mobile-responsive consumer application designed for rapid meal discovery, dietary filtering, interactive cart management, and visual order lifecycle tracking.
- **Kitchen & Admin Dispatch Hub (`admin/`)**: An operations dashboard for restaurant managers and kitchen leads to process live order queues, monitor real-time revenue and performance KPIs, toggle live menu stock availability, and run automated order dispatch simulations.
- **API Engine (`backend/`)**: A lightweight, modular Python & Flask service providing RESTful endpoints for restaurant catalogs, menu schemas, and order processing.

---

## ✨ Key Features

### 🛍️ Customer Storefront (`http://localhost:5173`)
- **Restaurant & Menu Discovery**: Browse curated restaurants with cuisine tags, ratings, delivery times, and pricing tiers.
- **Dietary & Allergen Badges**: Visual indicators for Vegetarian, Vegan, Gluten-Free, and Chef's Specials.
- **Dynamic Cart Management**: Real-time cart calculations, item add/remove steppers, and customizable item notes.
- **Two-Step Checkout**: Frictionless delivery address configuration and payment selection.
- **Live Order Tracking Timeline**: Visual step-by-step order progression from `Placed` $\rightarrow$ `Accepted` $\rightarrow$ `Preparing` $\rightarrow$ `Out for Delivery` $\rightarrow$ `Delivered`.
- **Client-Side Auth Simulation**: Instant login/signup profiles with persistent session state.

### 🍳 Operations & Dispatch Dashboard (`http://localhost:5174`)
- **Role-Based Profiles**: 1-click credential switcher for Super Admin, Store Manager (*Spice Route*), and Kitchen Lead (*Bella Napoli*).
- **Live Performance Metrics**: Real-time KPI summary tracking daily revenue, pending kitchen approvals, active kitchen tickets, and in-transit deliveries.
- **Interactive Dispatch Pipeline**: Filter orders by status tabs and advance ticket stages with a single click. Includes full modal view for customer delivery instructions, itemized bill, and timestamped audit log.
- **Menu Engineering & Live Stock Controls**: Add, edit, or remove menu items with instant real-time toggling between **"In Stock"** and **"Sold Out"**.
- **Live Simulation Engine**: Built-in order generator with realistic random ticket arrival, custom Web Audio API synthesized alert chimes, and slide-in toast notifications.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Customer App** | React 18, TypeScript, Vite, React Router 6, Lucide Icons, Context API |
| **Admin Dashboard** | React 18, TypeScript, Vite, Lucide Icons, Web Audio API, Vanilla CSS |
| **Backend API** | Python 3, Flask 3, CSV-backed data layer (swappable to PostgreSQL/SQLAlchemy) |
| **Tooling & DX** | ESLint, TypeScript Compiler (`tsc`), Git |

---

## 📂 Project Structure

```text
food-delivery-app/
├── frontend/               # Customer Web Application
│   ├── src/
│   │   ├── components/     # Reusable UI components (RestaurantCard, CartLineRow, etc.)
│   │   ├── context/        # State providers (CartContext, AuthContext, OrdersContext)
│   │   ├── layout/         # App shell, sticky headers, bottom tab navigation
│   │   ├── mocks/          # Client-side mock APIs and static catalogs
│   │   └── pages/          # Storefront, Menu, Cart, Checkout, and Tracking pages
│   ├── package.json
│   └── vite.config.ts
│
├── admin/                  # Restaurant & Operations Dashboard
│   ├── src/
│   │   ├── components/     # Order cards, metrics widgets, modals, forms
│   │   ├── context/        # Admin auth and operational order state
│   │   ├── mocks/          # Admin mock data and ticket simulation engine
│   │   └── pages/          # Overview, Menu Management, Orders Hub, Settings
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                # Python & Flask REST API
│   ├── data/               # Seed data (restaurants.csv, menu_items.csv, orders.csv)
│   ├── app.py              # Flask server and route definitions
│   └── requirements.txt    # Python dependencies
│
├── .gitignore              # Monorepo git ignore rules
└── README.md               # Master project documentation
```

---

## 🚀 Quick Start

### 1. Customer Application
```bash
cd frontend
npm install
npm run dev
```
> Runs at **http://localhost:5173**

<img width="1917" height="917" alt="image" src="https://github.com/user-attachments/assets/4b887d8b-862e-4115-ad19-19c7ca68f1e9" />

<img width="1897" height="911" alt="image" src="https://github.com/user-attachments/assets/9a0d540a-7833-492a-9b8c-8f7eca5d1e7e" />


### 2. Admin Operations Dashboard
Open a second terminal window:
```bash
cd admin
npm install
npm run dev
```
> Runs at **http://localhost:5174**

<img width="1902" height="907" alt="image" src="https://github.com/user-attachments/assets/bef3e824-42d7-4e0f-838a-e312e8541530" />


### 3. Backend API (Optional / Standalone)
Open a third terminal window:
```bash
cd backend

pip install -r requirements.txt
python app.py
```
> Runs at **http://localhost:5000**

### Live URL,
- https://fooapp-chi.vercel.app/
- https://admin-center-food.vercel.app/

---

## 🗺️ Roadmap & Future Enhancements

- [ ] **AI-Powered Dish & Diet Concierge**: Natural language menu search and personalized meal recommendations based on user macros and cravings.
- [ ] **Smart Kitchen Load Balancing**: Dynamic preparation time estimation driven by real-time kitchen queue volume.
- [ ] **WebSocket Gateway**: Live bidirectional syncing between customer tracking and admin dispatch updates.
- [ ] **Secure Authentication**: Production-ready JWT authentication across all portals.
- [ ] **Payment Gateway Integration**: Stripe / Razorpay checkout support.
