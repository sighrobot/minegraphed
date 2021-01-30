import React from "react";

const Seg = ({ type, onChange, statTypes }) => {
  return (
    <div className="seg">
      {statTypes
        .sort((a, b) => (a > b ? 1 : -1))
        .map((t) => {
          return (
            <button
              key={t}
              className={type === t ? "active" : ""}
              name={t}
              onClick={onChange}
            >
              {t.replace("_", " ")}
            </button>
          );
        })}
    </div>
  );
};

export default Seg;