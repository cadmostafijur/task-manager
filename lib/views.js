export const NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "all", label: "All Tasks" },
  { id: "today", label: "Today" },
  { id: "categories", label: "Categories" },
  { id: "statistics", label: "Statistics" },
];

export function isToday(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
