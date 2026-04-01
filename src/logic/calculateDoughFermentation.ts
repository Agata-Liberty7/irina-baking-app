import {
  computeYeastPercent,
  type FlourType,
  type YeastForm,
  type DoughType,
} from "./fermentationModel";
import { calculateFermentation } from "./fermentation";

type CalculateDoughFermentationInput = {
  flour: number; // г

  sugarPct: number; // % от муки
  fatPct: number; // % от муки

  roomTemp: number;
  warmHours: number;
  coldHours: number;

  prefermentType: string;
  prefermentFlourPct: number;

  yeastForm: YeastForm;
  doughType: DoughType;
  productionMode: "home" | "professional";

  mainFlour: FlourType;
  extraFlour1?: FlourType;
  extraPct1?: number;
  extraFlour2?: FlourType;
  extraPct2?: number;
};

export function calculateDoughFermentation({
  flour,
  sugarPct,
  fatPct,
  roomTemp,
  warmHours,
  coldHours,
  prefermentType,
  prefermentFlourPct,
  yeastForm,
  doughType,
  productionMode,
  mainFlour,
  extraFlour1 = "normal",
  extraPct1 = 0,
  extraFlour2 = "normal",
  extraPct2 = 0,
}: CalculateDoughFermentationInput) {
  const yeastPercent = computeYeastPercent({
    coldHours,
    warmHours,
    doughType,
    yeastForm,
    productionMode,
    mainFlour,
    extraFlour1,
    extraPct1,
    extraFlour2,
    extraPct2,
  });

  const totalYeast = flour * yeastPercent;

  const fermentation = calculateFermentation({
    flour,
    totalYeast,
    sugarPct,
    fatPct,
    roomTemp,
    warmFermentationHours: warmHours,
    coldFermentationHours: coldHours,
    prefermentType,
    prefermentFlourPct,
  });

  return {
    yeastPercent,
    totalYeast,
    ...fermentation,
  };
}