import React from "react";

type NumberInputProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
};

const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange }) => {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <span style={{ fontSize: "14px", fontWeight: 500 }}>{label}</span>

      <input
        type="number"
        value={value === 0 ? "" : value}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw === "" ? 0 : Number(raw));
        }}
        style={{
          width: "100%",
          padding: "8px 10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "14px",
        }}
      />
    </label>
  );
};

export default NumberInput;
