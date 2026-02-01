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

// Универсальная секция
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section style={{ marginBottom: "40px" }}>
    <h2 style={{ fontSize: "22px", marginBottom: "16px" }}>{title}</h2>
    {children}
  </section>
);

// Карточка профиля
const ProfileCard: React.FC<{
  id: string;
  label: string;
  category: string;
  onSelect: (id: string) => void;
}> = ({ id, label, category, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(id)}
    style={{
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      cursor: "pointer",
      background: "#fff",
      minWidth: "160px",
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    }}
  >
    <span style={{ fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: "12px", color: "#777", textTransform: "uppercase" }}>
      {category}
    </span>
  </button>
);

// Карточка кастомного рецепта
const CustomRecipeCard: React.FC<{
  recipe: any;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ recipe, onOpen, onDelete }) => (
  <div
    style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "12px 16px",
      background: "#fff",
      minWidth: "240px",
      position: "relative",
    }}
  >
    <div
      style={{ fontWeight: 600, cursor: "pointer" }}
      onClick={() => onOpen(recipe.id)}
    >
      {recipe.name}
    </div>

    <div style={{ fontSize: "12px", color: "#777", marginTop: "4px" }}>
      {new Date(recipe.timestamp).toLocaleString()}
    </div>

    <button
      type="button"
      title="Удалить"
      onClick={() => onDelete(recipe.id)}
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
);

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
  const profiles = [
    { id: "bread", label: "Хлеб", category: "Хлеб" },
    { id: "baguette", label: "Багет", category: "Хлеб" },
    { id: "pizza", label: "Пицца", category: "Хлеб" },
    { id: "focaccia", label: "Фокачча", category: "Хлеб" },
    { id: "ciabatta", label: "Чиабатта", category: "Хлеб" },
    { id: "bagel", label: "Бейгл", category: "Хлеб" },
    { id: "pita", label: "Пита", category: "Хлеб" },

    { id: "cinnabon", label: "Синабон", category: "Сдоба" },
    { id: "enriched", label: "Сдоба (базовая)", category: "Сдоба" },
    { id: "brioche", label: "Бриошь", category: "Сдоба" },
    { id: "donuts", label: "Донатс", category: "Сдоба" },
    { id: "ensaimada", label: "Энсаимада", category: "Сдоба" },

    { id: "baked_pirozhki", label: "Пирожки из печи", category: "Начинённые" },
    { id: "belyashi", label: "Беляши", category: "Начинённые" },
    { id: "chebureki", label: "Чебуреки", category: "Начинённые" },
    { id: "empanada", label: "Эмпанада", category: "Начинённые" },

    { id: "sourdough", label: "Хлеб на закваске", category: "Закваска" },

    { id: "choux", label: "Заварное тесто", category: "Бездрожжевое" },
    { id: "shortcrust", label: "Песочное тесто", category: "Бездрожжевое" },
    { id: "sponge", label: "Бисквит", category: "Бездрожжевое" },
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
      {/* -------------------------------------------------- */}
      {/* УСЛОВИЯ ПРОИЗВОДСТВА */}
      {/* -------------------------------------------------- */}
      <Section title="Условия производства">
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
      </Section>

      {/* -------------------------------------------------- */}
      {/* СТАНДАРТНЫЕ ПРОФИЛИ */}
      {/* -------------------------------------------------- */}
      <Section title="Выберите тип теста">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
          }}
        >
          {profiles.map((p) => (
            <ProfileCard
              key={p.id}
              id={p.id}
              label={p.label}
              category={p.category}
              onSelect={onProfileSelect}
            />
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------- */}
      {/* МОИ РЕЦЕПТЫ */}
      {/* -------------------------------------------------- */}
      {customRecipes.length > 0 && (
        <Section title="Мои рецепты">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "12px",
            }}
          >
            {customRecipes.map((r) => (
              <CustomRecipeCard
                key={r.id}
                recipe={r}
                onOpen={onOpenCustomRecipe}
                onDelete={onDeleteCustomRecipe}
              />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default StartScreen;
