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

  customRecipes: any[];
  onOpenCustomRecipe: (id: string) => void;
  onDeleteCustomRecipe: (id: string) => void;

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
  customRecipes,
  onOpenCustomRecipe,
  onDeleteCustomRecipe,
}) => {
  //
  // Стандартные профили
  //
  const profiles = [
    { id: "bread", label: "Хлеб", category: "bread" },
    { id: "baguette", label: "Багет", category: "bread" },
    { id: "pizza", label: "Пицца", category: "bread" },
    { id: "focaccia", label: "Фокачча", category: "bread" },
    { id: "ciabatta", label: "Чиабатта", category: "bread" },
    { id: "bagel", label: "Бейгл", category: "bread" },
    { id: "pita", label: "Пита", category: "bread" },

    { id: "cinnabon", label: "Синабон", category: "enriched" },
    { id: "enriched", label: "Сдоба", category: "enriched" },
    { id: "brioche", label: "Бриошь", category: "enriched" },
    { id: "donuts", label: "Донатс", category: "enriched" },
    { id: "ensaimada", label: "Энсаимада", category: "enriched" },

    { id: "baked_pirozhki", label: "Пирожки из печи", category: "filled" },
    { id: "belyashi", label: "Беляши", category: "filled" },
    { id: "chebureki", label: "Чебуреки", category: "filled" },
    { id: "empanada", label: "Эмпанада", category: "filled" },

    { id: "sourdough", label: "Хлеб на закваске", category: "sourdough" },

    { id: "choux", label: "Заварное тесто", category: "nodough" },
    { id: "shortcrust", label: "Песочное тесто", category: "nodough" },
    { id: "sponge", label: "Бисквит", category: "nodough" },
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
      {/* УСЛОВИЯ ПРОИЗВОДСТВА */}
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

      {/* СТАНДАРТНЫЕ ПРОФИЛИ */}
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
      </section>

      {/* МОИ РЕЦЕПТЫ */}
      {customRecipes.length > 0 && (
        <section style={{ marginTop: "40px" }}>
          <h2 style={{ fontSize: "22px", marginBottom: "16px" }}>
            Мои рецепты
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {customRecipes.map((r) => (
              <div
                key={r.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "10px 14px",
                  background: "#fff",
                  minWidth: "220px",
                  position: "relative",
                }}
              >
                <div
                  style={{ fontWeight: 500, cursor: "pointer" }}
                  onClick={() => onOpenCustomRecipe(r.id)}
                >
                  {r.name}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#777",
                    marginTop: "4px",
                  }}
                >
                  {new Date(r.timestamp).toLocaleString()}
                </div>

                <button
                  type="button"
                  title="Удалить"
                  onClick={() => onDeleteCustomRecipe(r.id)}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default StartScreen;
