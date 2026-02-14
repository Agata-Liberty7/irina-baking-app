export type PrefermentType =
  | "none"
  | "poolish"
  | "biga"
  | "sponge"
  | "opara"
  | "tangzhong"
  | "yudane";

export type PrefermentInput = {
  flour: number;
  water: number;
  milk?: number;
  eggs: number;

  salt: number;
  sugar: number;
  fat: number;

  prefermentType: PrefermentType;
  prefermentFlourPct: number;
  prefermentHydrationPct: number;
  prefermentYeastPct: number;

  totalYeast: number;

  warmFermentationHours: number;
  coldFermentationHours: number;

  profile: any;
};

export function calculatePreferment(input: PrefermentInput) {
  const {
    flour,
    water,
    milk = 0,
    eggs,
    salt,
    sugar,
    fat,

    prefermentType,
    prefermentFlourPct,
    prefermentHydrationPct,
    prefermentYeastPct,

    totalYeast,
    warmFermentationHours,
    coldFermentationHours,
    profile,
  } = input;

  if (prefermentType === "none" || prefermentFlourPct <= 0) {
    return {
      preferment: {
        type: "none",
        flour: 0,
        water: 0,
        milk: 0,
        eggs: 0,
        yeast: 0,
        hydration: 0,
      },

      finalDough: {
        flour,
        water,
        milk,
        eggs,
        yeast: totalYeast,
        salt,
        sugar,
        fat,
      },

      effectivePrefermentHours: 0,
    };
  }

  const prefermentFlour = Math.round((flour * prefermentFlourPct) / 100);
  const prefermentWater = Math.round(
    (prefermentFlour * prefermentHydrationPct) / 100
  );
  const prefermentYeast = Math.round(
    (totalYeast * prefermentYeastPct) / 100
  );

  const finalFlour = flour - prefermentFlour;
  const finalWater = water - prefermentWater;
  const finalYeast = totalYeast - prefermentYeast;

  const prefermentHydration = Math.round(
    (prefermentWater / prefermentFlour) * 100
  );

  let coldFactor = 0.25;
  if (profile.isEnriched) coldFactor = 0.33;
  if (profile.isSourdough) coldFactor = 0.50;
  if (profile.isFried) coldFactor = 0.20;
  if (profile.isPastry) coldFactor = 0;
  if (profile.isBoiled) coldFactor = 0.25;

  const effectiveHours =
    warmFermentationHours + coldFermentationHours * coldFactor;

  const effectivePrefermentHours =
    effectiveHours * (prefermentFlourPct / 100);

  return {
    preferment: {
      type: prefermentType,
      flour: prefermentFlour,
      water: prefermentWater,
      milk: 0,
      eggs: 0,
      yeast: prefermentYeast,
      hydration: prefermentHydration,
    },

    finalDough: {
      flour: finalFlour,
      water: finalWater,
      milk,
      eggs,
      yeast: finalYeast,
      salt,
      sugar,
      fat,
    },

    effectivePrefermentHours,
  };
}
