import React from "react";

type NumberInputProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
};

const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange }) => {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {label}
      <input
        type="number"
        value={value === 0 ? "" : value}
        onFocus={(e) => {
          if (e.target.value === "0") {
            e.target.value = "";
          }
        }}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === "" ? 0 : Number(val));
        }}
        style={{ width: "100%", padding: "8px" }}
      />
    </label>
  );
};

export default NumberInput;
