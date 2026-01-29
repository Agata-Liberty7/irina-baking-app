import React from "react";

type Props = {
  name: string;
  recipe: any;
  profile: any;
  conditions: any;
  onBack: () => void;
};

const CustomRecipeView: React.FC<Props> = ({ name, recipe, profile, conditions, onBack }) => {
  if (!recipe) {
    return (
      <div style={{ padding: 24 }}>
        <h1>{name}</h1>
        <p>Ошибка: рецепт повреждён или пуст.</p>
        <button onClick={onBack}>← Назад</button>
      </div>
    );
  }

  const {
    preferment,
    finalDough,
    effectivePrefermentHours,
    fermentation,
    total,
  } = recipe;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <h1 style={{ marginBottom: "24px" }}>{name}</h1>

      {/* УСЛОВИЯ ПРОИЗВОДСТВА */}
      <section style={{ marginBottom: "32px" }}>
        <h2>Условия производства</h2>
        <div style={{ marginTop: "12px", display: "grid", gap: "6px" }}>
          <div>Климат: <strong>{conditions.climate}</strong></div>
          <div>Замес: <strong>{conditions.mixing}</strong></div>
          <div>Режим: <strong>{conditions.productionMode}</strong></div>
          <div>Температура помещения: <strong>{conditions.roomTemp}°C</strong></div>
          <div>Тёплая ферментация: <strong>{conditions.warmFermentationHours} ч</strong></div>
          <div>Холодная ферментация: <strong>{conditions.coldFermentationHours} ч</strong></div>
        </div>
      </section>

      {/* ПРЕДФЕРМЕНТ */}
      {preferment && preferment.flour > 0 && (
        <section style={{ marginBottom: "32px" }}>
          <h2>Предфермент ({preferment.type})</h2>
          <div style={{ marginTop: "12px", display: "grid", gap: "6px" }}>
            <div>Мука: <strong>{preferment.flour} г</strong></div>
            <div>Вода: <strong>{preferment.water} г</strong></div>
            <div>Дрожжи: <strong>{preferment.yeast} г</strong></div>
            <div>Гидратация: <strong>{preferment.hydration}%</strong></div>
            <div>Ферментация: <strong>{effectivePrefermentHours} ч</strong></div>
          </div>
        </section>
      )}

      {/* ОСНОВНОЕ ТЕСТО */}
      <section style={{ marginBottom: "32px" }}>
        <h2>Основное тесто</h2>
        <div style={{ marginTop: "12px", display: "grid", gap: "6px" }}>
          <div>Мука: <strong>{finalDough.flour} г</strong></div>
          <div>Вода: <strong>{finalDough.water} г</strong></div>
          {finalDough.milk && finalDough.milk > 0 && (
            <div>Молоко: <strong>{finalDough.milk} г</strong></div>
          )}
          <div>Соль: <strong>{finalDough.salt} г</strong></div>
          <div>Сахар: <strong>{finalDough.sugar} г</strong></div>
          <div>Жиры: <strong>{finalDough.fat} г</strong></div>
          <div>Яйца: <strong>{finalDough.eggs} шт</strong></div>
          <div>Дрожжи: <strong>{finalDough.yeast} г</strong></div>
          <div>Гидратация: <strong>{finalDough.hydration}%</strong></div>
        </div>
      </section>

      {/* ФЕРМЕНТАЦИЯ */}
      <section style={{ marginBottom: "32px" }}>
        <h2>Ферментация</h2>
        <div style={{ marginTop: "12px", display: "grid", gap: "6px" }}>
          <div>Общая ферментация: <strong>{fermentation.totalHours} ч</strong></div>
          <div>Тёплая: <strong>{fermentation.warmHours} ч</strong></div>
          <div>Холодная: <strong>{fermentation.coldHours} ч</strong></div>
        </div>
      </section>

      <h2>Итоговая масса: {total} г</h2>

      <div style={{ marginTop: "32px" }}>
        <button onClick={onBack}>← Назад</button>
      </div>
    </div>
  );
};

export default CustomRecipeView;
