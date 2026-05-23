import React from "react";

function StarRating({ rating = 0, onChange }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      {stars.map((s) => {
        const active = s <= rating;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange?.(s)}
            aria-label={`${s} star`}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
              fontSize: "28px",
              color: active ? "#F59E0B" : "#D1D5DB",
            }}
          >
            ★
          </button>
        );
      })}
      <span style={{ marginLeft: 6, fontWeight: 700, color: "#4B5563" }}>
        {rating}/5
      </span>
    </div>
  );
}

export default StarRating;

