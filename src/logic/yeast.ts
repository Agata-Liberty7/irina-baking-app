export type YeastInput = {
  flour: number;
  sugar: number;
  fat: number;
  profile: any;
  climate: string;
  productionMode: string;
  roomTemp: number;

  warmFermentationHours: number;
  coldFermentationHours: number;
};

export function calculateYeast(input: YeastInput) {
  const {
    flour,
    sugar,
    fat,
    profile,
    climate,
    productionMode,
    roomTemp,
    warmFermentationHours,
    coldFermentationHours,
  } = input;

  // ------------------------------------------------------
  // 1. БАЗОВАЯ НОРМА ДРОЖЖЕЙ
  // ------------------------------------------------------
  let yeastPct = profile.base.yeast?.percent ?? 1.5;

  // Если профиль разрешает 0 — оставляем 0
  if (profile.base.yeast?.allowZero && profile.base.yeast.percent === 0) {
    return { yeast: 0 };
  }

  // ------------------------------------------------------
  // 2. КЛИМАТ
  // ------------------------------------------------------
  if (climate === "dry") yeastPct += 0.2;
  if (climate === "humid") yeastPct -= 0.2;

  // ------------------------------------------------------
  // 3. ТЕМПЕРАТУРА ПОМЕЩЕНИЯ
  // ------------------------------------------------------
  if (roomTemp < 20) yeastPct += 0.4;
  if (roomTemp < 18) yeastPct += 0.7;
  if (roomTemp > 26) yeastPct -= 0.3;
  if (roomTemp > 28) yeastPct -= 0.6;

  // ------------------------------------------------------
  // 4. САХАР И ЖИРЫ
  // ------------------------------------------------------
  yeastPct += sugar * 0.02;
  yeastPct += fat * 0.03;

  // ------------------------------------------------------
  // 5. ПРОИЗВОДСТВЕННЫЙ РЕЖИМ
  // ------------------------------------------------------
  if (productionMode === "pro") yeastPct -= 0.2;

  // ------------------------------------------------------
  // 6. ТИП ТЕСТА (новая модель)
  // ------------------------------------------------------
  let coldFactor = 0.25;

  if (profile.isEnriched) coldFactor = 0.33;
  if (profile.isSourdough) coldFactor = 0.50;
  if (profile.isFried) coldFactor = 0.20;
  if (profile.isPastry) coldFactor = 0;
  if (profile.isBoiled) coldFactor = 0.25;

  const effectiveHours =
    warmFermentationHours + coldFermentationHours * coldFactor;

  const baseTime = profile.process?.bulkFermentationTarget
    ? parseFloat(profile.process.bulkFermentationTarget)
    : 3;

  const ratio = effectiveHours / baseTime;

  if (ratio > 1) {
    const enrichedFactor = profile.isEnriched ? 0.55 : 0.70;
    yeastPct *= 1 / (1 + (ratio - 1) * enrichedFactor);
  } else if (ratio < 1) {
    yeastPct *= 1 + (1 - ratio) * 0.5;
  }

  // ------------------------------------------------------
  // 7. ФИНАЛЬНЫЙ РАСЧЁТ
  // ------------------------------------------------------
  const yeast = Math.max(0, Math.round((flour * yeastPct) / 100));

  return { yeast };
}
