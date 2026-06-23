"use client";

import { useMemo, useState } from "react";
import DeleteModal from "@/components/DeleteModal";
import { isToday } from "@/lib/views";
import {
  TASK_STATUSES,
  formatTaskDate,
  getStatusLabel,
  statusStyles,
} from "@/lib/task-status";

const FILTERS = [
  { value: "ALL", label: "All Tasks" },
  ...TASK_STATUSES,
];

export default function TaskList({
  tasks,
  loading,
  onTaskUpdated,
  activeView = "overview",
  filter: externalFilter,
  onFilterChange,
}) {
  const [internalFilter, setInternalFilter] = useState("ALL");
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filter = externalFilter ?? internalFilter;
  const setFilter = onFilterChange ?? setInternalFilter;

  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (activeView === "today") {
      result = result.filter((t) => isToday(t.createdAt));
    } else if (filter !== "ALL") {
      result = result.filter((t) => t.status === filter);
    }

    return result;
  }, [tasks, filter, activeView]);

  const groupByStatus = activeView === "categories";

  async function handleStatusChange(taskId, status) {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setEditingId(null);
      onTaskUpdated?.();
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setEditingId(null);
        setDeleteTarget(null);
        onTaskUpdated?.();
      }
    } finally {
      setDeleting(false);
    }
  }

  const sectionTitle = {
    overview: "Your Tasks",
    all: "All Tasks",
    today: "Today's Tasks",
    categories: "Tasks by Category",
    statistics: "Your Tasks",
  }[activeView];

  const sectionSubtitle = {
    overview: "Manage and track your tasks",
    all: "Every task in your workspace",
    today: "Tasks created today",
    categories: "Grouped by status",
    statistics: "Manage and track your tasks",
  }[activeView];

  if (loading) {
    return (
      <section className="h-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-6 w-32 skeleton rounded-lg" />
          <div className="h-9 w-28 skeleton rounded-lg" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[88px] skeleton rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-5 space-y-3">
          <div className="min-w-0">
            <h2 className="ui-static-text text-base font-semibold text-slate-900 dark:text-white">
              {sectionTitle}
            </h2>
            <p className="ui-static-text mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {sectionSubtitle}
            </p>
          </div>

          {activeView !== "today" && activeView !== "categories" && (
            <div className="w-full sm:ml-auto sm:w-auto sm:shrink-0">
              <label htmlFor="task-filter" className="ui-static-text mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Filter
              </label>
              <select
                id="task-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-100 sm:min-w-40 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:ring-violet-900"
              >
                {FILTERS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {filteredTasks.length === 0 ? (
          <EmptyState hasTasks={tasks.length > 0} activeView={activeView} />
        ) : groupByStatus ? (
          <div className="space-y-6">
            {TASK_STATUSES.map((status) => {
              const group = filteredTasks.filter((t) => t.status === status.value);
              if (group.length === 0) return null;
              return (
                <div key={status.value}>
                  <h3 className="ui-static-text mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {status.label} ({group.length})
                  </h3>
                  <ul className="space-y-3">
                    {group.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        isEditing={editingId === task.id}
                        onEdit={() => setEditingId(editingId === task.id ? null : task.id)}
                        onDelete={() => setDeleteTarget({ id: task.id, title: task.title })}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isEditing={editingId === task.id}
                onEdit={() => setEditingId(editingId === task.id ? null : task.id)}
                onDelete={() => setDeleteTarget({ id: task.id, title: task.title })}
                onStatusChange={handleStatusChange}
              />
            ))}
          </ul>
        )}

        <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
          <span className="ui-static-text text-slate-500 dark:text-slate-400">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </span>
          {filter !== "ALL" && activeView !== "today" && activeView !== "categories" && (
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
            >
              View all tasks →
            </button>
          )}
        </div>
      </section>

      <DeleteModal
        open={!!deleteTarget}
        taskTitle={deleteTarget?.title ?? ""}
        deleting={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </>
  );
}

function TaskItem({ task, isEditing, onEdit, onDelete, onStatusChange }) {
  const styles = statusStyles[task.status];

  return (
    <li
      className={`rounded-xl border border-slate-100 border-l-4 bg-slate-50/50 p-3 transition hover:bg-white hover:shadow-sm sm:p-4 dark:border-slate-700 dark:bg-slate-700/30 dark:hover:bg-slate-700/60 ${styles.border}`}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${styles.dot.replace("bg-", "border-")}`} />

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white">{task.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${styles.badge}`}>
              {getStatusLabel(task.status)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <CalendarIcon />
              {formatTaskDate(task.createdAt)}
            </span>
          </div>
          {task.description && (
            <p className="mt-2 text-sm text-slate-500 line-clamp-2 dark:text-slate-400">{task.description}</p>
          )}

          {isEditing && (
            <div className="mt-3 flex flex-wrap gap-2">
              {TASK_STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onStatusChange(task.id, s.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    task.status === s.value
                      ? statusStyles[s.value].pill
                      : statusStyles[s.value].pillIdle
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/30"
            aria-label={`Edit ${task.title}`}
          >
            <PencilIcon />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30"
            aria-label={`Delete ${task.title}`}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </li>
  );
}

function EmptyState({ hasTasks, activeView }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-700">
        <ClipboardIcon />
      </div>
      <p className="ui-static-text font-medium text-slate-800 dark:text-white">No tasks found</p>
      <p className="ui-static-text mt-1 text-sm text-slate-500 dark:text-slate-400">
        {!hasTasks
          ? "Add your first task to get started."
          : activeView === "today"
            ? "No tasks created today."
            : "Try a different filter."}
      </p>
    </div>
  );
}

function ClipboardIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1" />
      <path d="M1 5h10M3.5 1v2M8.5 1v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M11.5 2.5l2 2L5 13H3v-2l8.5-8.5z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 4h12M5.5 4V3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1M6.5 7v4M9.5 7v4M3.5 4l.5 9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l.5-9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
