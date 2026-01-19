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

    // новое:
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

    // новое:
    prefermentType: PrefermentType;
    prefermentFlourPct: number;
    prefermentHydrationPct: number;
    prefermentYeastPct: number;
  }) => void;
};


const RecipeInput: React.FC<RecipeInputProps> = ({
  profileId,
  profile,
  initialValues,
  onBack,
  onCalculate,
}) => {
  // режим расчёта: по муке / по весу теста
  const [mode, setMode] = React.useState<"flour" | "dough">("flour");

  // поля
  const [flour, setFlour] = React.useState(initialValues.flour);
  const [targetDoughWeight, setTargetDoughWeight] = React.useState(0);

  const [salt, setSalt] = React.useState(initialValues.salt);
  const [sugar, setSugar] = React.useState(initialValues.sugar);
  const [fat, setFat] = React.useState(initialValues.fat);
  const [eggs, setEggs] = React.useState(initialValues.eggs);

  // hydration пока берём из initialValues, чтобы RecipeOutput не ломался
  const [hydration] = React.useState(initialValues.hydration);

  // -----------------------------
  // ПРЕДФЕРМЕНТ (новые поля)
  // -----------------------------
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

  // -----------------------------
  // SUBMIT
  // -----------------------------
  const handleSubmit = () => {
    let finalFlour = flour;

    if (mode === "dough" && targetDoughWeight > 0) {
      // временная логика, пока не подключим матмодель
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

      // новое:
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

      <h1 style={{ marginBottom: "24px" }}>
        Параметры теста: {profileId}
      </h1>

      {/* Режим расчёта */}
      <div style={{ marginBottom: "24px" }}>
        <label style={{ marginRight: "16px" }}>
          <input
            type="radio"
            checked={mode === "flour"}
            onChange={() => setMode("flour")}
          />
          {" "}По муке
        </label>

        <label>
          <input
            type="radio"
            checked={mode === "dough"}
            onChange={() => setMode("dough")}
          />
          {" "}По весу теста
        </label>
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        {/* Мука или целевой вес */}
        {mode === "flour" ? (
          <NumberInput
            label="Мука (г)"
            value={flour}
            onChange={setFlour}
          />
        ) : (
          <NumberInput
            label="Целевой вес теста (г)"
            value={targetDoughWeight}
            onChange={setTargetDoughWeight}
          />
        )}

        {/* Проценты */}
        <NumberInput
          label="Соль (% от муки)"
          value={salt}
          onChange={setSalt}
        />

        <NumberInput
          label="Сахар (% от муки)"
          value={sugar}
          onChange={setSugar}
        />

        <NumberInput
          label="Жиры (% от муки)"
          value={fat}
          onChange={setFat}
        />

        <NumberInput
          label="Яйца (шт)"
          value={eggs}
          onChange={setEggs}
        />

        {/* -------------------------------- */}
        {/* ПРЕДФЕРМЕНТ — НОВЫЙ БЛОК         */}
        {/* -------------------------------- */}
        <div style={{ marginTop: "24px" }}>
          <h2 style={{ marginBottom: "12px" }}>Предфермент</h2>

          {/* Тип предфермента */}
          <label style={{ display: "block", marginBottom: "8px" }}>
            Тип:
            <select
              value={prefermentType}
              onChange={(e) => setPrefermentType(e.target.value)}
              style={{ marginLeft: "8px" }}
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

          {/* Параметры предфермента */}
          {prefermentType !== "none" && (
            <div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
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
        </div>
      </div>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "24px",
          padding: "12px 16px",
          borderRadius: "6px",
          border: "1px solid #000",
          cursor: "pointer",
        }}
      >
        Рассчитать рецепт
      </button>
    </div>
  );
};

export default RecipeInput;
