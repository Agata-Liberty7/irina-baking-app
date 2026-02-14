export type HydrationInput = {
  flour: number;
  salt: number;
  sugar: number;
  fat: number;
  eggs: number;

  water?: number; // если пользователь вводит воду вручную
  milk?: number;  // если профиль использует молоко

  profile: any;

  climate: string;
  mixing: string;
  productionMode: string;
  roomTemp: number;

  warmFermentationHours: number;
  coldFermentationHours: number;
};

export function calculateHydration(input: HydrationInput) {
  const {
    flour,
    sugar,
    fat,
    eggs,
    water = 0,
    milk = 0,
    profile,
    climate,
    mixing,
    productionMode,
    roomTemp,
    warmFermentationHours,
    coldFermentationHours,
  } = input;

  // ------------------------------------------------------
  // 1. БАЗОВАЯ ГИДРАТАЦИЯ ПРОФИЛЯ
  // ------------------------------------------------------
  let hydrationPct = profile.base.hydration ?? 60;

  // ------------------------------------------------------
  // 2. ЕСЛИ ПОЛЬЗОВАТЕЛЬ ВВЁЛ ВОДУ/МОЛОКО — ИСПОЛЬЗУЕМ ИХ
  // ------------------------------------------------------
  const waterFromWater = water * 1.0;
  const waterFromMilk = milk * 0.87; // молоко ≠ вода
  const waterFromEggs = eggs * 30;   // профессиональная модель

  const totalAvailableWater = waterFromWater + waterFromMilk + waterFromEggs;

  if (water > 0 || milk > 0) {
    const hydration = Math.round((totalAvailableWater / flour) * 100);
    return { water: totalAvailableWater, hydration };
  }

  // ------------------------------------------------------
  // 3. КОРРЕКЦИИ ПО СДОБНОСТИ
  // ------------------------------------------------------
  hydrationPct -= sugar * 0.15; // сахар связывает воду
  hydrationPct -= fat * 0.20;   // жиры уменьшают доступную воду
  hydrationPct -= eggs * 1.5;   // яйца дают воду, но добавляют сухие вещества

  if (milk > 0) hydrationPct -= 2; // молоко делает тесто плотнее

  // ------------------------------------------------------
  // 4. ТИП ТЕСТА (новая модель)
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
    hydrationPct += (ratio - 1) * 4; // длинная ферментация удерживает воду
  } else if (ratio < 1) {
    hydrationPct -= (1 - ratio) * 3; // короткая ферментация → тесто слабее
  }

  // ------------------------------------------------------
  // 5. КЛИМАТ
  // ------------------------------------------------------
  if (climate === "dry") hydrationPct += 3;
  if (climate === "humid") hydrationPct -= 3;

  // ------------------------------------------------------
  // 6. ТЕМПЕРАТУРА ПОМЕЩЕНИЯ
  // ------------------------------------------------------
  if (roomTemp < 20) hydrationPct += 2;
  if (roomTemp < 18) hydrationPct += 3;
  if (roomTemp > 26) hydrationPct -= 2;
  if (roomTemp > 28) hydrationPct -= 3;

  // ------------------------------------------------------
  // 7. СПОСОБ ЗАМЕСА
  // ------------------------------------------------------
  if (mixing === "spiral") hydrationPct += 2;
  if (mixing === "manual") hydrationPct -= 2;

  // ------------------------------------------------------
  // 8. ПРОИЗВОДСТВЕННЫЙ РЕЖИМ
  // ------------------------------------------------------
  if (productionMode === "pro") hydrationPct += 1;

  // ------------------------------------------------------
  // 9. ФИНАЛЬНЫЙ РАСЧЁТ ВОДЫ
  // ------------------------------------------------------
  const waterGrams = Math.round((flour * hydrationPct) / 100);

  return {
    water: waterGrams,
    hydration: hydrationPct,
  };
}
