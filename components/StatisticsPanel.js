import { getStatusLabel } from "@/lib/task-status";

export default function StatisticsPanel({ stats, tasks }) {
  const rows = [
    { key: "todo", label: "To Do", color: "bg-violet-500", count: stats.todo },
    { key: "inProgress", label: "In Progress", color: "bg-sky-500", count: stats.inProgress },
    { key: "done", label: "Done", color: "bg-emerald-500", count: stats.done },
  ];

  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Task breakdown</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Distribution by status</p>

        <div className="mt-6 space-y-5">
          {rows.map((row) => {
            const percent = stats.total > 0 ? Math.round((row.count / stats.total) * 100) : 0;
            return (
              <div key={row.key}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{row.label}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {row.count} ({percent}%)
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className={`h-full rounded-full transition-all ${row.color}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Completion rate</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">How much you&apos;ve finished</p>

        <div className="mt-8 flex flex-col items-center justify-center">
          <div className="relative flex h-36 w-36 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-700" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${completionRate * 2.64} 264`}
                className="text-emerald-500"
              />
            </svg>
            <span className="absolute text-3xl font-bold text-slate-900 dark:text-white">{completionRate}%</span>
          </div>
          <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
            {stats.done} of {stats.total} tasks completed
          </p>
        </div>

        {tasks.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-700">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Recent activity</p>
            <ul className="mt-3 space-y-2">
              {tasks.slice(0, 3).map((task) => (
                <li key={task.id} className="flex items-center justify-between text-sm">
                  <span className="truncate text-slate-700 dark:text-slate-300">{task.title}</span>
                  <span className="shrink-0 text-xs text-slate-400">{getStatusLabel(task.status)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
