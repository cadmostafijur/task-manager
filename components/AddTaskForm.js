"use client";

import { useState } from "react";
import { TASK_STATUSES, statusStyles } from "@/lib/task-status";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-violet-900";

export default function AddTaskForm({ onTaskAdded, formRef }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, status }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add task");
        return;
      }

      setTitle("");
      setDescription("");
      setStatus("TODO");
      onTaskAdded?.();
    } catch {
      setError("Failed to add task");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      ref={formRef}
      className="h-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-200 dark:shadow-violet-900/30">
          <PlusIcon />
        </div>
        <div>
          <h2 className="ui-static-text text-base font-semibold text-slate-900 dark:text-white">Add New Task</h2>
          <p className="ui-static-text text-sm text-slate-500 dark:text-slate-400">Create a task and set its status</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="title" className="ui-static-text mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
            placeholder="e.g. Review pull request"
          />
        </div>

        <div>
          <label htmlFor="description" className="ui-static-text mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Description <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="Add more details about this task..."
          />
        </div>

        <div>
          <span className="ui-static-text mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
          <div className="flex flex-wrap gap-2">
            {TASK_STATUSES.map((s) => {
              const styles = statusStyles[s.value];
              const selected = status === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selected ? styles.pill : styles.pillIdle
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CirclePlusIcon />
          {submitting ? "Adding task..." : "Add Task"}
        </button>
      </form>
    </section>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CirclePlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 6v6M6 9h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
