export const mixingAdjustments = {
  manual: {
    hydrationDelta: -2,
    yeastPercentDelta: 0,
    comment: "Ручной замес: тесто менее развито, воды нужно меньше."
  },
  planetary: {
    hydrationDelta: 0,
    yeastPercentDelta: 0,
    comment: "Планетарный миксер: стандартная интенсивность."
  },
  spiral: {
    hydrationDelta: 2,
    yeastPercentDelta: -0.1,
    comment: "Спиральный: лучше развивает клейковину, можно повысить воду."
  }
};
