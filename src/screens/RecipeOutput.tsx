import React from "react";
import { calculateHydration } from "../logic/hydration";
import { calculateYeast } from "../logic/yeast";
import { calculatePreferment } from "../logic/preferment";
import { calculateFermentation } from "../logic/fermentation";
import { useAppContext } from "../context/AppContext";
import { type PrefermentType } from "../logic/preferment";

type RecipeOutputProps = {
  profileId: string;
  profile: any;
  data: {
    flour: number;
    salt: number;
    sugar: number;
    fat: number;
    eggs: number;

    prefermentType: PrefermentType;
    prefermentFlourPct: number;
    prefermentHydrationPct: number;
    prefermentYeastPct: number;
  };
  onBack: () => void;
  onRestart: () => void;
  onShowTechCard: (recipe: any) => void;
  onSaveAsCustom: (recipe: any) => void;
};

// -----------------------------
// Универсальная таблица
// -----------------------------
const Table: React.FC<{ rows: { label: string; value: any }[] }> = ({ rows }) => (
  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
    <tbody>
      {rows
        .filter((r) => r.value !== null && r.value !== undefined && r.value !== 0)
        .map((row, i) => (
          <tr key={i}>
            <td style={{ padding: "4px 0", width: "60%" }}>{row.label}</td>
            <td style={{ padding: "4px 0", fontWeight: 600 }}>{row.value}</td>
          </tr>
        ))}
    </tbody>
  </table>
);

// -----------------------------
// Универсальный блок
// -----------------------------
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section style={{ marginBottom: "32px" }}>
    <h2 style={{ marginBottom: "12px" }}>{title}</h2>
    {children}
  </section>
);

const RecipeOutput: React.FC<RecipeOutputProps> = ({
  profileId,
  profile,
  data,
  onBack,
  onRestart,
  onShowTechCard,
  onSaveAsCustom,
}) => {
  const {
    climate,
    mixing,
    productionMode,
    roomTemp,
    warmFermentationHours,
    coldFermentationHours,
  } = useAppContext();

  // -----------------------------
  // 1. ДРОЖЖИ
  // -----------------------------
  const { yeast: totalYeast } = calculateYeast({
    flour: data.flour,
    sugar: data.sugar,
    fat: data.fat,
    profile,
    climate,
    productionMode,
    roomTemp,
    warmFermentationHours,
    coldFermentationHours,
  });

  // -----------------------------
  // 2. ПРЕДФЕРМЕНТ
  // -----------------------------
  const pref = calculatePreferment({
    flour: data.flour,
    water: 0, // вода всегда пересчитывается позже
    milk: profile.base.milk || 0,
    eggs: data.eggs,

    salt: data.salt,
    sugar: data.sugar,
    fat: data.fat,

    prefermentType: data.prefermentType,
    prefermentFlourPct: data.prefermentFlourPct,
    prefermentHydrationPct: data.prefermentHydrationPct,
    prefermentYeastPct: data.prefermentYeastPct,

    totalYeast,
    warmFermentationHours,
    coldFermentationHours,
    profile,
  });

  const { preferment, finalDough, effectivePrefermentHours } = pref;

  // -----------------------------
  // 3. ФЕРМЕНТАЦИЯ
  // -----------------------------
  const fermentation = calculateFermentation({
    flour: data.flour,
    totalYeast,
    sugarPct: data.sugar,
    fatPct: data.fat,
    roomTemp,
    warmFermentationHours,
    coldFermentationHours,
    prefermentType: data.prefermentType,
    prefermentFlourPct: data.prefermentFlourPct,
  });

  // -----------------------------
  // 4. ГИДРАТАЦИЯ
  // -----------------------------
  const { water, hydration } = calculateHydration({
    flour: finalDough.flour,
    salt: data.salt,
    sugar: data.sugar,
    fat: data.fat,
    eggs: finalDough.eggs,
    water: finalDough.water,
    milk: finalDough.milk,
    profile,
    climate,
    mixing,
    productionMode,
    roomTemp,
    warmFermentationHours,
    coldFermentationHours,
  });

  // -----------------------------
  // 5. ИТОГОВЫЕ МАССЫ
  // -----------------------------
  const saltGr = Math.round((finalDough.flour * data.salt) / 100);
  const sugarGr = Math.round((finalDough.flour * data.sugar) / 100);
  const fatGr = Math.round((finalDough.flour * data.fat) / 100);
  const eggsGr = finalDough.eggs * 50;

  const totalFinal =
    finalDough.flour +
    water +
    saltGr +
    sugarGr +
    fatGr +
    eggsGr +
    finalDough.yeast;

  const totalPreferment =
    preferment.flour + preferment.water + preferment.yeast;

  const total = totalFinal + totalPreferment;

  // -----------------------------
  // 6. ГОТОВЫЙ ОБЪЕКТ ДЛЯ СОХРАНЕНИЯ
  // -----------------------------
  const calculatedRecipe = {
    preferment,
    finalDough,
    effectivePrefermentHours,
    fermentation,
    total,
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <h1 style={{ marginBottom: "24px" }}>Рецепт: {profileId}</h1>

      {/* -------------------------------------------------- */}
      {/* ПРЕДФЕРМЕНТ (ТОЛЬКО ЕСЛИ ПРОФИЛЬ ЕГО ИСПОЛЬЗУЕТ) */}
      {/* -------------------------------------------------- */}
      {profile.preferment.enabled && data.prefermentType !== "none" && (
        <Section title={`Предфермент (${data.prefermentType})`}>
          <Table
            rows={[
              { label: "Мука", value: `${preferment.flour} г` },
              { label: "Вода", value: `${preferment.water} г` },
              { label: "Дрожжи", value: `${preferment.yeast} г` },
              { label: "Гидратация", value: `${preferment.hydration}%` },
              {
                label: "Эквивалентное время ферментации",
                value: `${effectivePrefermentHours.toFixed(1)} ч`,
              },
            ]}
          />
        </Section>
      )}

      {/* -------------------------------------------------- */}
      {/* ОСНОВНОЕ ТЕСТО */}
      {/* -------------------------------------------------- */}
      <Section title="Основное тесто">
        <Table
          rows={[
            { label: "Мука", value: `${finalDough.flour} г` },
            { label: "Вода", value: `${water} г` },
            { label: "Молоко", value: finalDough.milk ? `${finalDough.milk} г` : null },
            { label: "Соль", value: `${saltGr} г` },
            { label: "Сахар", value: `${sugarGr} г` },
            { label: "Жиры", value: `${fatGr} г` },
            { label: "Яйца", value: `${finalDough.eggs} шт` },
            { label: "Дрожжи", value: `${finalDough.yeast} г` },
            { label: "Гидратация", value: `${hydration}%` },
          ]}
        />
      </Section>

      {/* -------------------------------------------------- */}
      {/* ИТОГ */}
      {/* -------------------------------------------------- */}
      <Section title="Итоговая масса">
        <Table
          rows={[
            { label: "Предфермент", value: `${totalPreferment} г` },
            { label: "Финальное тесто", value: `${totalFinal} г` },
            { label: "Общая масса", value: `${total} г` },
          ]}
        />
      </Section>

      {/* -------------------------------------------------- */}
      {/* КНОПКИ */}
      {/* -------------------------------------------------- */}
      <div style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
        <button onClick={onBack}>← Назад</button>
        <button onClick={onRestart}>На стартовый экран</button>

        <button onClick={() => onSaveAsCustom(calculatedRecipe)}>
          Сохранить в Мои рецепты
        </button>

        <button onClick={() => onShowTechCard(calculatedRecipe)}>
          Технологическая карта
        </button>
      </div>
    </div>
  );
};

export default RecipeOutput;
