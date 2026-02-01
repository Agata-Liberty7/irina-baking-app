import React from "react";
import NumberInput from "../components/NumberInput";
import { type PrefermentType } from "../logic/preferment";

type RecipeInputProps = {
  profileId: string;
  profile: any;
  initialValues: {
    flour: number;
    hydration: number;
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
  onCalculate: (data: {
    flour: number;
    hydration: number;
    salt: number;
    sugar: number;
    fat: number;
    eggs: number;

    prefermentType: PrefermentType;
    prefermentFlourPct: number;
    prefermentHydrationPct: number;
    prefermentYeastPct: number;
  }) => void;
};

// Универсальная секция
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section style={{ marginBottom: "32px" }}>
    <h2 style={{ marginBottom: "12px" }}>{title}</h2>
    {children}
  </section>
);

const RecipeInput: React.FC<RecipeInputProps> = ({
  profileId,
  profile,
  initialValues,
  onBack,
  onCalculate,
}) => {
  // режим расчёта
  const [mode, setMode] = React.useState<"flour" | "dough">("flour");

  // поля
  const [flour, setFlour] = React.useState(initialValues.flour);
  const [targetDoughWeight, setTargetDoughWeight] = React.useState(0);

  const [salt, setSalt] = React.useState(initialValues.salt);
  const [sugar, setSugar] = React.useState(initialValues.sugar);
  const [fat, setFat] = React.useState(initialValues.fat);
  const [eggs, setEggs] = React.useState(initialValues.eggs);

  const [hydration] = React.useState(initialValues.hydration);

  // предфермент
  const [prefermentType, setPrefermentType] = React.useState(
    profile.preferment?.type ?? "none"
  );

  const [prefermentFlourPct, setPrefermentFlourPct] = React.useState(
    profile.preferment?.flourPct ?? 0
  );

  const [prefermentHydrationPct, setPrefermentHydrationPct] = React.useState(
    profile.preferment?.hydrationPct ?? 100
  );

  const [prefermentYeastPct, setPrefermentYeastPct] = React.useState(
    profile.preferment?.yeastPct ?? 100
  );

  // submit
  const handleSubmit = () => {
    let finalFlour = flour;

    if (mode === "dough" && targetDoughWeight > 0) {
      const water = (finalFlour * hydration) / 100;
      const saltGr = (finalFlour * salt) / 100;
      const sugarGr = (finalFlour * sugar) / 100;
      const fatGr = (finalFlour * fat) / 100;
      const eggsGr = eggs * 50;

      const totalNow = finalFlour + water + saltGr + sugarGr + fatGr + eggsGr;
      const ratio = targetDoughWeight / totalNow;

      finalFlour = Math.round(finalFlour * ratio);
    }

    onCalculate({
      flour: finalFlour,
      hydration,
      salt,
      sugar,
      fat,
      eggs,

      prefermentType,
      prefermentFlourPct,
      prefermentHydrationPct,
      prefermentYeastPct,
    });
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <button onClick={onBack} style={{ marginBottom: "16px" }}>
        ← Назад
      </button>

      <h1 style={{ marginBottom: "24px" }}>Параметры теста: {profileId}</h1>

      {/* -------------------------------------------------- */}
      {/* РЕЖИМ РАСЧЁТА */}
      {/* -------------------------------------------------- */}
      <Section title="Режим расчёта">
        <div style={{ display: "flex", gap: "24px" }}>
          <label>
            <input
              type="radio"
              checked={mode === "flour"}
              onChange={() => setMode("flour")}
            />{" "}
            По муке
          </label>

          <label>
            <input
              type="radio"
              checked={mode === "dough"}
              onChange={() => setMode("dough")}
            />{" "}
            По весу теста
          </label>
        </div>
      </Section>

      {/* -------------------------------------------------- */}
      {/* ОСНОВНЫЕ ИНГРЕДИЕНТЫ */}
      {/* -------------------------------------------------- */}
      <Section title="Основные ингредиенты">
        <div style={{ display: "grid", gap: "16px" }}>
          {mode === "flour" ? (
            <NumberInput label="Мука (г)" value={flour} onChange={setFlour} />
          ) : (
            <NumberInput
              label="Целевой вес теста (г)"
              value={targetDoughWeight}
              onChange={setTargetDoughWeight}
            />
          )}

          <NumberInput label="Соль (% от муки)" value={salt} onChange={setSalt} />
          <NumberInput label="Сахар (% от муки)" value={sugar} onChange={setSugar} />
          <NumberInput label="Жиры (% от муки)" value={fat} onChange={setFat} />
          <NumberInput label="Яйца (шт)" value={eggs} onChange={setEggs} />
        </div>
      </Section>

      {/* -------------------------------------------------- */}
      {/* ПРЕДФЕРМЕНТ */}
      {/* -------------------------------------------------- */}
      <Section title="Предфермент">
        <label style={{ display: "block", marginBottom: "12px" }}>
          Тип:
          <select
            value={prefermentType}
            onChange={(e) => setPrefermentType(e.target.value as PrefermentType)}
            style={{ marginLeft: "8px", padding: "6px" }}
          >
            <option value="none">Без предфермента</option>
            <option value="poolish">Пулеш</option>
            <option value="biga">Бига</option>
            <option value="sponge">Спонж</option>
            <option value="opara">Опара</option>
            <option value="tangzhong">Тангзонг</option>
            <option value="yudane">Юдане</option>
          </select>
        </label>

        {prefermentType !== "none" && (
          <div style={{ display: "grid", gap: "16px" }}>
            <NumberInput
              label="Мука в предферменте (% от общей муки)"
              value={prefermentFlourPct}
              onChange={setPrefermentFlourPct}
            />

            <NumberInput
              label="Гидратация предфермента (%)"
              value={prefermentHydrationPct}
              onChange={setPrefermentHydrationPct}
            />

            <NumberInput
              label="Дрожжи в предферменте (% от общей нормы)"
              value={prefermentYeastPct}
              onChange={setPrefermentYeastPct}
            />
          </div>
        )}
      </Section>

      {/* -------------------------------------------------- */}
      {/* КНОПКА */}
      {/* -------------------------------------------------- */}
      <button
        onClick={handleSubmit}
        style={{
          marginTop: "16px",
          padding: "12px 16px",
          borderRadius: "6px",
          border: "1px solid #000",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Рассчитать рецепт
      </button>
    </div>
  );
};

export default RecipeInput;
