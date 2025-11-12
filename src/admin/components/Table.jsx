import React from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import "./Table.css";

export default function Table({ columns, data = [], onEdit, onDelete, onView }) {
  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.className || ""}>
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete || onView) && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center">
                No products found
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "even-row" : "odd-row"}>
                {columns.map((col) => (
<td key={col.key} className={col.className || ""}>
  {col.key === "images" && Array.isArray(row.images) && row.images.length > 0 ? (
    <img
      src={row.images[0].startsWith("http") ? row.images[0] : `http://localhost:5000${row.images[0]}`}
      alt="preview"
      style={{
        width: "60px",
        height: "60px",
        objectFit: "cover",
        borderRadius: "8px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    />
  ) : (
    col.render ? col.render(row) : row[col.key] || ""
  )}
</td>

                ))}
                {(onEdit || onDelete || onView) && (
                  <td className="action-buttons">
                    {onView && (
                      <button
                        onClick={() => onView(row)}
                        className="action-btn view-btn"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="action-btn edit-btn"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="action-btn delete-btn"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
