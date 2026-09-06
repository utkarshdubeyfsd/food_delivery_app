"""
Food Delivery App - Backend (MVP)
----------------------------------
Python + Flask. Uses CSV files as a temporary data store (no real DB yet) —
easy to swap for PostgreSQL later since all data access goes through the
small "store" functions below.
"""
import csv
import json
import os
import time
from pathlib import Path

from flask import Flask, jsonify, request

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
RESTAURANTS_CSV = DATA_DIR / "restaurants.csv"
MENU_CSV = DATA_DIR / "menu_items.csv"
ORDERS_CSV = DATA_DIR / "orders.csv"

app = Flask(__name__)


# ---------------------------------------------------------------------------
# Minimal CORS handling (flask-cors isn't installed; this is enough for MVP)
# ---------------------------------------------------------------------------
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response


@app.route("/api/<path:_any>", methods=["OPTIONS"])
def cors_preflight(_any):
    return "", 204


# ---------------------------------------------------------------------------
# Data access layer (CSV-backed). Swap these for real DB calls later without
# touching any route below.
# ---------------------------------------------------------------------------
def read_csv(path):
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def get_restaurants():
    rows = read_csv(RESTAURANTS_CSV)
    for r in rows:
        r["id"] = int(r["id"])
        r["rating"] = float(r["rating"])
        r["delivery_time_mins"] = int(r["delivery_time_mins"])
    return rows


def get_restaurant(restaurant_id):
    return next((r for r in get_restaurants() if r["id"] == restaurant_id), None)


def get_menu_for_restaurant(restaurant_id):
    rows = read_csv(MENU_CSV)
    items = [r for r in rows if int(r["restaurant_id"]) == restaurant_id]
    for i in items:
        i["id"] = int(i["id"])
        i["restaurant_id"] = int(i["restaurant_id"])
        i["price"] = float(i["price"])
    return items


def get_menu_item(item_id):
    rows = read_csv(MENU_CSV)
    for r in rows:
        if int(r["id"]) == item_id:
            r["id"] = int(r["id"])
            r["restaurant_id"] = int(r["restaurant_id"])
            r["price"] = float(r["price"])
            return r
    return None


def next_order_id():
    rows = read_csv(ORDERS_CSV)
    if not rows:
        return 1001
    return max(int(r["id"]) for r in rows) + 1


def save_order(order):
    file_exists = ORDERS_CSV.exists() and ORDERS_CSV.stat().st_size > 0
    with open(ORDERS_CSV, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "id", "customer_name", "address", "restaurant_id",
                "items_json", "total", "status", "created_at",
            ],
        )
        if not file_exists:
            writer.writeheader()
        writer.writerow(order)


def get_order(order_id):
    rows = read_csv(ORDERS_CSV)
    for r in rows:
        if int(r["id"]) == order_id:
            r["id"] = int(r["id"])
            r["restaurant_id"] = int(r["restaurant_id"])
            r["total"] = float(r["total"])
            r["items"] = json.loads(r.pop("items_json"))
            return r
    return None


def update_order_status(order_id, status):
    rows = read_csv(ORDERS_CSV)
    found = False
    for r in rows:
        if int(r["id"]) == order_id:
            r["status"] = status
            found = True
    if found:
        with open(ORDERS_CSV, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(
                f,
                fieldnames=[
                    "id", "customer_name", "address", "restaurant_id",
                    "items_json", "total", "status", "created_at",
                ],
            )
            writer.writeheader()
            writer.writerows(rows)
    return found


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/restaurants", methods=["GET"])
def list_restaurants():
    return jsonify(get_restaurants())


@app.route("/api/restaurants/<int:restaurant_id>", methods=["GET"])
def restaurant_detail(restaurant_id):
    restaurant = get_restaurant(restaurant_id)
    if not restaurant:
        return jsonify({"error": "Restaurant not found"}), 404
    return jsonify(restaurant)


@app.route("/api/restaurants/<int:restaurant_id>/menu", methods=["GET"])
def restaurant_menu(restaurant_id):
    restaurant = get_restaurant(restaurant_id)
    if not restaurant:
        return jsonify({"error": "Restaurant not found"}), 404
    return jsonify(get_menu_for_restaurant(restaurant_id))


@app.route("/api/orders", methods=["POST"])
def create_order():
    body = request.get_json(force=True, silent=True) or {}

    customer_name = (body.get("customer_name") or "").strip()
    address = (body.get("address") or "").strip()
    restaurant_id = body.get("restaurant_id")
    items = body.get("items")  # [{menu_item_id, quantity}]

    if not customer_name or not address or not restaurant_id or not items:
        return jsonify({
            "error": "customer_name, address, restaurant_id and items are required"
        }), 400

    restaurant = get_restaurant(int(restaurant_id))
    if not restaurant:
        return jsonify({"error": "Restaurant not found"}), 404

    order_items = []
    total = 0.0
    for entry in items:
        menu_item = get_menu_item(int(entry["menu_item_id"]))
        if not menu_item or menu_item["restaurant_id"] != int(restaurant_id):
            return jsonify({"error": f"Invalid menu item {entry.get('menu_item_id')}"}), 400
        qty = int(entry.get("quantity", 1))
        if qty < 1:
            return jsonify({"error": "quantity must be at least 1"}), 400
        line_total = menu_item["price"] * qty
        total += line_total
        order_items.append({
            "menu_item_id": menu_item["id"],
            "name": menu_item["name"],
            "price": menu_item["price"],
            "quantity": qty,
            "line_total": round(line_total, 2),
        })

    order_id = next_order_id()
    order_record = {
        "id": order_id,
        "customer_name": customer_name,
        "address": address,
        "restaurant_id": restaurant_id,
        "items_json": json.dumps(order_items),
        "total": round(total, 2),
        "status": "placed",
        "created_at": int(time.time()),
    }
    save_order(order_record)

    return jsonify({
        "id": order_id,
        "customer_name": customer_name,
        "address": address,
        "restaurant_id": int(restaurant_id),
        "restaurant_name": restaurant["name"],
        "items": order_items,
        "total": round(total, 2),
        "status": "placed",
    }), 201


@app.route("/api/orders/<int:order_id>", methods=["GET"])
def order_detail(order_id):
    order = get_order(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404
    return jsonify(order)


@app.route("/api/orders/<int:order_id>/status", methods=["POST"])
def order_status(order_id):
    body = request.get_json(force=True, silent=True) or {}
    status = body.get("status")
    valid_statuses = {"placed", "accepted", "preparing", "out_for_delivery", "delivered"}
    if status not in valid_statuses:
        return jsonify({"error": f"status must be one of {sorted(valid_statuses)}"}), 400
    if not update_order_status(order_id, status):
        return jsonify({"error": "Order not found"}), 404
    return jsonify({"id": order_id, "status": status})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
