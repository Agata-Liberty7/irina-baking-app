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

import levain from "../profiles/levain.json";
import poolish from "../profiles/poolish.json";
import none from "../profiles/none.json";
import yeasted_sponge from "../profiles/yeasted_sponge.json";
import biga from "../profiles/biga.json";
import enriched_pref from "../profiles/enriched.json";

import {
  computeYeastPercent,
  computeHydration,
  type FlourType,
  type YeastForm,
} from "./fermentationModel";

const profiles: Record<string, any> = {
  pizza,
  bread,
  baguette,
  focaccia,
  ciabatta,
  bagel,
  pita,
  brioche,
  cinnabon,
  donuts,
  enriched,
  ensaimada,
  belyashi,
  chebureki,
  empanada,
  baked_pirozhki,
  sourdough,
  sponge,
  shortcrust,
  choux,
};

const preferments: Record<string, any> = {
  levain,
  poolish,
  none,
  yeasted_sponge,
  biga,
  enriched: enriched_pref,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function detectType(profile: any) {
  const sugar = profile.base.sugar;
  const fat = profile.base.fat;
  const eggs = profile.base.eggs;
  const yeast = profile.base.yeast?.percent ?? 0;

  return {
    isEnriched: sugar > 5 || fat > 5 || eggs > 0,
    isLean: sugar <= 5 && fat <= 5 && eggs === 0 && yeast > 0,
    isSourdough: yeast === 0 && profile.preferment?.type === "levain",
    isFried:
      profile.category === "fried" || profile.category === "fried_enriched",
    isBoiled: profile.category === "boiled_bread",
    isPastry: profile.category === "pastry",
  };
}

function detectDefaultPreferment(profile: any) {
  if (profile.preferment?.enabled) return profile.preferment.type;

  if (profile.category === "bread") return "poolish";
  if (profile.category === "enriched") return "yeasted_sponge";
  if (profile.category === "sourdough") return "levain";

  return "none";
}

export function loadProfile(
  profileId: string,
  climate: string,
  mixing: string,
  opts?: {
    productionMode?: "home" | "professional";
    coldHours?: number;
    warmHours?: number;
    flourType?: FlourType;
    yeastForm?: YeastForm;
  }
) {
  const raw = profiles[profileId];
  if (!raw) throw new Error(`Профиль ${profileId} не найден`);

  const profile = JSON.parse(JSON.stringify(raw));
  const base = profile.base;
  const limits = profile.limits;

  // -----------------------------
  // 1. Климатические поправки
  // -----------------------------
  const climateAdj = profile.climateAdjustments?.[climate];
  if (climateAdj) {
    base.hydration += climateAdj.hydrationDelta || 0;
    if (base.yeast) {
      base.yeast.percent += climateAdj.yeastDeltaPercent || 0;
    }
  }

  // -----------------------------
  // 2. Поправки на замес
  // -----------------------------
  const mixingAdj = profile.mixingAdjustments?.[mixing];
  if (mixingAdj) {
    base.hydration += mixingAdj.hydrationDelta || 0;
    if (base.yeast) {
      base.yeast.percent += mixingAdj.yeastPercentDelta || 0;
    }
  }

  // -----------------------------
  // 3. Умная модель (вариант C+)
  // -----------------------------
  const productionMode = opts?.productionMode ?? "home";
  const coldHours = opts?.coldHours ?? 0;
  const warmHours = opts?.warmHours ?? 0;
  const flourType = opts?.flourType ?? "normal";
  const yeastForm = opts?.yeastForm ?? "instant";

  // 3.1 Гидратация
  base.hydration = computeHydration({
    baseHydration: base.hydration,
    flourType,
  });

  // 3.2 Дрожжи (если не чистый левен)
  if (base.yeast && profile.preferment?.type !== "levain") {
    base.yeast.percent = computeYeastPercent({
      coldHours,
      warmHours,
      doughType: profile.isEnriched ? "enriched" : "lean",
      yeastForm,
      flourType,
      productionMode,
    });
  }

  // -----------------------------
  // 4. Ограничения профиля
  // -----------------------------
  base.hydration = clamp(
    base.hydration,
    limits.hydration.min,
    limits.hydration.max
  );
  base.salt = clamp(base.salt, limits.salt.min, limits.salt.max);
  base.sugar = clamp(base.sugar, limits.sugar.min, limits.sugar.max);
  base.fat = clamp(base.fat, limits.fat.min, limits.fat.max);

  if (base.yeast) {
    base.yeast.percent = clamp(
      base.yeast.percent,
      limits.yeastPercent.min,
      limits.yeastPercent.max
    );
  }

  // -----------------------------
  // 5. Предфермент
  // -----------------------------
  const prefType = profile.preferment?.type || "none";
  const prefData = preferments[prefType] || preferments["none"];

  const flags = detectType(profile);
  const defaultPrefermentType = detectDefaultPreferment(profile);

  return {
    id: profile.id,
    name: profile.name,
    category: profile.category,
    subtype: profile.subtype || profile.id,

    base,
    limits: profile.limits,
    process: profile.process,
    schedule: profile.schedule,
    bake: profile.bake,
    uiHints: profile.uiHints,

    preferment: {
      enabled: profile.preferment?.enabled || false,
      type: prefType,
      percentOfFlour: profile.preferment?.percentOfFlour || 0,
      hydration: profile.preferment?.hydration || 100,
      yeastPercentInPreferment:
        profile.preferment?.yeastPercentInPreferment || 0,
      data: prefData,
    },

    ...flags,
    defaultPrefermentType,
  };
}
