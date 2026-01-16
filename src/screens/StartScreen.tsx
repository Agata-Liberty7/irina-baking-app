import React from "react";
import NumberInput from "../components/NumberInput";

export type ProductionMode = "home" | "pro";
export type Climate = "dry" | "moderate" | "humid";
export type MixingMethod = "manual" | "planetary" | "spiral";

type StartScreenProps = {
  climate: Climate;
  mixing: MixingMethod;
  productionMode: ProductionMode;
  roomTemp: number;

  warmFermentationHours: number;
  coldFermentationHours: number;

  onClimateChange: (value: Climate) => void;
  onMixingChange: (value: MixingMethod) => void;
  onProductionModeChange: (value: ProductionMode) => void;
  onRoomTempChange: (value: number) => void;

  onWarmFermentationChange: (value: number) => void;
  onColdFermentationChange: (value: number) => void;

  onProfileSelect: (profileId: string) => void;
  onCustomDough: () => void;
};

const StartScreen: React.FC<StartScreenProps> = ({
  climate,
  mixing,
  productionMode,
  roomTemp,
  warmFermentationHours,
  coldFermentationHours,
  onClimateChange,
  onMixingChange,
  onProductionModeChange,
  onRoomTempChange,
  onWarmFermentationChange,
  onColdFermentationChange,
  onProfileSelect,
  onCustomDough,
}) => {
  const profiles = [
    { id: "bread", label: "Хлеб", category: "bread" },
    { id: "baguette", label: "Багет", category: "bread" },
    { id: "pizza", label: "Пицца", category: "bread" },
    { id: "focaccia", label: "Фокачча", category: "bread" },
    { id: "ciabatta", label: "Чиабатта", category: "bread" },
    { id: "bagel", label: "Бейгл", category: "bread" },
    { id: "pita", label: "Пита", category: "bread" },

    { id: "cinnabon", label: "Cinnabon", category: "enriched" },
    { id: "enriched", label: "Сдоба", category: "enriched" },
    { id: "brioche", label: "Бриошь", category: "enriched" },
    { id: "donuts", label: "Донатс", category: "enriched" },
    { id: "ensaimada", label: "Энсаимада", category: "enriched" },

    { id: "baked_pirozhki", label: "Пирожки из печи", category: "filled" },
    { id: "belyashi", label: "Беляши", category: "filled" },
    { id: "chebureki", label: "Чебуреки", category: "filled" },
    { id: "empanada", label: "Эмпанада", category: "filled" },

    { id: "sourdough", label: "Закваска", category: "sourdough" },

    { id: "choux", label: "Choux", category: "nodough" },
    { id: "shortcrust", label: "Shortcrust", category: "nodough" },
    { id: "sponge", label: "Sponge", category: "nodough" },
  ];

  const climates = [
    { value: "dry", label: "Сухой" },
    { value: "moderate", label: "Умеренный" },
    { value: "humid", label: "Влажный" },
  ];

  const mixings = [
    { value: "manual", label: "Ручной" },
    { value: "planetary", label: "Планетарный" },
    { value: "spiral", label: "Спиральный" },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <section style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
          Условия производства
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <NumberInput
            label="Температура помещения (°C)"
            value={roomTemp}
            onChange={onRoomTempChange}
          />

          <NumberInput
            label="Тёплая ферментация (часы)"
            value={warmFermentationHours}
            onChange={onWarmFermentationChange}
          />

          <NumberInput
            label="Холодная ферментация (часы)"
            value={coldFermentationHours}
            onChange={onColdFermentationChange}
          />

          <div>
            <label>Климат</label>
            <select
              value={climate}
              onChange={(e) => onClimateChange(e.target.value as Climate)}
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            >
              {climates.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Способ замеса</label>
            <select
              value={mixing}
              onChange={(e) => onMixingChange(e.target.value as MixingMethod)}
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            >
              {mixings.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Режим технологии</label>
            <div style={{ marginTop: "4px", display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => onProductionModeChange("home")}
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border:
                    productionMode === "home"
                      ? "2px solid #000"
                      : "1px solid #ccc",
                  background:
                    productionMode === "home" ? "#f0f0f0" : "transparent",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Домашний
              </button>

              <button
                type="button"
                onClick={() => onProductionModeChange("pro")}
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border:
                    productionMode === "pro"
                      ? "2px solid #000"
                      : "1px solid #ccc",
                  background:
                    productionMode === "pro" ? "#f0f0f0" : "transparent",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Производственный
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "22px", marginBottom: "16px" }}>
          Выберите тип теста
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => onProfileSelect(profile.id)}
              style={{
                padding: "10px 14px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                cursor: "pointer",
                background: "#fff",
                minWidth: "140px",
                textAlign: "left",
              }}
            >
              <div style={{ fontWeight: 500 }}>{profile.label}</div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#777",
                  marginTop: "2px",
                  textTransform: "uppercase",
                }}
              >
                {profile.category}
              </div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: "24px" }}>
          <button
            type="button"
            onClick={onCustomDough}
            style={{
              padding: "10px 16px",
              borderRadius: "6px",
              border: "1px dashed #666",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            ➕ Создать своё тесто
          </button>
        </div>
      </section>
    </div>
  );
};

export default StartScreen;
