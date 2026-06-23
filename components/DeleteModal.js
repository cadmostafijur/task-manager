"use client";

export default function DeleteModal({ open, taskTitle, onConfirm, onCancel, deleting }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-label="Close dialog"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
          <TrashIcon />
        </div>
        <h2 id="delete-modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">
          Delete task?
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Are you sure you want to delete{" "}
          <span className="font-medium text-slate-700 dark:text-slate-200">
            &quot;{taskTitle}&quot;
          </span>
          ? This action cannot be undone.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 4h12M5.5 4V3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1M6.5 7v4M9.5 7v4M3.5 4l.5 9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l.5-9"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
