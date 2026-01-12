import React from "react";

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
  const [flour, setFlour] = React.useState(initialValues.flour);
  const [hydration, setHydration] = React.useState(initialValues.hydration);
  const [salt, setSalt] = React.useState(initialValues.salt);
  const [sugar, setSugar] = React.useState(initialValues.sugar);
  const [fat, setFat] = React.useState(initialValues.fat);
  const [eggs, setEggs] = React.useState(initialValues.eggs);

  const handleSubmit = () => {
    onCalculate({
      flour,
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

      <div style={{ display: "grid", gap: "16px" }}>
        <label>
          Мука (г)
          <input
            type="number"
            value={flour}
            onChange={(e) => setFlour(Number(e.target.value))}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Гидратация (%)
          <input
            type="number"
            value={hydration}
            onChange={(e) => setHydration(Number(e.target.value))}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Соль (% от муки)
          <input
            type="number"
            value={salt}
            onChange={(e) => setSalt(Number(e.target.value))}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Сахар (% от муки)
          <input
            type="number"
            value={sugar}
          onChange={(e) => setSugar(Number(e.target.value))}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Жиры (% от муки)
          <input
            type="number"
            value={fat}
            onChange={(e) => setFat(Number(e.target.value))}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Яйца (шт)
          <input
            type="number"
            value={eggs}
            onChange={(e) => setEggs(Number(e.target.value))}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>
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
