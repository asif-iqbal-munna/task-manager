export const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const day = d.getDate();
  return `${month} ${day}`;
};

export const formatDateRangeFilter = (start: string, end: string) => {
  return start && end
    ? `${formatDate(start)} - ${formatDate(end)}`
    : start
    ? `From ${formatDate(start)}`
    : `Until ${formatDate(end)}`;
};
