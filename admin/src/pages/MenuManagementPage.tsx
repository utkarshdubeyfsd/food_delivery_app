import { useState, useMemo } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useMenu } from "../context/MenuContext";
import { MenuItemModal } from "../components/MenuItemModal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import type { AdminMenuItem } from "../types";

export function MenuManagementPage() {
  const { restaurants, selectedRestaurantId, activeRestaurant } = useAdminAuth();
  const {
    items,
    categories,
    addItem,
    updateItem,
    deleteItem,
    toggleAvailability,
  } = useMenu();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<AdminMenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<AdminMenuItem | null>(null);

  // Filter items by store, category, and search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesStore =
        selectedRestaurantId === "all" || item.restaurantId === selectedRestaurantId;
      const matchesCategory =
        selectedCategory === "All" || item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStore && matchesCategory && matchesSearch;
    });
  }, [items, selectedRestaurantId, selectedCategory, searchQuery]);

  function handleOpenAdd() {
    setItemToEdit(null);
    setIsModalOpen(true);
  }

  function handleOpenEdit(item: AdminMenuItem) {
    setItemToEdit(item);
    setIsModalOpen(true);
  }

  function handleSave(itemData: Omit<AdminMenuItem, "id">, id?: string) {
    if (id) {
      updateItem({ ...itemData, id });
    } else {
      addItem(itemData);
    }
  }

  function handleConfirmDelete() {
    if (itemToDelete) {
      deleteItem(itemToDelete.id);
      setItemToDelete(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: 4 }}>
            Menu Management
            {activeRestaurant && ` — ${activeRestaurant.name}`}
          </h1>
          <p style={{ color: "var(--ink-muted)", fontSize: "0.92rem" }}>
            Add, update pricing, toggle real-time stock availability, and manage culinary offerings.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenAdd}
          id="btn-add-menu-item"
        >
          <span>＋</span>
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Toolbar: Search and Category Pills */}
      <div className="toolbar-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search items by name, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="menu-search-input"
          />
        </div>

        <div className="filter-pills-row">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Table */}
      <div className="menu-table-wrapper">
        <table className="menu-table">
          <thead>
            <tr>
              <th>Item</th>
              {selectedRestaurantId === "all" && <th>Restaurant</th>}
              <th>Category</th>
              <th>Price</th>
              <th>Dietary Tags</th>
              <th>Availability</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td
                  colSpan={selectedRestaurantId === "all" ? 7 : 6}
                  style={{ textAlign: "center", padding: "40px", color: "var(--ink-muted)" }}
                >
                  No menu items match the selected criteria. Try adjusting your filters or click "+ Add Menu Item".
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const restObj = restaurants.find((r) => r.id === item.restaurantId);

                return (
                  <tr key={item.id} id={`menu-item-row-${item.id}`}>
                    <td>
                      <div className="item-info-cell">
                        <div className="item-emoji">{item.emoji || "🍲"}</div>
                        <div className="item-details">
                          <span className="item-name">{item.name}</span>
                          <span className="item-desc" title={item.description}>
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {selectedRestaurantId === "all" && (
                      <td>
                        <span style={{ fontSize: "0.82rem", color: "var(--ink-secondary)" }}>
                          {restObj ? `${restObj.emoji} ${restObj.name}` : item.restaurantId}
                        </span>
                      </td>
                    )}

                    <td>
                      <span
                        style={{
                          backgroundColor: "var(--surface-subtle)",
                          padding: "3px 8px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                        }}
                      >
                        {item.category}
                      </span>
                    </td>

                    <td>
                      <span className="item-price">${item.price.toFixed(2)}</span>
                    </td>

                    <td>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {item.tags && item.tags.length > 0 ? (
                          item.tags.map((tag) => (
                            <span key={tag} className={`tag-pill ${tag}`}>
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: "0.76rem", color: "var(--ink-faint)" }}>—</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <label className="switch-label">
                          <input
                            type="checkbox"
                            className="switch-input"
                            checked={item.isAvailable}
                            onChange={() => toggleAvailability(item.id)}
                            id={`toggle-stock-${item.id}`}
                          />
                          <span className="switch-slider" />
                        </label>
                        <span
                          className={`stock-badge ${item.isAvailable ? "in-stock" : "out-of-stock"}`}
                        >
                          {item.isAvailable ? "In Stock" : "Sold Out"}
                        </span>
                      </div>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Item Details"
                          id={`btn-edit-${item.id}`}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setItemToDelete(item)}
                          title="Delete Item"
                          id={`btn-delete-${item.id}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      <MenuItemModal
        isOpen={isModalOpen}
        itemToEdit={itemToEdit}
        restaurants={restaurants}
        currentRestaurantId={selectedRestaurantId}
        categories={categories}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        item={itemToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
