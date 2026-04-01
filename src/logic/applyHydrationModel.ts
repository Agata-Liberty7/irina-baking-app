import { computeHydration, type FlourType } from "./fermentationModel";

export type LiquidType = "water" | "milk" | "kefir" | "whey" | "plant_milk";
export type FatType = "butter" | "oil" | "ghee" | "margarine";
export type SugarType = "white" | "brown" | "panela";
export type EggType = "whole" | "yolk" | "white" | "powder";

type ApplyHydrationParams = {
  baseHydration: number;
  mainFlour: FlourType;
  extraFlour1?: FlourType;
  extraPct1?: number;
  extraFlour2?: FlourType;
  extraPct2?: number;
  liquidType?: LiquidType;
  fatType?: FatType;
  sugarType?: SugarType;
  eggType?: EggType;
};

export function applyHydrationModel({
  baseHydration,
  mainFlour,
  extraFlour1 = "normal",
  extraPct1 = 0,
  extraFlour2 = "normal",
  extraPct2 = 0,
  liquidType = "water",
  fatType = "butter",
  sugarType = "white",
  eggType = "whole",
}: ApplyHydrationParams) {
  return computeHydration({
    baseHydration,
    mainFlour,
    extraFlour1,
    extraPct1,
    extraFlour2,
    extraPct2,
    liquidType,
    fatType,
    sugarType,
    eggType,
  });
}