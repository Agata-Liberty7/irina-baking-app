import React from "react";

type Props = {
  name: string;
  recipe: any;
  profile: any;
  conditions: any;
  onBack: () => void;
};

// Универсальная таблица
const Table: React.FC<{ rows: { label: string; value: any }[] }> = ({ rows }) => (
  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
    <tbody>
      {rows
        .filter((r) => r.value !== null && r.value !== undefined && r.value !== 0)
        .map((row, i) => (
          <tr key={i}>
            <td style={{ padding: "4px 0", width: "60%" }}>{row.label}</td>
            <td style={{ padding: "4px 0", fontWeight: 600 }}>{row.value}</td>
          </tr>
        ))}
    </tbody>
  </table>
);

// Универсальная секция
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section style={{ marginBottom: "32px" }}>
    <h2 style={{ marginBottom: "12px" }}>{title}</h2>
    {children}
  </section>
);

const CustomRecipeView: React.FC<Props> = ({
  name,
  recipe,
  profile,
  conditions,
  onBack,
}) => {
  if (!recipe) {
    return (
      <div style={{ padding: 24 }}>
        <h1>{name}</h1>
        <p>Ошибка: рецепт повреждён или пуст.</p>
        <button onClick={onBack}>← Назад</button>
      </div>
    );
  }

  const {
    preferment,
    finalDough,
    effectivePrefermentHours,
    fermentation,
    total,
  } = recipe;

  const totalPreferment =
    (preferment?.flour || 0) +
    (preferment?.water || 0) +
    (preferment?.milk || 0) +
    (preferment?.yeast || 0);

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
      <h1 style={{ marginBottom: "24px" }}>{name}</h1>

      {/* -------------------------------------------------- */}
      {/* УСЛОВИЯ ПРОИЗВОДСТВА */}
      {/* -------------------------------------------------- */}
      <Section title="Условия производства">
        <Table
          rows={[
            { label: "Климат", value: conditions.climate },
            { label: "Замес", value: conditions.mixing },
            { label: "Режим", value: conditions.productionMode },
            { label: "Температура помещения", value: `${conditions.roomTemp}°C` },
            {
              label: "Тёплая ферментация",
              value: `${conditions.warmFermentationHours} ч`,
            },
            {
              label: "Холодная ферментация",
              value: `${conditions.coldFermentationHours} ч`,
            },
          ]}
        />
      </Section>

      {/* -------------------------------------------------- */}
      {/* ПРЕДФЕРМЕНТ */}
      {/* -------------------------------------------------- */}
      {preferment && preferment.flour > 0 && (
        <Section title={`Предфермент (${preferment.type || "не указан"})`}>
          <Table
            rows={[
              { label: "Мука", value: `${preferment.flour} г` },
              { label: "Вода", value: `${preferment.water} г` },
              { label: "Молоко", value: preferment.milk ? `${preferment.milk} г` : null },
              { label: "Дрожжи", value: `${preferment.yeast} г` },
              { label: "Гидратация", value: `${preferment.hydration}%` },
              {
                label: "Ферментация",
                value: `${effectivePrefermentHours} ч`,
              },
            ]}
          />
        </Section>
      )}

      {/* -------------------------------------------------- */}
      {/* ОСНОВНОЕ ТЕСТО */}
      {/* -------------------------------------------------- */}
      <Section title="Основное тесто">
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
      </Section>

      {/* -------------------------------------------------- */}
      {/* ФЕРМЕНТАЦИЯ */}
      {/* -------------------------------------------------- */}
      <Section title="Ферментация">
        <Table
          rows={[
            { label: "Общая ферментация", value: `${fermentation.totalHours} ч` },
            { label: "Тёплая", value: `${fermentation.warmHours} ч` },
            { label: "Холодная", value: `${fermentation.coldHours} ч` },
          ]}
        />
      </Section>

      {/* -------------------------------------------------- */}
      {/* ИТОГ */}
      {/* -------------------------------------------------- */}
      <Section title="Итоговая масса">
        <Table
          rows={[
            { label: "Предфермент", value: `${totalPreferment} г` },
            { label: "Финальное тесто", value: `${totalFinal} г` },
            { label: "Общая масса", value: `${total} г` },
          ]}
        />
      </Section>

      <div style={{ marginTop: "32px" }}>
        <button onClick={onBack}>← Назад</button>
      </div>
    </div>
  );
};

export default CustomRecipeView;
