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

  // ------------------------------------------------------
  // 1. Если предфермента нет
  // ------------------------------------------------------
  if (prefermentType === "none" || prefermentFlourPct <= 0) {
    return {
      preferment: {
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

  // ------------------------------------------------------
  // 2. Мука в предферменте
  // ------------------------------------------------------
  const prefermentFlour = Math.round((flour * prefermentFlourPct) / 100);

  // ------------------------------------------------------
  // 3. Вода в предферменте
  // ------------------------------------------------------
  const prefermentWater = Math.round(
    (prefermentFlour * prefermentHydrationPct) / 100
  );

  // ------------------------------------------------------
  // 4. Дрожжи в предферменте
  // ------------------------------------------------------
  const prefermentYeast = Math.round(
    (totalYeast * prefermentYeastPct) / 100
  );

  // ------------------------------------------------------
  // 5. Остатки для основного теста
  // ------------------------------------------------------
  const finalFlour = flour - prefermentFlour;
  const finalWater = water - prefermentWater;
  const finalYeast = totalYeast - prefermentYeast;

  // Молоко, яйца, соль, сахар, жиры — всегда в основное тесто
  const finalMilk = milk;
  const finalEggs = eggs;

  // ------------------------------------------------------
  // 6. Гидратация предфермента
  // ------------------------------------------------------
  const prefermentHydration = Math.round(
    (prefermentWater / prefermentFlour) * 100
  );

  // ------------------------------------------------------
  // 7. Влияние предфермента на ферментацию
  // ------------------------------------------------------
  const coldFactor = profile.isEnriched ? 0.33 : 0.25;

  const effectiveHours =
    warmFermentationHours + coldFermentationHours * coldFactor;

  const prefermentStrength = prefermentFlourPct / 100;

  const effectivePrefermentHours = effectiveHours * prefermentStrength;

  // ------------------------------------------------------
  // 8. Возвращаем полный состав
  // ------------------------------------------------------
  return {
    preferment: {
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
      milk: finalMilk,
      eggs: finalEggs,
      yeast: finalYeast,

      salt,
      sugar,
      fat,
    },

    effectivePrefermentHours,
  };
}
