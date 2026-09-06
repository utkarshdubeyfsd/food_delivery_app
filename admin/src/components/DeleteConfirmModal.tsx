import type { AdminMenuItem } from "../types";

interface DeleteConfirmModalProps {
  item: AdminMenuItem | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  item,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!item) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-card"
        style={{ maxWidth: 440 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">Delete Menu Item?</h3>
          <button
            type="button"
            className="modal-close"
            onClick={onCancel}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: "var(--ink-secondary)", fontSize: "0.92rem" }}>
            Are you sure you want to delete{" "}
            <strong style={{ color: "var(--ink-primary)" }}>{item.name}</strong>{" "}
            ({item.category})? This will immediately remove it from the menu catalog.
          </p>

          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: "var(--radius-md)",
              color: "#991b1b",
              fontSize: "0.82rem",
            }}
          >
            ⚠️ In-flight orders containing this item will still be fulfilled, but customers will no longer be able to order it.
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Keep Item
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            id="btn-confirm-delete"
          >
            Yes, Delete Item
          </button>
        </div>
      </div>
    </div>
  );
}
