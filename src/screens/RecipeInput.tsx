import React from "react";
import NumberInput from "../components/NumberInput";
import type { PrefermentType } from "../logic/preferment";
import { EGG_WEIGHTS } from "../logic/eggWeights";


import type {
  FlourType,
  LiquidType,
  FatType,
  EggType,
  SugarType,
  YeastForm,
} from "../logic/fermentationModel";

type RecipeInputProps = {
  profileId: string;
  profile: any;
  initialValues: any;
  onBack: () => void;
  onCalculate: (data: any) => void;
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

const FLOUR_TYPES: FlourType[] = [
  "normal",
  "strong",
  "integral",
  "rye",
  "buckwheat",
  "corn",
  "rice",
  "oat",
  "flax",
];

const LIQUID_TYPES: LiquidType[] = [
  "water",
  "milk",
  "kefir",
  "whey",
  "plant_milk",
];

const FAT_TYPES: FatType[] = ["butter", "oil", "ghee", "margarine"];

const EGG_TYPES: EggType[] = ["whole", "yolk", "white", "powder"];

const SUGAR_TYPES: SugarType[] = ["white", "brown", "panela"];

const YEAST_FORMS: YeastForm[] = ["instant", "fresh"];

const RecipeInput: React.FC<RecipeInputProps> = ({
  profileId,
  profile,
  initialValues,
  onBack,
  onCalculate,
}) => {
  // режим расчёта
  const [mode, setMode] = React.useState<"flour" | "dough">("flour");

  // === БАЗОВЫЕ ПОЛЯ ===
  const [flour, setFlour] = React.useState(initialValues.flour);
  const [targetDoughWeight, setTargetDoughWeight] = React.useState(0);

  const [salt, setSalt] = React.useState(initialValues.salt);
  const [sugar, setSugar] = React.useState(initialValues.sugar);
  const [fat, setFat] = React.useState(initialValues.fat);
  const [eggs, setEggs] = React.useState(initialValues.eggs);

  // 🔥 ДОБАВЛЕНО: ГИДРАТАЦИЯ
  const [hydration, setHydration] = React.useState(
    initialValues.hydration ?? profile.hydration ?? 60
  );

  // 🔥 ДОБАВЛЕНО: ДРОЖЖИ (%)
  const [yeastPct, setYeastPct] = React.useState(
    initialValues.yeastPct ?? profile.yeast?.percent ?? 1
  );

  // === НОВЫЕ ПАРАМЕТРЫ: МУКА ===
  const [mainFlour, setMainFlour] = React.useState<FlourType>("normal");

  const [extraFlour1, setExtraFlour1] = React.useState<FlourType>("normal");
  const [extraPct1, setExtraPct1] = React.useState(0);

  const [extraFlour2, setExtraFlour2] = React.useState<FlourType>("normal");
  const [extraPct2, setExtraPct2] = React.useState(0);

  // === НОВЫЕ ПАРАМЕТРЫ: ЖИДКОСТИ / ЖИРЫ / ЯЙЦА / САХАР / ДРОЖЖИ ===
  const [liquidType, setLiquidType] = React.useState<LiquidType>("water");
  const [fatType, setFatType] = React.useState<FatType>("butter");
  const [eggType, setEggType] = React.useState<EggType>("whole");
  const [sugarType, setSugarType] = React.useState<SugarType>("white");
  const [yeastForm, setYeastForm] = React.useState<YeastForm>("instant");

  // === ПРЕДФЕРМЕНТ ===
  const [prefermentType, setPrefermentType] = React.useState<PrefermentType>(
    initialValues.prefermentType || profile.preferment?.type || "none"
  );

  const [prefermentFlourPct, setPrefermentFlourPct] = React.useState(
    initialValues.prefermentFlourPct ??
      profile.preferment?.percentOfFlour ??
      0
  );

  const [prefermentHydrationPct, setPrefermentHydrationPct] = React.useState(
    initialValues.prefermentHydrationPct ??
      profile.preferment?.hydration ??
      100
  );

  const [prefermentYeastPct, setPrefermentYeastPct] = React.useState(
    initialValues.prefermentYeastPct ??
      profile.preferment?.yeastPercentInPreferment ??
      0
  );

  // === НОРМАЛИЗАЦИЯ ПРОЦЕНТОВ ДОП. МУКИ ===
  const normalizeExtraFlours = () => {
    const total = extraPct1 + extraPct2;
    if (total <= 100) return;

    const k = 100 / total;
    setExtraPct1(Math.round(extraPct1 * k));
    setExtraPct2(Math.round(extraPct2 * k));
  };

  React.useEffect(() => {
    normalizeExtraFlours();
  }, [extraPct1, extraPct2]);

  // === SUBMIT ===
  const handleSubmit = () => {
    let finalFlour = flour;

    if (mode === "dough" && targetDoughWeight > 0) {
      const water = (finalFlour * hydration) / 100;
      const saltGr = (finalFlour * salt) / 100;
      const sugarGr = (finalFlour * sugar) / 100;
      const fatGr = (finalFlour * fat) / 100;
      const eggsGr = eggs * EGG_WEIGHTS[eggType];
      const totalNow =
      finalFlour + water + saltGr + sugarGr + fatGr + eggsGr;


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
      yeastPct,

      mainFlour,
      extraFlour1,
      extraPct1,
      extraFlour2,
      extraPct2,

      liquidType,
      fatType,
      eggType,
      sugarType,
      yeastForm,

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
      {/* ГИДРАТАЦИЯ И ДРОЖЖИ */}
      {/* -------------------------------------------------- */}
      <Section title="Вода и дрожжи">
        <NumberInput
          label="Гидратация (%)"
          value={hydration}
          onChange={setHydration}
        />

        <NumberInput
          label="Дрожжи (% от муки)"
          value={yeastPct}
          onChange={setYeastPct}
        />
      </Section>

      {/* -------------------------------------------------- */}
      {/* МУКА */}
      {/* -------------------------------------------------- */}
      <Section title="Типы муки">
        <div style={{ display: "grid", gap: "16px" }}>
          <label>
            Основная мука:
            <select
              value={mainFlour}
              onChange={(e) => setMainFlour(e.target.value as FlourType)}
              style={{ marginLeft: "8px", padding: "6px" }}
            >
              {FLOUR_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label>
            Дополнительная мука 1:
            <select
              value={extraFlour1}
              onChange={(e) => setExtraFlour1(e.target.value as FlourType)}
              style={{ marginLeft: "8px", padding: "6px" }}
            >
              {FLOUR_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <NumberInput
            label="Процент доп. муки 1 (% от общей муки)"
            value={extraPct1}
            onChange={setExtraPct1}
          />

          <label>
            Дополнительная мука 2:
            <select
              value={extraFlour2}
              onChange={(e) => setExtraFlour2(e.target.value as FlourType)}
              style={{ marginLeft: "8px", padding: "6px" }}
            >
              {FLOUR_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <NumberInput
            label="Процент доп. муки 2 (% от общей муки)"
            value={extraPct2}
            onChange={setExtraPct2}
          />
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
      {/* ТИПЫ ИНГРЕДИЕНТОВ */}
      {/* -------------------------------------------------- */}
      <Section title="Типы ингредиентов">
        <div style={{ display: "grid", gap: "16px" }}>
          <label>
            Жидкость:
            <select
              value={liquidType}
              onChange={(e) => setLiquidType(e.target.value as LiquidType)}
              style={{ marginLeft: "8px", padding: "6px" }}
            >
              {LIQUID_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label>
            Жир:
            <select
              value={fatType}
              onChange={(e) => setFatType(e.target.value as FatType)}
              style={{ marginLeft: "8px", padding: "6px" }}
            >
              {FAT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label>
            Тип яйца:
            <select
              value={eggType}
              onChange={(e) => setEggType(e.target.value as EggType)}
              style={{ marginLeft: "8px", padding: "6px" }}
            >
              {EGG_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label>
            Тип сахара:
            <select
              value={sugarType}
              onChange={(e) => setSugarType(e.target.value as SugarType)}
              style={{ marginLeft: "8px", padding: "6px" }}
            >
              {SUGAR_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label>
            Тип дрожжей:
            <select
              value={yeastForm}
              onChange={(e) => setYeastForm(e.target.value as YeastForm)}
              style={{ marginLeft: "8px", padding: "6px" }}
            >
              {YEAST_FORMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
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
            onChange={(e) =>
              setPrefermentType(e.target.value as PrefermentType)
            }
            style={{ marginLeft: "8px", padding: "6px" }}
          >
            <option value="none">Без предфермента</option>
            <option value="poolish">Пулеш</option>
            <option value="biga">Бига</option>
            <option value="levain">Левен</option>
            <option value="yeasted_sponge">Спонж (дрожжевой)</option>
            <option value="enriched">Обогащённый предфермент</option>
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
