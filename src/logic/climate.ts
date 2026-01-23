export const climateAdjustments = {
  dry: {
    hydrationDelta: 2,
    yeastDeltaPercent: 0.05,
    comment: "Сухой климат: мука впитывает больше воды."
  },
  moderate: {
    hydrationDelta: 0,
    yeastDeltaPercent: 0,
    comment: "Умеренный климат: базовые параметры."
  },
  humid: {
    hydrationDelta: -2,
    yeastDeltaPercent: -0.05,
    comment: "Влажный климат: тесто липче."
  }
};
