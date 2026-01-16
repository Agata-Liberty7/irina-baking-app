export type HydrationInput = {
  flour: number;
  salt: number;
  sugar: number;
  fat: number;
  eggs: number;
  water?: number; // если пользователь вводит воду вручную
  milk?: number;  // если есть молоко
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

  // -----------------------------
  // 1. БАЗОВАЯ ГИДРАТАЦИЯ ПРОФИЛЯ
  // -----------------------------
  let hydrationPct = profile.baseHydration ?? 60;

  // -----------------------------
  // 2. ДОСТУПНАЯ ВОДА ОТ ЖИДКОСТЕЙ
  // -----------------------------
  const waterFromWater = water * 1.0;
  const waterFromMilk = milk * 0.87; // молоко ≠ вода
  const waterFromEggs = eggs * 30;   // профессиональная модель B

  const totalAvailableWater = waterFromWater + waterFromMilk + waterFromEggs;

  // Если пользователь ввёл воду/молоко вручную → используем их
  if (water > 0 || milk > 0) {
    const hydration = Math.round((totalAvailableWater / flour) * 100);
    return { water: totalAvailableWater, hydration };
  }

  // -----------------------------
  // 3. КОРРЕКЦИИ ПО СДОБНОСТИ
  // -----------------------------
  // Сахар связывает воду
  hydrationPct -= sugar * 0.15;

  // Жиры уменьшают доступную воду
  hydrationPct -= fat * 0.20;

  // Яйца дают воду, но добавляют сухие вещества → корректируем
  hydrationPct -= eggs * 1.5;

  // Молоко делает тесто плотнее
  if (milk > 0) hydrationPct -= 2;

  // -----------------------------
  // 4. СМЕШАННАЯ ФЕРМЕНТАЦИЯ
  // -----------------------------
  const coldFactor = profile.isEnriched ? 0.33 : 0.25;

  const effectiveHours =
    warmFermentationHours + coldFermentationHours * coldFactor;

  const baseTime = profile.baseFermentationHours ?? 3;
  const ratio = effectiveHours / baseTime;

  if (ratio > 1) {
    // Длинная холодная ферментация → тесто удерживает больше воды
    hydrationPct += (ratio - 1) * 4; // мягкая коррекция
  } else if (ratio < 1) {
    // Короткая ферментация → тесто слабее
    hydrationPct -= (1 - ratio) * 3;
  }

  // -----------------------------
  // 5. КЛИМАТ
  // -----------------------------
  if (climate === "dry") hydrationPct += 3;
  if (climate === "humid") hydrationPct -= 3;

  // -----------------------------
  // 6. ТЕМПЕРАТУРА ПОМЕЩЕНИЯ
  // -----------------------------
  if (roomTemp < 20) hydrationPct += 2;
  if (roomTemp < 18) hydrationPct += 3;
  if (roomTemp > 26) hydrationPct -= 2;
  if (roomTemp > 28) hydrationPct -= 3;

  // -----------------------------
  // 7. СПОСОБ ЗАМЕСА
  // -----------------------------
  if (mixing === "spiral") hydrationPct += 2;
  if (mixing === "manual") hydrationPct -= 2;

  // -----------------------------
  // 8. ПРОИЗВОДСТВЕННЫЙ РЕЖИМ
  // -----------------------------
  if (productionMode === "pro") hydrationPct += 1;

  // -----------------------------
  // 9. ФИНАЛЬНЫЙ РАСЧЁТ ВОДЫ
  // -----------------------------
  const waterGrams = Math.round((flour * hydrationPct) / 100);

  return {
    water: waterGrams,
    hydration: hydrationPct,
  };
}
