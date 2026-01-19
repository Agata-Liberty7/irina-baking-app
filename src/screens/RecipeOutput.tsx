import React from "react";
import { calculateHydration } from "../logic/hydration";
import { calculateYeast } from "../logic/yeast";
import { calculatePreferment } from "../logic/preferment";
import { useAppContext } from "../context/AppContext";
import { type PrefermentType } from "../logic/preferment";
import { calculateFermentation } from "../logic/fermentation";


type RecipeOutputProps = {
  profileId: string;
  profile: any;
  data: {
    flour: number;
    salt: number;
    sugar: number;
    fat: number;
    eggs: number;
    water?: number;
    milk?: number;

    // новое:
    prefermentType: PrefermentType;
    prefermentFlourPct: number;
    prefermentHydrationPct: number;
    prefermentYeastPct: number;

  };
  onBack: () => void;
  onRestart: () => void;
  onShowTechCard: (recipe: any) => void;
};

const RecipeOutput: React.FC<RecipeOutputProps> = ({
  profileId,
  profile,
  data,
  onBack,
  onRestart,
  onShowTechCard,
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
  // 1. ДРОЖЖИ (общая норма)
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
    water: data.water ? data.water * 1.0 : 0,
    milk: data.milk ? data.milk * 1.0 : 0,
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
  // 3. ГИДРАТАЦИЯ (только финальное тесто)
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
  // 4. ПРОЧИЕ ИНГРЕДИЕНТЫ (финальное тесто)
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
    preferment.flour +
    preferment.water +
    preferment.yeast;

  const total = totalFinal + totalPreferment;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <h1 style={{ marginBottom: "24px" }}>
        Рецепт: {profileId}
      </h1>

      {/* ----------------------------- */}
      {/* ПРЕДФЕРМЕНТ */}
      {/* ----------------------------- */}
      {data.prefermentType !== "none" && (
        <div style={{ marginBottom: "32px" }}>
          <h2>Предфермент ({data.prefermentType})</h2>

          <div style={{ display: "grid", gap: "8px", marginTop: "12px" }}>
            <div>Мука: <strong>{preferment.flour} г</strong></div>
            <div>Вода: <strong>{preferment.water} г</strong></div>
            <div>Дрожжи: <strong>{preferment.yeast} г</strong></div>
            <div>Гидратация: <strong>{preferment.hydration}%</strong></div>
          </div>
        </div>
      )}

      {/* ----------------------------- */}
      {/* ОСНОВНОЕ ТЕСТО */}
      {/* ----------------------------- */}
      <div style={{ marginBottom: "32px" }}>
        <h2>Основное тесто</h2>

        <div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
          <div>Мука: <strong>{finalDough.flour} г</strong></div>
          <div>Вода: <strong>{water} г</strong></div>
          {finalDough.milk > 0 && (
            <div>Молоко: <strong>{finalDough.milk} г</strong></div>
          )}
          <div>Соль: <strong>{saltGr} г</strong></div>
          <div>Сахар: <strong>{sugarGr} г</strong></div>
          <div>Жиры: <strong>{fatGr} г</strong></div>
          <div>Яйца: <strong>{finalDough.eggs} шт</strong></div>
          <div>Дрожжи: <strong>{finalDough.yeast} г</strong></div>
          <div>Гидратация: <strong>{hydration}%</strong></div>
        </div>
      </div>

      {/* ----------------------------- */}
      {/* ИТОГ */}
      {/* ----------------------------- */}
      <h2>Итоговая масса: {total} г</h2>

      <div style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
        <button onClick={onBack}>← Назад</button>
        <button onClick={onRestart}>На стартовый экран</button>
      <button
        onClick={() =>
          onShowTechCard({
            preferment,
            finalDough,
            effectivePrefermentHours,
            fermentation,
          })
        }
      >
        Технологическая карта
      </button>

      </div>
    </div>
  );
};

export default RecipeOutput;
