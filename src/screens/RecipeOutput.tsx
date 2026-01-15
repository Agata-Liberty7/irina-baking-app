import React from "react";
import { calculateHydration } from "../logic/hydration";
import { calculateYeast } from "../logic/yeast";
import { useAppContext } from "../context/AppContext";

type RecipeOutputProps = {
  profileId: string;
  profile: any;
  data: {
    flour: number;
    salt: number;
    sugar: number;
    fat: number;
    eggs: number;
  };
  onBack: () => void;
  onRestart: () => void;
};

const RecipeOutput: React.FC<RecipeOutputProps> = ({
  profileId,
  profile,
  data,
  onBack,
  onRestart,
}) => {
  const { climate, mixing, productionMode, roomTemp } = useAppContext();

  // Вода
  const { water } = calculateHydration({
    flour: data.flour,
    salt: data.salt,
    sugar: data.sugar,
    fat: data.fat,
    eggs: data.eggs,
    profile,
    climate,
    mixing,
    productionMode,
    roomTemp,
  });

  // Дрожжи
  const { yeast } = calculateYeast({
    flour: data.flour,
    sugar: data.sugar,
    fat: data.fat,
    profile,
    climate,
    productionMode,
    roomTemp,
  });

  const saltGr = Math.round((data.flour * data.salt) / 100);
  const sugarGr = Math.round((data.flour * data.sugar) / 100);
  const fatGr = Math.round((data.flour * data.fat) / 100);
  const eggsGr = data.eggs * 50;

  const total =
    data.flour + water + saltGr + sugarGr + fatGr + eggsGr + yeast;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <h1 style={{ marginBottom: "24px" }}>
        Рецепт: {profileId}
      </h1>

      <div style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
        <div>Мука: <strong>{data.flour} г</strong></div>
        <div>Вода: <strong>{water} г</strong></div>
        <div>Соль: <strong>{saltGr} г</strong></div>
        <div>Сахар: <strong>{sugarGr} г</strong></div>
        <div>Жиры: <strong>{fatGr} г</strong></div>
        <div>Яйца: <strong>{data.eggs} шт</strong></div>
        <div>Дрожжи: <strong>{yeast} г</strong></div>
      </div>

      <h2>Итоговая масса: {total} г</h2>

      <div style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
        <button onClick={onBack}>← Назад</button>
        <button onClick={onRestart}>На стартовый экран</button>
      </div>
    </div>
  );
};

export default RecipeOutput;
