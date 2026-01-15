import pizza from "../profiles/pizza.json";
import type { Climate, MixingMethod } from "../context/AppContext";

export type Profile = typeof pizza;

const profiles: Record<string, Profile> = {
  pizza
};

export function loadProfile(
  profileId: string,
  climate: Climate,
  mixing: MixingMethod
) {
  const base = profiles[profileId];
  if (!base) throw new Error(`Профиль ${profileId} не найден`);

  const profile = JSON.parse(JSON.stringify(base)) as Profile;

  //
  // 1. Поправки по климату
  //
  const climateAdj = profile.climateAdjustments[climate];
  if (climateAdj) {
    profile.defaults.hydration += climateAdj.hydrationDelta || 0;
    profile.defaults.yeast.percent += climateAdj.yeastDeltaPercent || 0;
  }

  //
  // 2. Поправки по типу замеса
  //
  const mixingAdj = profile.mixingAdjustments[mixing];
  if (mixingAdj) {
    if (mixingAdj.hydrationDelta) {
      profile.defaults.hydration += mixingAdj.hydrationDelta;
    }
    if (mixingAdj.yeastPercentDelta) {
      profile.defaults.yeast.percent += mixingAdj.yeastPercentDelta;
    }
  }

  //
  // 3. Ограничиваем значения по лимитам
  //
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  profile.defaults.hydration = clamp(
    profile.defaults.hydration,
    profile.limits.hydration.min,
    profile.limits.hydration.max
  );

  profile.defaults.salt = clamp(
    profile.defaults.salt,
    profile.limits.salt.min,
    profile.limits.salt.max
  );

  profile.defaults.fat = clamp(
    profile.defaults.fat,
    profile.limits.fat.min,
    profile.limits.fat.max
  );

  profile.defaults.sugar = clamp(
    profile.defaults.sugar,
    profile.limits.sugar.min,
    profile.limits.sugar.max
  );

  profile.defaults.yeast.percent = clamp(
    profile.defaults.yeast.percent,
    profile.limits.yeastPercent.min,
    profile.limits.yeastPercent.max
  );

  return profile;
}
