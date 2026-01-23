import { useState } from "react";
import NumberInput from "../components/NumberInput";

type CustomProfileScreenProps = {
  initialProfile?: any | null;
  onSave: (profile: any) => void;
  onCancel: () => void;
};

// 🔥 дефолтный schedule, чтобы не было NaN
const DEFAULT_SCHEDULE = {
  bulk: { totalHours: 1, temperature: 24, steps: [] },
  finalProof: { totalHours: 1, temperature: 26, comment: "" },
  coldRetard: {
    enabled: false,
    hours: 0,
    temperature: 4,
    comment: "",
  },
};

export default function CustomProfileScreen({
  initialProfile,
  onSave,
  onCancel,
}: CustomProfileScreenProps) {
  // 🔥 нормализуем initialProfile, чтобы schedule всегда был валиден
  const normalized = initialProfile
    ? {
        ...initialProfile,
        schedule: {
          bulk: {
            ...DEFAULT_SCHEDULE.bulk,
            ...(initialProfile.schedule?.bulk || {}),
          },
          finalProof: {
            ...DEFAULT_SCHEDULE.finalProof,
            ...(initialProfile.schedule?.finalProof || {}),
          },
          coldRetard: {
            ...DEFAULT_SCHEDULE.coldRetard,
            ...(initialProfile.schedule?.coldRetard || {}),
          },
        },
      }
    : null;

  const [profile, setProfile] = useState(
    normalized || {
      id: "",
      name: "",
      category: "custom",
      defaults: {
        flour: 1000,
        hydration: 60,
        salt: 2,
        sugar: 0,
        fat: 0,
        eggs: 0,
        yeast: { type: "instant", percent: 0, allowZero: true },
      },
      limits: {
        hydration: { min: 40, max: 100 },
        salt: { min: 0, max: 5 },
        sugar: { min: 0, max: 50 },
        fat: { min: 0, max: 50 },
        eggs: { min: 0, max: 10 },
        yeastPercent: { min: 0, max: 5 },
      },
      process: {
        mixingIntensity: "medium",
        mixingTime: {
          manual: { min: 5, max: 10 },
          planetary: { min: 3, max: 6 },
          spiral: { min: 2, max: 4 },
        },
        glutenDevelopment: "medium",
        bulkFermentationTarget: "x2.0",
        finalProofTarget: "пальцевый тест",
      },
      climateAdjustments: {
        dry: { hydrationDelta: 0, yeastDeltaPercent: 0, comment: "" },
        moderate: { hydrationDelta: 0, yeastDeltaPercent: 0, comment: "" },
        humid: { hydrationDelta: 0, yeastDeltaPercent: 0, comment: "" },
      },
      mixingAdjustments: {
        manual: { hydrationDelta: 0, yeastPercentDelta: 0, comment: "" },
        planetary: { hydrationDelta: 0, yeastPercentDelta: 0, comment: "" },
        spiral: { hydrationDelta: 0, yeastPercentDelta: 0, comment: "" },
      },
      preferment: {
        enabled: false,
        type: "none",
        percentOfFlour: 0,
        hydration: 0,
        yeastPercentInPreferment: 0,
        comment: "",
      },
      schedule: DEFAULT_SCHEDULE,
      bake: {
        temperature: 180,
        timeMinutes: 25,
      },
      uiHints: {
        flourLabel: "Мука",
        hydrationLabel: "Гидратация",
        notesForBaker: [],
      },
    }
  );

  // 🔥 универсальный update с защитой от пустых значений
  const update = (path: string, value: any) => {
    setProfile((prev: any) => {
      const copy = structuredClone(prev);
      const parts = path.split(".");
      let obj: any = copy;

      for (let i = 0; i < parts.length - 1; i++) {
        obj = obj[parts[i]];
      }

      // если это число, но пользователь ввёл "" → ставим 0
      if (typeof obj[parts.at(-1)!] === "number" && value === "") {
        obj[parts.at(-1)!] = 0;
      } else {
        obj[parts.at(-1)!] = value;
      }

      // 🔥 автогенерация allowZero
      if (path === "defaults.yeast.percent") {
        copy.defaults.yeast.allowZero = value === 0;
      }

      return copy;
    });
  };

  const canSave =
    profile.id.trim().length > 0 && profile.name.trim().length > 0;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <h1 style={{ marginBottom: "16px" }}>Создать своё тесто</h1>

      <div style={{ marginBottom: "16px" }}>
        <label>ID профиля (латиница)</label>
        <input
          type="text"
          value={profile.id}
          onChange={(e) => update("id", e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label>Название теста</label>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => update("name", e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </div>

      <h2 style={{ marginBottom: "12px" }}>Базовые параметры</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <NumberInput
          label="Гидратация (%)"
          value={profile.defaults.hydration}
          onChange={(v) => update("defaults.hydration", v)}
        />

        <NumberInput
          label="Соль (%)"
          value={profile.defaults.salt}
          onChange={(v) => update("defaults.salt", v)}
        />

        <NumberInput
          label="Сахар (%)"
          value={profile.defaults.sugar}
          onChange={(v) => update("defaults.sugar", v)}
        />

        <NumberInput
          label="Жир (%)"
          value={profile.defaults.fat}
          onChange={(v) => update("defaults.fat", v)}
        />

        <NumberInput
          label="Яйца (%)"
          value={profile.defaults.eggs}
          onChange={(v) => update("defaults.eggs", v)}
        />

        <NumberInput
          label="Дрожжи (%)"
          value={profile.defaults.yeast.percent}
          onChange={(v) => update("defaults.yeast.percent", v)}
        />
      </div>

      <div style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
        <button
          type="button"
          disabled={!canSave}
          onClick={() => onSave(profile)}
          style={{
            padding: "10px 16px",
            borderRadius: "6px",
            border: "1px solid #333",
            background: canSave ? "#eee" : "#ccc",
            cursor: canSave ? "pointer" : "not-allowed",
          }}
        >
          💾 Сохранить
        </button>

        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "10px 16px",
            borderRadius: "6px",
            border: "1px solid #999",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
