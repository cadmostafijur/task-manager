const cards = [
  {
    label: "Total Tasks",
    key: "total",
    icon: ClipboardIcon,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    chartColor: "#8b5cf6",
    chartPath: "M0 20 L8 14 L14 16 L28 6 L40 10",
  },
  {
    label: "To Do",
    key: "todo",
    icon: ClockIcon,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    chartColor: "#38bdf8",
    chartPath: "M0 18 L10 12 L18 14 L28 8 L40 12",
  },
  {
    label: "In Progress",
    key: "inProgress",
    icon: HourglassIcon,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    chartColor: "#fb923c",
    chartPath: "M0 16 L12 10 L20 14 L32 6 L40 14",
  },
  {
    label: "Done",
    key: "done",
    icon: CheckCircleIcon,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    chartColor: "#34d399",
    chartPath: "M0 20 L10 8 L18 12 L28 4 L40 8",
  },
];

export default function StatCards({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="ui-static-text text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{stats[card.key]}</p>
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}>
              <card.icon className={card.iconColor} />
            </div>
          </div>
          <svg viewBox="0 0 40 24" className="mt-4 h-8 w-full" preserveAspectRatio="none" aria-hidden="true">
            <path
              d={card.chartPath}
              fill="none"
              stroke={card.chartColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}

function ClipboardIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7 4H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7" y="2" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ClockIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function HourglassIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 3h10M5 17h10M7 3v3l3 4-3 4v3M13 3v3l-3 4 3 4v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckCircleIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
