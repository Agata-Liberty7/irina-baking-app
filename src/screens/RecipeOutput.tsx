import React from "react";

type RecipeOutputProps = {
  profileId: string;
  data: {
    flour: number;
    hydration: number;
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
  data,
  onBack,
  onRestart,
}) => {
  const water = Math.round((data.flour * data.hydration) / 100);
  const salt = Math.round((data.flour * data.salt) / 100);
  const sugar = Math.round((data.flour * data.sugar) / 100);
  const fat = Math.round((data.flour * data.fat) / 100);

  const total =
    data.flour + water + salt + sugar + fat + data.eggs * 50; // условно 1 яйцо = 50 г

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <h1 style={{ marginBottom: "24px" }}>
        Рецепт: {profileId}
      </h1>

      <div style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
        <div>Мука: <strong>{data.flour} г</strong></div>
        <div>Вода: <strong>{water} г</strong></div>
        <div>Соль: <strong>{salt} г</strong></div>
        <div>Сахар: <strong>{sugar} г</strong></div>
        <div>Жиры: <strong>{fat} г</strong></div>
        <div>Яйца: <strong>{data.eggs} шт</strong></div>
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
