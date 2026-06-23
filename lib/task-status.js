export const TASK_STATUSES = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

export function isValidStatus(status) {
  return TASK_STATUSES.some((s) => s.value === status);
}

export function getStatusLabel(status) {
  return TASK_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export const statusStyles = {
  TODO: {
    badge: "bg-violet-100 text-violet-700",
    dot: "bg-violet-500",
    border: "border-l-violet-500",
    ring: "ring-violet-200",
    icon: "text-violet-600",
    chart: "#8b5cf6",
    pill: "bg-violet-600 text-white",
    pillIdle: "bg-violet-100 text-violet-700 hover:bg-violet-200",
  },
  IN_PROGRESS: {
    badge: "bg-sky-100 text-sky-700",
    dot: "bg-sky-500",
    border: "border-l-sky-500",
    ring: "ring-sky-200",
    icon: "text-sky-600",
    chart: "#38bdf8",
    pill: "bg-sky-600 text-white",
    pillIdle: "bg-sky-100 text-sky-700 hover:bg-sky-200",
  },
  DONE: {
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-l-emerald-500",
    ring: "ring-emerald-200",
    icon: "text-emerald-600",
    chart: "#34d399",
    pill: "bg-emerald-600 text-white",
    pillIdle: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
  },
};

export function formatTaskDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
