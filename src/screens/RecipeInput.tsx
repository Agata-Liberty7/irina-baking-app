import React from "react";
import NumberInput from "../components/NumberInput";

type RecipeInputProps = {
  profileId: string;
  profile: any;
  initialValues: {
    flour: number;
    hydration: number; // временно оставляем, чтобы не ломать RecipeOutput
    salt: number;
    sugar: number;
    fat: number;
    eggs: number;
  };
  onBack: () => void;
  onCalculate: (data: {
    flour: number;
    hydration: number;
    salt: number;
    sugar: number;
    fat: number;
    eggs: number;
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
