export const climateAdjustments = {
  dry: {
    hydrationDelta: 3,
    yeastDeltaPercent: 0.2,
    comment: "Сухой климат: мука впитывает больше воды."
  },
  moderate: {
    hydrationDelta: 0,
    yeastDeltaPercent: 0,
    comment: "Умеренный климат: базовые параметры."
  },
  humid: {
    hydrationDelta: -3,
    yeastDeltaPercent: -0.2,
    comment: "Влажный климат: тесто липче."
  }
};
