// ===============================
//   FERMENTATION + HYDRATION MODEL
//   (умная, но не заумная версия C)
// ===============================

export type YeastForm = "instant" | "fresh";

export type FlourType =
  | "normal"
  | "strong"
  | "integral"
  | "rye"
  | "buckwheat"
  | "corn"
  | "rice"
  | "oat"
  | "flax";

export type LiquidType =
  | "water"
  | "milk"
  | "kefir"
  | "whey"
  | "plant_milk";

export type FatType =
  | "butter"
  | "oil"
  | "ghee"
  | "margarine";

export type EggType =
  | "whole"
  | "yolk"
  | "white"
  | "powder";

export type SugarType =
  | "white"
  | "brown"
  | "panela";

export type DoughType = "lean" | "enriched";

export type YeastModelInput = {
  coldHours: number;
  warmHours: number;
  doughType: DoughType;
  yeastForm: YeastForm;

  // мука
  mainFlour: FlourType;
  extraFlour1: FlourType;
  extraPct1: number;
  extraFlour2: FlourType;
  extraPct2: number;

  productionMode: "home" | "professional";
};

export type HydrationModelInput = {
  baseHydration: number;

  mainFlour: FlourType;
  extraFlour1: FlourType;
  extraPct1: number;
  extraFlour2: FlourType;
  extraPct2: number;

  liquidType: LiquidType;
  fatType: FatType;
  sugarType: SugarType;
  eggType: EggType;
};

// ===============================
//   1. Таблицы влияния муки
// ===============================

// Автоматический W по типу муки
const W_BY_FLOUR: Record<FlourType, number> = {
  normal: 220,
  strong: 300,
  integral: 240,
  rye: 120,
  buckwheat: 80,
  corn: 60,
  rice: 40,
  oat: 70,
  flax: 30,
};

// Влияние муки на ферментацию (простая модель)
const FLOUR_FERMENTATION_FACTOR: Record<FlourType, number> = {
  normal: 0,
  strong: -0.05,
  integral: -0.05,
  rye: +0.10,
  buckwheat: -0.10,
  corn: -0.05,
  rice: -0.05,
  oat: -0.15,
  flax: -0.20,
};

// Влияние муки на гидратацию
const FLOUR_HYDRATION_DELTA: Record<FlourType, number> = {
  normal: 0,
  strong: 2,
  integral: 3,
  rye: 5,
  buckwheat: 4,
  corn: 3,
  rice: 2,
  oat: 6,
  flax: 8,
};

// ===============================
//   2. Таблицы влияния жидкостей
// ===============================

const LIQUID_WATER_EQUIVALENT: Record<LiquidType, number> = {
  water: 1.0,
  milk: 0.88,
  kefir: 0.85,
  whey: 0.90,
  plant_milk: 0.92,
};

// ===============================
//   3. Таблицы влияния сахара
// ===============================

const SUGAR_WATER_DELTA: Record<SugarType, number> = {
  white: 0,
  brown: 0.02,
  panela: 0.05,
};

// ===============================
//   4. Таблицы влияния жира
// ===============================

const FAT_WATER_DELTA: Record<FatType, number> = {
  butter: -0.02,
  oil: -0.03,
  ghee: -0.03,
  margarine: -0.02,
};

// ===============================
//   5. Таблицы влияния яиц
// ===============================

const EGG_WATER_EQUIVALENT: Record<EggType, number> = {
  whole: 0.76,
  yolk: 0.48,
  white: 0.88,
  powder: 0.0,
};

// ===============================
//   6. Таблицы дрожжей (IDY + fresh)
// ===============================

const IDY_TABLE: [number, number][] = [
  [1, 0.008],
  [2, 0.007],
  [3, 0.006],
  [4, 0.005],
  [5, 0.0042],
  [6, 0.0035],
  [8, 0.003],
  [10, 0.0028],
  [12, 0.0025],
  [16, 0.0023],
  [20, 0.002],
  [24, 0.0018],
];

const FRESH_TABLE: [number, number][] = [
  [3, 0.007],
  [4, 0.0065],
  [5, 0.0058],
  [6, 0.005],
  [8, 0.0042],
  [10, 0.0036],
  [12, 0.003],
  [16, 0.0026],
  [20, 0.0023],
  [24, 0.002],
];

// ===============================
//   Вспомогательная интерполяция
// ===============================

function lerpTable(hours: number, table: [number, number][]) {
  if (hours <= table[0][0]) return table[0][1];
  if (hours >= table[table.length - 1][0]) return table[table.length - 1][1];

  for (let i = 0; i < table.length - 1; i++) {
    const [h1, v1] = table[i];
    const [h2, v2] = table[i + 1];
    if (hours >= h1 && hours <= h2) {
      const t = (hours - h1) / (h2 - h1);
      return v1 + (v2 - v1) * t;
    }
  }
  return table[table.length - 1][1];
}

// ===============================
//   7. W-factor (авто)
// ===============================

function computeWFactor(
  main: FlourType,
  extra1: FlourType,
  pct1: number,
  extra2: FlourType,
  pct2: number
) {
  const W_main = W_BY_FLOUR[main];
  const W_e1 = W_BY_FLOUR[extra1];
  const W_e2 = W_BY_FLOUR[extra2];

  const W_weighted =
    W_main * (1 - pct1 / 100 - pct2 / 100) +
    W_e1 * (pct1 / 100) +
    W_e2 * (pct2 / 100);

  if (W_weighted < 180) return 1.05;
  if (W_weighted > 280) return 0.95;
  return 1.0;
}

// ===============================
//   8. Итоговая модель дрожжей
// ===============================

export function computeYeastPercent(input: YeastModelInput): number {
  const {
    coldHours,
    warmHours,
    doughType,
    yeastForm,
    mainFlour,
    extraFlour1,
    extraPct1,
    extraFlour2,
    extraPct2,
    productionMode,
  } = input;

  const base =
    yeastForm === "instant"
      ? lerpTable(coldHours, IDY_TABLE)
      : lerpTable(coldHours, FRESH_TABLE);

  const kDough = doughType === "enriched" ? 1.2 : 1.0;
  const kMode = productionMode === "professional" ? 0.9 : 1.0;

  const kWarm =
    warmHours <= 1 ? 1.1 : warmHours >= 4 ? 0.9 : 1.0;

  const kFlour =
    FLOUR_FERMENTATION_FACTOR[mainFlour] +
    FLOUR_FERMENTATION_FACTOR[extraFlour1] * (extraPct1 / 100) +
    FLOUR_FERMENTATION_FACTOR[extraFlour2] * (extraPct2 / 100);

  const kW = computeWFactor(
    mainFlour,
    extraFlour1,
    extraPct1,
    extraFlour2,
    extraPct2
  );

  return base * kDough * kMode * kWarm * (1 + kFlour) * kW;
}

// ===============================
//   9. Итоговая модель гидратации
// ===============================

export function computeHydration(input: HydrationModelInput): number {
  const {
    baseHydration,
    mainFlour,
    extraFlour1,
    extraPct1,
    extraFlour2,
    extraPct2,
    liquidType,
    fatType,
    sugarType,
    eggType,
  } = input;

  let hydration =
    baseHydration +
    FLOUR_HYDRATION_DELTA[mainFlour] +
    FLOUR_HYDRATION_DELTA[extraFlour1] * (extraPct1 / 100) +
    FLOUR_HYDRATION_DELTA[extraFlour2] * (extraPct2 / 100);

  hydration += SUGAR_WATER_DELTA[sugarType] * 100;
  hydration += FAT_WATER_DELTA[fatType] * 100;
  hydration += EGG_WATER_EQUIVALENT[eggType] * 10;

  hydration *= LIQUID_WATER_EQUIVALENT[liquidType];

  return hydration;
}
