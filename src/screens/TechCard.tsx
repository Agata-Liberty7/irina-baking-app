import React from "react";
import { useAppContext } from "../context/AppContext";

type ScheduleStep = {
  action: string;
  timeFromStartMinutes: number;
  comment?: string;
};

type TechCardProps = {
  profile: any;
  recipe: {
    preferment: {
      flour: number;
      water: number;
      yeast: number;
      hydration: number;
    };
    finalDough: any;
    effectivePrefermentHours: number;
    fermentation: {
      bulkHours: number;
      proofHours: number;
      totalHours: number;
      notes: string[];
    };
  };
  onBack: () => void;
};

// ------------------------------------------------------
// Форматирование времени
// ------------------------------------------------------
function formatTime(hoursFloat: number, mode: "minutes" | "hhmm" = "minutes") {
  const hours = Math.floor(hoursFloat);
  const minutes = Math.round((hoursFloat - hours) * 60);

  if (mode === "minutes") {
    return `${hours * 60 + minutes} мин`;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
function formatTimeSmart(hoursFloat: number) {
  return hoursFloat < 2
    ? formatTime(hoursFloat, "minutes")
    : formatTime(hoursFloat, "hhmm");
}

function normalizeDoughComposition(dough: any) {
  return {
    salt: dough.salt > 0,
    sugar: dough.sugar > 0 || dough.honey > 0 || dough.sweetener > 0,
    fat: dough.fat > 0 || dough.butter > 0 || dough.oil > 0,
    eggs: dough.eggs > 0,
    milk: dough.milk > 0,
  };
}

function getRemainingIngredients(dough: any) {
  const normalized = normalizeDoughComposition(dough);
  const items: string[] = [];

  if (normalized.salt) items.push("соль");
  if (normalized.sugar) items.push("сахар");
  if (normalized.fat) items.push("жиры");
  if (normalized.milk) items.push("молоко");
  if (normalized.eggs) items.push("яйца");

  return items;
}

const TechCard: React.FC<TechCardProps> = ({ profile, recipe, onBack }) => {
  const { roomTemp, climate, mixing } = useAppContext();
  const { preferment, finalDough, effectivePrefermentHours, fermentation } = recipe;

  const remaining = getRemainingIngredients(finalDough);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <button onClick={onBack} style={{ marginBottom: "16px" }}>
        ← Назад
      </button>

      {/* -------------------------------------------------- */}
      {/* 1. ПОДГОТОВКА СЫРЬЯ */}
      {/* -------------------------------------------------- */}
      <section style={{ marginBottom: "32px" }}>
        <h2>Подготовка сырья</h2>

        {profile.climateAdjustments?.[climate]?.comment && (
          <p>{profile.climateAdjustments[climate].comment}</p>
        )}

        {profile.mixingAdjustments?.[mixing]?.comment && (
          <p>{profile.mixingAdjustments[mixing].comment}</p>
        )}

        {profile.uiHints?.notesForBaker && (
          <ul>
            {profile.uiHints.notesForBaker.map((n: string, i: number) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        )}
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. АВТОЛИЗ */}
      {/* -------------------------------------------------- */}
      {profile.schedule.bulk.steps.some((s: ScheduleStep) => s.action === "Автолиз") && (
        <section style={{ marginBottom: "32px" }}>
          <h2>Автолиз</h2>
          <p>
            Мука + вода (без соли, сахара, жиров, молока и яиц).<br />
            Температура: <strong>{roomTemp}°C</strong><br />
            Время: <strong>20–40 минут</strong>
          </p>
        </section>
      )}

      {/* -------------------------------------------------- */}
      {/* 3. ДОБАВЛЕНИЕ ИНГРЕДИЕНТОВ */}
      {/* -------------------------------------------------- */}
      <section style={{ marginBottom: "32px" }}>
        <h2>Добавление ингредиентов</h2>

        {remaining.length > 0 ? (
          <p>
            Добавляем: <strong>{remaining.join(", ")}</strong>.<br />
            Замешиваем до средней клейковины.
          </p>
        ) : (
          <p>Нет ингредиентов, добавляемых после автолиза.</p>
        )}
      </section>

      {/* -------------------------------------------------- */}
      {/* 4. ПРЕДФЕРМЕНТ */}
      {/* -------------------------------------------------- */}
      {preferment.flour > 0 && (
        <section style={{ marginBottom: "32px" }}>
          <h2>Предфермент</h2>
          <p>
            Мука: <strong>{preferment.flour} г</strong><br />
            Вода: <strong>{preferment.water} г</strong><br />
            Дрожжи: <strong>{preferment.yeast} г</strong><br />
            Гидратация: <strong>{preferment.hydration}%</strong>
          </p>

          <p>
            Эквивалентное время ферментации:{" "}
            <strong>{formatTime(effectivePrefermentHours)}</strong>
          </p>

          {profile.preferment?.comment && (
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              {profile.preferment.comment}
            </p>
          )}
        </section>
      )}

      {/* -------------------------------------------------- */}
      {/* 5. ОСНОВНОЕ БРОЖЕНИЕ */}
      {/* -------------------------------------------------- */}
      <section style={{ marginBottom: "32px" }}>
        <h2>Основное брожение</h2>

        <p>
          Длительность:{" "}
          <strong>{formatTime(fermentation.bulkHours)}</strong><br />
          Температура: <strong>{roomTemp}°C</strong>
        </p>

        {profile.schedule.bulk.steps.map((step: ScheduleStep, i: number) => (
          <div key={i} style={{ marginTop: "8px" }}>
            <strong>{step.action}</strong> —{" "}
            {formatTime(step.timeFromStartMinutes / 60, "hhmm")}
            {step.comment && <div>{step.comment}</div>}
          </div>
        ))}
      </section>

      {/* -------------------------------------------------- */}
      {/* 6. ХОЛОДНАЯ ФЕРМЕНТАЦИЯ */}
      {/* -------------------------------------------------- */}
      {profile.schedule.coldRetard.enabled && (
        <section style={{ marginBottom: "32px" }}>
          <h2>Холодная ферментация</h2>

          <p>
            Длительность:{" "}
            <strong>{formatTime(profile.schedule.coldRetard.hours)}</strong><br />
            Температура: <strong>{profile.schedule.coldRetard.temperature}°C</strong>
          </p>

          {profile.schedule.coldRetard.comment && (
            <p>{profile.schedule.coldRetard.comment}</p>
          )}
        </section>
      )}

      {/* -------------------------------------------------- */}
      {/* 7. ФОРМОВКА */}
      {/* -------------------------------------------------- */}
      <section style={{ marginBottom: "32px" }}>
        <h2>Формовка</h2>
        <p>Сформировать изделие в соответствии с типом теста.</p>
      </section>

      {/* -------------------------------------------------- */}
      {/* 8. ФИНАЛЬНАЯ РАССТОЙКА */}
      {/* -------------------------------------------------- */}
      <section style={{ marginBottom: "32px" }}>
        <h2>Финальная расстойка</h2>

        <p>
          Длительность:{" "}
          <strong>{formatTime(fermentation.proofHours)}</strong><br />
          Температура: <strong>{roomTemp}°C</strong>
        </p>

        {profile.schedule.finalProof?.comment && (
          <p>{profile.schedule.finalProof.comment}</p>
        )}
      </section>

      {/* -------------------------------------------------- */}
      {/* 9. ВЫПЕЧКА */}
      {/* -------------------------------------------------- */}
      {profile.bake && (
        <section style={{ marginBottom: "32px" }}>
          <h2>Выпечка</h2>

          <p>
            Температура: <strong>{profile.bake.temperature}°C</strong><br />
            Время: <strong>{profile.bake.timeMinutes} минут</strong>
          </p>
        </section>
      )}

      {/* -------------------------------------------------- */}
      {/* 10. СОВЕТЫ ПЕКАРЮ */}
      {/* -------------------------------------------------- */}
      {profile.uiHints?.notesForBaker && (
        <section style={{ marginBottom: "32px" }}>
          <h2>Советы пекарю</h2>
          <ul>
            {profile.uiHints.notesForBaker.map((n: string, i: number) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default TechCard;
