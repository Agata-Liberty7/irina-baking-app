export type HydrationInput = {
  flour: number;
  salt: number;
  sugar: number;
  fat: number;
  eggs: number;

  profile: any;
  climate: string;
  mixing: string;
  productionMode: string;
  roomTemp: number;
};

export type HydrationResult = {
  water: number;
};

export function calculateHydration(input: HydrationInput): HydrationResult {
  const {
    flour,
    sugar,
    fat,
    eggs,
    profile,
    climate,
    mixing,
    productionMode,
    roomTemp,
  } = input;

  let hydration = profile.baseHydration ?? 60;

  // Влажность
  if (climate === "dry") hydration += 2;
  if (climate === "humid") hydration -= 2;

  // Температура помещения
  if (roomTemp < 20) hydration += 1;
  if (roomTemp < 18) hydration += 2;
  if (roomTemp > 26) hydration -= 1;
  if (roomTemp > 28) hydration -= 2;

  // Замес
  if (mixing === "planetary") hydration += 1;
  if (mixing === "manual") hydration -= 1;

  // Жиры/сахар/яйца
  hydration -= fat * 0.2;
  hydration -= sugar * 0.1;
  hydration -= eggs * 0.5;

  // Режим
  if (productionMode === "pro") hydration += 1;

  const water = Math.round((flour * hydration) / 100);

  return { water };
}
