import React from "react";

type RecipeOutputProps = {
  profileId: string;
  profile: any;
  data: any;

  onBack: () => void;
  onRestart: () => void;
  onShowTechCard: (recipe: any) => void;
  onSaveAsCustom: (calculatedRecipe: any) => void;
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section style={{ marginBottom: "32px" }}>
    <h2 style={{ marginBottom: "12px" }}>{title}</h2>
    {children}
  </section>
);

const Row: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const safe = (v: any) => (isNaN(v) || v === undefined ? 0 : v);

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
    flour,
    liquid,
    liquidType,
    
    salt,
    sugar,
    fat,
    eggs,
    eggsGr,
    yeast,
    hydration,

    mainFlour,
    extraFlour1,
    extraPct1,
    extraFlour2,
    extraPct2,

    fatType,
    eggType,
    sugarType,
    yeastForm,

    preferment,
    finalFlour,
    finalLiquid,
    finalYeast,

    finalDough,
    totalDough,
  } = data;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <button onClick={onBack} style={{ marginBottom: "16px" }}>
        ← Назад
      </button>

      <h1 style={{ marginBottom: "24px" }}>Итоговый рецепт</h1>

      <Section title="Состав муки">
        <Row label="Основная мука" value={mainFlour} />
        <Row label="Доп. мука 1" value={`${extraFlour1} (${extraPct1}%)`} />
        <Row label="Доп. мука 2" value={`${extraFlour2} (${extraPct2}%)`} />
      </Section>

      <Section title="Типы ингредиентов">
        <Row label="Жидкость" value={`${liquidType} — ${liquid} г`} />
        <Row label="Жир" value={fatType} />
        <Row label="Тип яйца" value={eggType} />
        <Row label="Тип сахара" value={sugarType} />
        <Row label="Тип дрожжей" value={yeastForm} />
      </Section>

      <Section title="Основные ингредиенты">
        <Row label="Мука (всего)" value={`${flour} г`} />
        <Row label="Жидкость (всего)" value={`${liquid} г`} />
        <Row label="Соль" value={`${salt} г`} />
        <Row label="Сахар" value={`${sugar} г`} />
        <Row label="Жиры" value={`${fat} г`} />
        <Row label="Яйца" value={`${eggsGr} г (${eggs} шт, ${eggType})`} />
        <Row label="Дрожжи (всего)" value={`${yeast} г`} />
        <Row label="Гидратация" value={`${hydration}%`} />
      </Section>

      <Section title="Предфермент">
        <Row label="Тип" value={preferment.type} />
        <Row label="Мука" value={`${preferment.flour} г`} />
        <Row label="Жидкость" value={`${preferment.liquid} г`} />
        <Row label="Дрожжи" value={`${preferment.yeast} г`} />
        <Row label="Всего" value={`${preferment.total} г`} />
      </Section>

      <Section title="Итоговое тесто">
        <Row label="Мука (в финальном тесте)" value={`${finalFlour} г`} />
        <Row label="Жидкость (в финальном тесте)" value={`${finalLiquid} г`} />
        <Row label="Дрожжи (в финальном тесте)" value={`${finalYeast} г`} />
        <Row label="Финальное тесто" value={`${finalDough} г`} />
        <Row label="Общая масса" value={`${totalDough} г`} />
      </Section>

      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <button onClick={() => onShowTechCard(data)}>Техкарта</button>
        <button onClick={() => onSaveAsCustom(data)}>Сохранить как рецепт</button>
        <button onClick={onRestart}>Начать заново</button>
      </div>
    </div>
  );
};


export default RecipeOutput;
