import pizza from "../profiles/pizza.json";
import bread from "../profiles/bread.json";
import baguette from "../profiles/baguette.json";
import focaccia from "../profiles/focaccia.json";
import ciabatta from "../profiles/ciabatta.json"; 
import bagel from "../profiles/bagel.json";
import pita from "../profiles/pita.json";
import brioche from "../profiles/brioche.json";
import cinnabon from "../profiles/cinnabon.json";
import donuts from "../profiles/donuts.json";
import enriched from "../profiles/enriched.json";
import ensaimada from "../profiles/ensaimada.json";
import belyashi from "../profiles/belyashi.json";
import chebureki from "../profiles/chebureki.json";
import empanada from "../profiles/empanada.json";
import baked_pirozhki from "../profiles/baked_pirozhki.json";
import sourdough from "../profiles/sourdough.json"; 
import sponge from "../profiles/sponge.json";
import shortcrust from "../profiles/shortcrust.json";
import choux from "../profiles/choux.json";
import { defaultRecipe } from "./defaultRecipe";



export type Profile = Omit<typeof bread, "defaults"> & {
  defaults: Omit<typeof bread.defaults, "yeast"> & {
    yeast: YeastSpec;
  };
};

export type CustomProfile = Profile & {
  isCustom: true;
};

type YeastSpec = {
  type: string;
  percent: number;
  allowZero?: boolean; // 🔥 новый флаг
};



const profiles: Record<string, Profile> = {
  pizza: pizza as Profile,
  bread: bread as Profile,
  baguette: baguette as Profile,
  focaccia: focaccia as Profile,
  ciabatta: ciabatta as Profile,
  bagel: bagel as Profile,
  pita: pita as Profile,
  brioche: brioche as Profile,
  cinnabon: cinnabon as Profile,
  donuts: donuts as Profile,
  enriched: enriched as Profile,
  ensaimada: ensaimada as Profile,
  belyashi: belyashi as Profile,
  chebureki: chebureki as Profile,
  empanada: empanada as Profile,
  baked_pirozhki: baked_pirozhki as Profile,
  sourdough: sourdough as Profile,
  sponge: sponge as Profile,
  shortcrust: shortcrust as Profile,
  choux: choux as Profile,
};

export function loadProfile(
  profileId: string,
  climate: string,
  mixing: string, 
) {
  const base = profiles[profileId];
  if (!base) throw new Error(`Профиль ${profileId} не найден`);

  const profile = JSON.parse(JSON.stringify(base)) as Profile;

  //
  // 1. Поправки по климату
  const climateAdj = profile.climateAdjustments[climate as keyof typeof profile.climateAdjustments];
  if (climateAdj) {
    profile.defaults.hydration += climateAdj.hydrationDelta || 0;
    profile.defaults.yeast.percent += climateAdj.yeastDeltaPercent || 0;
  }

  // 2. Поправки по типу замеса
  const mixingAdj = profile.mixingAdjustments[mixing as keyof typeof profile.mixingAdjustments];
  if (mixingAdj) {
    if (mixingAdj.hydrationDelta) {
      profile.defaults.hydration += mixingAdj.hydrationDelta;
    }
    if (mixingAdj.yeastPercentDelta) {
      profile.defaults.yeast.percent += mixingAdj.yeastPercentDelta;
    }
  }

  // --- NEW: если профиль разрешает 0 дрожжей, не трогаем их ---
  if (profile.defaults.yeast?.allowZero && profile.defaults.yeast.percent === 0) {
    return { ...profile, defaults: { ...defaultRecipe, ...profile.defaults, }, };
  }

  // 3. Ограничиваем значения по лимитам
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

  // --- UPDATED: clamp дрожжей только если allowZero = false ---
  if (!profile.defaults.yeast?.allowZero) {
    profile.defaults.yeast.percent = clamp(
      profile.defaults.yeast.percent,
      profile.limits.yeastPercent.min,
      profile.limits.yeastPercent.max
    );
  } else if (profile.defaults.yeast?.percent !== 0) {
    profile.defaults.yeast.percent = clamp(
      profile.defaults.yeast.percent,
      profile.limits.yeastPercent.min,
      profile.limits.yeastPercent.max
    );
  }



    return { ...profile, defaults: { ...defaultRecipe, ...profile.defaults, }, };
}
