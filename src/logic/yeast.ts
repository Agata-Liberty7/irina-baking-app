export type YeastInput = {
  flour: number;
  sugar: number;
  fat: number;
  profile: any;
  climate: string;
  productionMode: string;
  roomTemp: number;
};

export type YeastResult = {
  yeast: number;
};

export function calculateYeast(input: YeastInput): YeastResult {
  const { flour, sugar, fat, profile, climate, productionMode, roomTemp } =
    input;

  let yeastPct = profile.baseYeast ?? 1.5;

  // Влажность
  if (climate === "dry") yeastPct += 0.2;
  if (climate === "humid") yeastPct -= 0.2;

  // Температура помещения
  if (roomTemp < 20) yeastPct += 0.4;
  if (roomTemp < 18) yeastPct += 0.7;
  if (roomTemp > 26) yeastPct -= 0.3;
  if (roomTemp > 28) yeastPct -= 0.6;

  // Жиры/сахар
  yeastPct += sugar * 0.02;
  yeastPct += fat * 0.03;

  // Режим
  if (productionMode === "pro") yeastPct -= 0.2;

  const yeast = Math.max(0, Math.round((flour * yeastPct) / 100));

  return { yeast };
}
