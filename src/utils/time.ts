export function formatTime(hoursFloat: number, mode: "minutes" | "hhmm" = "minutes") {
  const hours = Math.floor(hoursFloat);
  const minutes = Math.round((hoursFloat - hours) * 60);

  if (mode === "minutes") {
    const totalMinutes = hours * 60 + minutes;
    return `${totalMinutes} мин`;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
