export const LIQUID_WATER_CONTENT = {
  water: 1.0,
  milk: 0.87,
  kefir: 0.88,
  whey: 0.93,
  plant_milk: 0.9,
} as const;

export type LiquidType = keyof typeof LIQUID_WATER_CONTENT;

export function getLiquidWaterContent(liquidType: string): number {
  return LIQUID_WATER_CONTENT[liquidType as LiquidType] ?? 1.0;
}

export function calculateLiquidWater(
  liquidGrams: number,
  liquidType: string
): number {
  return Math.round(liquidGrams * getLiquidWaterContent(liquidType));
}

export function calculateLiquidFromTargetWater(
  targetWaterGrams: number,
  liquidType: string
): number {
  const waterFraction = getLiquidWaterContent(liquidType);
  if (waterFraction <= 0) return 0;
  return Math.round(targetWaterGrams / waterFraction);
}