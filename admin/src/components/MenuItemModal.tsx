import { useState, useEffect, type FormEvent } from "react";
import type { AdminMenuItem, DietaryTag, Restaurant } from "../types";

interface MenuItemModalProps {
  isOpen: boolean;
  itemToEdit: AdminMenuItem | null;
  restaurants: Restaurant[];
  currentRestaurantId: string;
  categories: string[];
  onSave: (item: Omit<AdminMenuItem, "id">, id?: string) => void;
  onClose: () => void;
}

const AVAILABLE_TAGS: { id: DietaryTag; label: string }[] = [
  { id: "veg", label: "Vegetarian" },
  { id: "non-veg", label: "Non-Veg" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "spicy", label: "Spicy" },
  { id: "chef-special", label: "Chef Special" },
];

const POPULAR_EMOJIS = ["🍲", "🍕", "🍔", "🌮", "🍣", "🥗", "🥪", "🍰", "🥤", "☕", "🥟", "🫓", "🍢"];

export function MenuItemModal({
  isOpen,
  itemToEdit,
  restaurants,
  currentRestaurantId,
  categories,
  onSave,
  onClose,
}: MenuItemModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Main");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [restaurantId, setRestaurantId] = useState("r1");
  const [isAvailable, setIsAvailable] = useState(true);
  const [prepTime, setPrepTime] = useState("15");
  const [selectedTags, setSelectedTags] = useState<DietaryTag[]>([]);
  const [emoji, setEmoji] = useState("🍲");
  const [error, setError] = useState<string | null>(null);

  const cleanCategories = categories.filter((c) => c !== "All");

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setPrice(itemToEdit.price.toString());
      setCategory(itemToEdit.category);
      setDescription(itemToEdit.description);
      setRestaurantId(itemToEdit.restaurantId);
      setIsAvailable(itemToEdit.isAvailable);
      setPrepTime((itemToEdit.preparationTimeMins || 15).toString());
      setSelectedTags(itemToEdit.tags || []);
      setEmoji(itemToEdit.emoji || "🍲");
    } else {
      setName("");
      setPrice("");
      setCategory(cleanCategories[0] || "Main");
      setCustomCategory("");
      setDescription("");
      setRestaurantId(currentRestaurantId !== "all" ? currentRestaurantId : (restaurants[0]?.id || "r1"));
      setIsAvailable(true);
      setPrepTime("15");
      setSelectedTags(["veg"]);
      setEmoji("🍲");
    }
    setError(null);
  }, [itemToEdit, isOpen, currentRestaurantId, restaurants, cleanCategories]);

  if (!isOpen) return null;

  function handleTagToggle(tag: DietaryTag) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Item name is required.");
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError("Please provide a valid price greater than $0.00.");
      return;
    }
    if (!description.trim()) {
      setError("Item description is required.");
      return;
    }

    const finalCategory = category === "__custom__" ? customCategory.trim() : category;
    if (!finalCategory) {
      setError("Category is required.");
      return;
    }

    const payload: Omit<AdminMenuItem, "id"> = {
      restaurantId,
      name: name.trim(),
      price: Number(numPrice.toFixed(2)),
      category: finalCategory,
      description: description.trim(),
      isAvailable,
      preparationTimeMins: parseInt(prepTime, 10) || 15,
      tags: selectedTags,
      emoji,
    };

    onSave(payload, itemToEdit?.id);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {itemToEdit ? `Edit "${itemToEdit.name}"` : "Add New Menu Item"}
          </h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="login-error-banner">{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="item-restaurant">
                Restaurant Assignment
              </label>
              <select
                id="item-restaurant"
                className="form-select"
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                disabled={currentRestaurantId !== "all"}
              >
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.emoji} {r.name} ({r.cuisine})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="item-name">
                  Item Name *
                </label>
                <input
                  id="item-name"
                  className="form-input"
                  type="text"
                  placeholder="e.g. Truffle Mushroom Risotto"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="item-price">
                  Price ($ USD) *
                </label>
                <input
                  id="item-price"
                  className="form-input"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="12.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="item-category">
                  Category
                </label>
                <select
                  id="item-category"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {cleanCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="__custom__">+ Add Custom Category...</option>
                </select>
                {category === "__custom__" && (
                  <input
                    type="text"
                    className="form-input"
                    style={{ marginTop: 6 }}
                    placeholder="Type new category..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  />
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="item-prep">
                  Prep Time (Mins)
                </label>
                <input
                  id="item-prep"
                  className="form-input"
                  type="number"
                  min="1"
                  max="120"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="item-description">
                Description *
              </label>
              <textarea
                id="item-description"
                className="form-textarea"
                rows={3}
                placeholder="Describe flavors, primary ingredients, culinary presentation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Item Emoji Icon</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                {POPULAR_EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setEmoji(em)}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "var(--radius-sm)",
                      border: emoji === em ? "2px solid var(--primary)" : "1px solid var(--border-subtle)",
                      background: emoji === em ? "var(--primary-light)" : "#ffffff",
                      fontSize: 18,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Dietary Badges</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {AVAILABLE_TAGS.map((t) => {
                  const active = selectedTags.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleTagToggle(t.id)}
                      className={`tag-pill ${t.id}`}
                      style={{
                        cursor: "pointer",
                        opacity: active ? 1 : 0.45,
                        transform: active ? "scale(1.04)" : "scale(1)",
                        padding: "4px 10px",
                        fontSize: "0.78rem",
                      }}
                    >
                      {active ? "✓ " : "+ "}
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                backgroundColor: "var(--surface-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div>
                <span style={{ fontWeight: 600, fontSize: "0.88rem", display: "block" }}>
                  Available in Store (In Stock)
                </span>
                <span style={{ fontSize: "0.76rem", color: "var(--ink-muted)" }}>
                  Turn off to temporarily hide from customer menus as "Sold Out".
                </span>
              </div>
              <label className="switch-label">
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                />
                <span className="switch-slider" />
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" id="btn-save-menu-item">
              {itemToEdit ? "Save Changes" : "Create Menu Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
