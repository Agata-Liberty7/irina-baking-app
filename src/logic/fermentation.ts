// ------------------------------------------------------
// Типы
// ------------------------------------------------------

export type FermentationInput = {
  flour: number;                 // г
  totalYeast: number;            // г (после preferment.ts)
  sugarPct: number;              // % от муки
  fatPct: number;                // % от муки

  roomTemp: number;              // °C
  warmFermentationHours: number; // базовое время из профиля
  coldFermentationHours: number; // если есть холодная ферментация

  prefermentType: string;        // poolish/biga/...
  prefermentFlourPct: number;    // % муки в предферменте
};

export type FermentationResult = {
  bulkHours: number;
  proofHours: number;
  totalHours: number;
  notes: string[];
};

// ------------------------------------------------------
// Основная функция
// ------------------------------------------------------

export function calculateFermentation(input: FermentationInput): FermentationResult {
  const notes: string[] = [];

  // ------------------------------------------------------
  // 1) Температурный коэффициент
  // ------------------------------------------------------
  // эмпирически: каждые -1°C замедляют ферментацию на ~10%
  const tempDelta = input.roomTemp - 24;
  const temperatureFactor = 1 / (1 + tempDelta * 0.10);

  if (tempDelta < 0) notes.push(`Температура ниже нормы: брожение замедлится.`);
  if (tempDelta > 0) notes.push(`Температура выше нормы: брожение ускорится.`);

  // ------------------------------------------------------
  // 2) Влияние сахара
  // ------------------------------------------------------
  // сахар 10% → замедление на 20–30%
  const sugarFactor = 1 + input.sugarPct * 0.02;

  if (input.sugarPct > 10) notes.push(`Высокий сахар (${input.sugarPct}%) замедляет брожение.`);

  // ------------------------------------------------------
  // 3) Влияние жиров
  // ------------------------------------------------------
  // жиры 10% → замедление на 10–15%
  const fatFactor = 1 + input.fatPct * 0.015;

  if (input.fatPct > 10) notes.push(`Высокий процент жиров (${input.fatPct}%) замедляет брожение.`);

  // ------------------------------------------------------
  // 4) Влияние предфермента
  // ------------------------------------------------------
  let prefermentFactor = 1;

  if (input.prefermentType === "poolish") {
    prefermentFactor = 0.85 - input.prefermentFlourPct * 0.002;
    notes.push(`Пулеш ускоряет брожение.`);
  }

  if (input.prefermentType === "biga") {
    prefermentFactor = 0.90 - input.prefermentFlourPct * 0.0015;
    notes.push(`Бига слегка ускоряет брожение и укрепляет структуру.`);
  }

  if (input.prefermentType === "sponge" || input.prefermentType === "opara") {
    prefermentFactor = 0.88 - input.prefermentFlourPct * 0.0018;
    notes.push(`Опара ускоряет брожение.`);
  }

  if (input.prefermentType === "tangzhong" || input.prefermentType === "yudane") {
    prefermentFactor = 1.0;
    notes.push(`Тангзонг/Юдане почти не влияют на брожение.`);
  }

  // ------------------------------------------------------
  // 5) Влияние дрожжей
  // ------------------------------------------------------
  // базовая норма: 1% сухих дрожжей
  const yeastPct = (input.totalYeast / input.flour) * 100;
  const yeastFactor = 1 / (yeastPct / 1.0);

  if (yeastPct < 0.5) notes.push(`Мало дрожжей (${yeastPct.toFixed(2)}%): брожение будет медленным.`);
  if (yeastPct > 1.5) notes.push(`Много дрожжей (${yeastPct.toFixed(2)}%): брожение ускорится.`);

  // ------------------------------------------------------
  // 6) Итоговый коэффициент
  // ------------------------------------------------------
  const totalFactor =
    temperatureFactor *
    sugarFactor *
    fatFactor *
    prefermentFactor *
    yeastFactor;

  // ------------------------------------------------------
  // 7) Bulk fermentation
  // ------------------------------------------------------
  const bulkHours = input.warmFermentationHours * totalFactor;

  // ------------------------------------------------------
  // 8) Proof
  // ------------------------------------------------------
  // proof обычно короче bulk на 30–50%
  const proofHours = bulkHours * 0.6;

  // ------------------------------------------------------
  // 9) Холодная ферментация
  // ------------------------------------------------------
  let totalHours = bulkHours + proofHours;

  if (input.coldFermentationHours > 0) {
    totalHours += input.coldFermentationHours;
    notes.push(`Холодная ферментация добавляет ${input.coldFermentationHours} ч.`);
  }

  // ------------------------------------------------------
  // 10) Возврат результата
  // ------------------------------------------------------
  return {
    bulkHours,
    proofHours,
    totalHours,
    notes,
  };
}
