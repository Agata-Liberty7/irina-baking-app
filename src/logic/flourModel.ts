export function calculateFlourParts(flour: number, extraPct1: number, extraPct2: number) {
  const mainFlourGr = Math.round(flour * (100 - extraPct1 - extraPct2) / 100);
  const extraFlour1Gr = Math.round(flour * extraPct1 / 100);
  const extraFlour2Gr = Math.round(flour * extraPct2 / 100);

  return {
    mainFlourGr,
    extraFlour1Gr,
    extraFlour2Gr,
  };
}
