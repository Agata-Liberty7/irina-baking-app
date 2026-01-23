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
  const baseYeast = input.profile.defaults.yeast;

  // 🔥 если профиль явно разрешает 0 — не трогаем
  if (baseYeast && baseYeast.allowZero && baseYeast.percent === 0) {
    return { yeast: 0 };
  }

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

  // 🔥 корректная инициализация дрожжей
  let yeastPct: number;

  if (baseYeast?.allowZero && baseYeast.percent === 0) {
    yeastPct = 0;
  } else if (typeof baseYeast?.percent === "number") {
    yeastPct = baseYeast.percent;
  } else {
    yeastPct = profile.baseYeast ?? 1.5;
  }

  // Влажность
  if (climate === "dry") yeastPct += 0.2;
  if (climate === "humid") yeastPct -= 0.2;

  // Температура помещения
  if (roomTemp < 20) yeastPct += 0.4;
  if (roomTemp < 18) yeastPct += 0.7;
  if (roomTemp > 26) yeastPct -= 0.3;
  if (roomTemp > 28) yeastPct -= 0.6;

  // Жиры и сахар
  yeastPct += sugar * 0.02;
  yeastPct += fat * 0.03;

  // Производственный режим
  if (productionMode === "pro") yeastPct -= 0.2;

  // Смешанная ферментация
  const coldFactor = profile.isEnriched ? 0.33 : 0.25;

  const effectiveHours =
    warmFermentationHours + coldFermentationHours * coldFactor;

  const baseTime = profile.baseFermentationHours ?? 3;
  const ratio = effectiveHours / baseTime;

  if (ratio > 1) {
    const enrichedFactor = profile.isEnriched ? 0.55 : 0.70;
    yeastPct *= 1 / (1 + (ratio - 1) * enrichedFactor);
  } else if (ratio < 1) {
    yeastPct *= 1 + (1 - ratio) * 0.5;
  }

  const yeast = Math.max(0, Math.round((flour * yeastPct) / 100));

  return { yeast };
}

        