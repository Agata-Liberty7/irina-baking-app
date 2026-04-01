import React, { useMemo, useState } from "react";
import NumberInput from "../components/NumberInput";

export type ProductionMode = "home" | "professional";
export type Climate = "dry" | "moderate" | "humid";
export type MixingMethod = "manual" | "planetary" | "spiral";

console.log("StartScreen МОНТИРУЕТСЯ");

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

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section style={{ marginBottom: "40px" }}>
    <h2 style={{ fontSize: "22px", marginBottom: "16px" }}>{title}</h2>
    {children}
  </section>
);

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

const CATEGORY_NAMES: Record<string, string> = {
  bread: "Хлеб",
  enriched: "Сдобное",
  fried_enriched: "Сдобное жареное",
  baked_filled: "Пирожки печёные",
  fried_filled: "Пирожки жареные",
  pastry: "Песочное",
  choux: "Заварное",
  cake: "Кексы и торты",
  other: "Другое",
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
  // -----------------------------
  // АВТОМАТИЧЕСКАЯ ЗАГРУЗКА ПРОФИЛЕЙ
  // -----------------------------
  const modules = import.meta.glob("../profiles/*.json", { eager: true });

  const indexData = useMemo(() => {
    const categories: Record<string, any> = {};
    const profileNamesById: Record<string, string> = {};

    for (const path in modules) {
      const mod = modules[path] as any;
      const profile = mod?.default ?? mod;

      // Удаляем служебные / неосновные профили без base
      if (!profile?.base) continue;

      const id = profile.id;
      const category = profile.category || "other";
      const subtype = profile.subtype || id;
      const name = profile.name || id;

      profileNamesById[id] = name;

      if (!categories[category]) {
        categories[category] = {
          name: CATEGORY_NAMES[category] || category,
          subtypes: {},
        };
      }

      categories[category].subtypes[subtype] = {
        name,
        profile: id,
      };
    }

    return { categories, profileNamesById };
  }, [modules]);

  const getProfileNameById = (profileId: string) => {
    return indexData.profileNamesById[profileId] ?? profileId;
  };

  // -----------------------------
  // SEARCH
  // -----------------------------
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const q = searchQuery.toLowerCase();
    const results: any[] = [];

    for (const [catKey, cat] of Object.entries(indexData.categories)) {
      for (const [subKey, sub] of Object.entries(
        (cat as any).subtypes as Record<string, { name: string; profile: string }>
      )) {
        if (sub.name.toLowerCase().includes(q)) {
          results.push({
            category: catKey,
            subtype: subKey,
            profile: sub.profile,
            name: sub.name,
          });
        }
      }
    }

    return results;
  }, [searchQuery, indexData]);

  // -----------------------------
  // FAVORITES
  // -----------------------------
  const [favorites, setFavorites] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  });

  const toggleFavorite = (profileId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId];

      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  // -----------------------------
  // RECENT
  // -----------------------------
  const [recent, setRecent] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem("recent") || "[]");
  });

  const addRecent = (profileId: string) => {
    setRecent((prev) => {
      const updated = [profileId, ...prev.filter((id) => id !== profileId)].slice(
        0,
        5
      );
      localStorage.setItem("recent", JSON.stringify(updated));
      return updated;
    });
  };

  // -----------------------------
  // CATEGORY NAVIGATION
  // -----------------------------
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(null);

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
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
              <option value="dry">Сухой</option>
              <option value="moderate">Умеренный</option>
              <option value="humid">Влажный</option>
            </select>
          </div>

          <div>
            <label>Способ замеса</label>
            <select
              value={mixing}
              onChange={(e) => onMixingChange(e.target.value as MixingMethod)}
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            >
              <option value="manual">Ручной</option>
              <option value="planetary">Планетарный</option>
              <option value="spiral">Спиральный</option>
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
                onClick={() => onProductionModeChange("professional")}
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border:
                    productionMode === "professional"
                      ? "2px solid #000"
                      : "1px solid #ccc",
                  background:
                    productionMode === "professional" ? "#f0f0f0" : "transparent",
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

      <Section title="Поиск профилей">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Введите название профиля..."
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "16px",
          }}
        />

        {searchQuery && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "12px",
            }}
          >
            {searchResults.map((item) => (
              <button
                key={item.profile}
                onClick={() => {
                  addRecent(item.profile);
                  onProfileSelect(item.profile);
                }}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  background: "#fff",
                  textAlign: "left",
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </Section>

      {!searchQuery && (
        <>
          {recent.length > 0 && (
            <Section title="Недавние профили">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "12px",
                }}
              >
                {recent.map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                      addRecent(id);
                      onProfileSelect(id);
                    }}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      background: "#fff",
                      textAlign: "left",
                    }}
                  >
                    {getProfileNameById(id)}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {favorites.length > 0 && (
            <Section title="Избранное">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "12px",
                }}
              >
                {favorites.map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                      addRecent(id);
                      onProfileSelect(id);
                    }}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      background: "#fff",
                      textAlign: "left",
                    }}
                  >
                    {getProfileNameById(id)}
                  </button>
                ))}
              </div>
            </Section>
          )}
        </>
      )}

      {!searchQuery && !selectedCategory && (
        <Section title="Категории теста">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "12px",
            }}
          >
            {Object.entries(indexData.categories).map(([key, value]: any) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  background: "#fff",
                  textAlign: "left",
                }}
              >
                {value.name}
              </button>
            ))}
          </div>
        </Section>
      )}

      {selectedCategory && !selectedSubtype && (
        <Section title={indexData.categories[selectedCategory].name}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "12px",
            }}
          >
            {Object.entries(
              indexData.categories[selectedCategory].subtypes
            ).map(([key, value]: any) => (
              <div key={key} style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setSelectedSubtype(key)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "#fff",
                    textAlign: "left",
                    flex: 1,
                  }}
                >
                  {value.name}
                </button>

                <button
                  onClick={() => toggleFavorite(value.profile)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "#fff",
                  }}
                >
                  {favorites.includes(value.profile) ? "★" : "☆"}
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setSelectedCategory(null)}
            style={{ marginTop: "16px" }}
          >
            Назад
          </button>
        </Section>
      )}

      {selectedCategory && selectedSubtype && (
        <Section
          title={
            indexData.categories[selectedCategory].subtypes[selectedSubtype].name
          }
        >
          {(() => {
            const profileId =
              indexData.categories[selectedCategory].subtypes[selectedSubtype]
                .profile;

            return (
              <>
                <button
                  onClick={() => {
                    addRecent(profileId);
                    onProfileSelect(profileId);
                  }}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #000",
                    background: "#fff",
                    marginBottom: "16px",
                  }}
                >
                  Открыть профиль
                </button>

                <button
                  onClick={() => toggleFavorite(profileId)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "#fff",
                    marginBottom: "16px",
                  }}
                >
                  {favorites.includes(profileId)
                    ? "★ Удалить из избранного"
                    : "☆ В избранное"}
                </button>

                <button
                  onClick={() => setSelectedSubtype(null)}
                  style={{ marginTop: "16px" }}
                >
                  Назад
                </button>
              </>
            );
          })()}
        </Section>
      )}

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