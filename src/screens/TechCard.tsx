import React from "react";
import { useAppContext } from "../context/AppContext";

type TechCardProps = {
  profile: any;
  recipe: {
    preferment: {
      flour: number;
      water: number;
      milk?: number;
      yeast: number;
      hydration: number;
    };
    finalDough: {
      flour: number;
      water: number;
      milk: number;
      salt: number;
      sugar: number;
      fat: number;
      eggs: number;
      yeast: number;
      hydration: number;
    };
    effectivePrefermentHours: number;
    fermentation: {
      bulkHours: number;
      proofHours: number;
      totalHours: number;
      notes: string[];
    };
    total: number;
  };
  onBack: () => void;
};

// -----------------------------
// Форматирование времени
// -----------------------------
function formatTime(hoursFloat: number) {
  const hours = Math.floor(hoursFloat);
  const minutes = Math.round((hoursFloat - hours) * 60);

  if (hoursFloat < 2) {
    return `${hours * 60 + minutes} мин`;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

// -----------------------------
// Универсальный блок
// -----------------------------
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section style={{ marginBottom: "32px" }}>
    <h2 style={{ marginBottom: "12px" }}>{title}</h2>
    {children}
  </section>
);

// -----------------------------
// Таблица ингредиентов
// -----------------------------
const Table: React.FC<{ rows: { label: string; value: any }[] }> = ({ rows }) => (
  <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <tbody>
      {rows
        .filter((r) => r.value !== 0 && r.value !== null && r.value !== undefined)
        .map((row, i) => (
          <tr key={i}>
            <td style={{ padding: "4px 0", width: "60%" }}>{row.label}</td>
            <td style={{ padding: "4px 0", fontWeight: 600 }}>{row.value}</td>
          </tr>
        ))}
    </tbody>
  </table>
);

const TechCard: React.FC<TechCardProps> = ({ profile, recipe, onBack }) => {
  const { climate, mixing, roomTemp } = useAppContext();
  const { preferment, finalDough, effectivePrefermentHours, fermentation, total } =
    recipe;

  const totalPreferment =
    preferment.flour + preferment.water + (preferment.milk || 0) + preferment.yeast;

  const totalFinal =
    finalDough.flour +
    finalDough.water +
    finalDough.milk +
    finalDough.salt +
    finalDough.sugar +
    finalDough.fat +
    finalDough.eggs * 50 +
    finalDough.yeast;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <button onClick={onBack} style={{ marginBottom: "16px" }}>
        ← Назад
      </button>

      {/* -------------------------------------------------- */}
      {/* 1. Заголовок */}
      {/* -------------------------------------------------- */}
      <h1 style={{ marginBottom: "24px" }}>{profile.name}</h1>

      <Section title="Условия">
        <Table
          rows={[
            { label: "Климат", value: climate },
            { label: "Замес", value: mixing },
            { label: "Температура помещения", value: `${roomTemp}°C` },
          ]}
        />
      </Section>

      {/* -------------------------------------------------- */}
      {/* 2. Состав теста */}
      {/* -------------------------------------------------- */}
      <Section title="Состав теста">
        <h3>Предфермент</h3>
        <Table
          rows={[
            { label: "Мука", value: `${preferment.flour} г` },
            { label: "Вода", value: `${preferment.water} г` },
            { label: "Молоко", value: preferment.milk ? `${preferment.milk} г` : null },
            { label: "Дрожжи", value: `${preferment.yeast} г` },
            { label: "Гидратация", value: `${preferment.hydration}%` },
            {
              label: "Эквивалентное время ферментации",
              value: formatTime(effectivePrefermentHours),
            },
          ]}
        />

        <h3 style={{ marginTop: "24px" }}>Основное тесто</h3>
        <Table
          rows={[
            { label: "Мука", value: `${finalDough.flour} г` },
            { label: "Вода", value: `${finalDough.water} г` },
            { label: "Молоко", value: finalDough.milk ? `${finalDough.milk} г` : null },
            { label: "Соль", value: `${finalDough.salt} г` },
            { label: "Сахар", value: `${finalDough.sugar} г` },
            { label: "Жиры", value: `${finalDough.fat} г` },
            { label: "Яйца", value: `${finalDough.eggs} шт` },
            { label: "Дрожжи", value: `${finalDough.yeast} г` },
            { label: "Гидратация", value: `${finalDough.hydration}%` },
          ]}
        />

        <h3 style={{ marginTop: "24px" }}>Итог</h3>
        <Table
          rows={[
            { label: "Масса предфермента", value: `${totalPreferment} г` },
            { label: "Масса финального теста", value: `${totalFinal} г` },
            { label: "Общая масса", value: `${total} г` },
          ]}
        />
      </Section>

      {/* -------------------------------------------------- */}
      {/* 3. Технологический процесс */}
      {/* -------------------------------------------------- */}
      <Section title="Технологический процесс">
        <h3>Подготовка сырья</h3>
        {profile.uiHints?.notesForBaker && (
          <ul>
            {profile.uiHints.notesForBaker.map((n: string, i: number) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        )}

        {profile.climateAdjustments?.[climate]?.comment && (
          <p>{profile.climateAdjustments[climate].comment}</p>
        )}

        {profile.mixingAdjustments?.[mixing]?.comment && (
          <p>{profile.mixingAdjustments[mixing].comment}</p>
        )}

        {profile.schedule.autolyse?.enabled && (
          <>
            <h3 style={{ marginTop: "24px" }}>Автолиз</h3>
            <p>
              Время: <strong>{profile.schedule.autolyse.minutes} мин</strong>
              <br />
              Температура: <strong>{roomTemp}°C</strong>
            </p>
          </>
        )}

        <h3 style={{ marginTop: "24px" }}>Основное брожение</h3>
        <p>
          Длительность: <strong>{formatTime(fermentation.bulkHours)}</strong>
          <br />
          Температура: <strong>{roomTemp}°C</strong>
        </p>

        {profile.schedule.bulk.steps.map((step: any, i: number) => (
          <div key={i} style={{ marginTop: "8px" }}>
            <strong>{step.action}</strong> — {formatTime(step.timeFromStartMinutes / 60)}
            {step.comment && <div>{step.comment}</div>}
          </div>
        ))}

        {profile.schedule.coldRetard?.enabled && (
          <>
            <h3 style={{ marginTop: "24px" }}>Холодная ферментация</h3>
            <p>
              Длительность:{" "}
              <strong>{formatTime(profile.schedule.coldRetard.hours)}</strong>
              <br />
              Температура:{" "}
              <strong>{profile.schedule.coldRetard.temperature}°C</strong>
            </p>
            {profile.schedule.coldRetard.comment && (
              <p>{profile.schedule.coldRetard.comment}</p>
            )}
          </>
        )}

        <h3 style={{ marginTop: "24px" }}>Финальная расстойка</h3>
        <p>
          Длительность: <strong>{formatTime(fermentation.proofHours)}</strong>
          <br />
          Температура: <strong>{roomTemp}°C</strong>
        </p>

        {profile.schedule.finalProof?.comment && (
          <p>{profile.schedule.finalProof.comment}</p>
        )}

        {profile.bake && (
          <>
            <h3 style={{ marginTop: "24px" }}>Выпечка</h3>
            <p>
              Температура: <strong>{profile.bake.temperature}°C</strong>
              <br />
              Время: <strong>{profile.bake.timeMinutes} мин</strong>
            </p>
          </>
        )}
      </Section>
    </div>
  );
};

export default TechCard;
