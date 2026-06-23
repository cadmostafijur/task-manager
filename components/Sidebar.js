"use client";

import { NAV_ITEMS } from "@/lib/views";
import {
  CalendarIcon,
  ChartIcon,
  CheckIcon,
  ChevronIcon,
  ClipboardSmallIcon,
  CloseIcon,
  FolderIcon,
  GridIcon,
  ListIcon,
  MenuIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
} from "@/components/icons/SidebarIcons";

const iconMap = {
  overview: GridIcon,
  all: ListIcon,
  today: CalendarIcon,
  categories: FolderIcon,
  statistics: ChartIcon,
};

export default function Sidebar({
  activeView,
  onViewChange,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
  theme,
  onThemeChange,
  onAddTask,
}) {
  const sidebarContent = (
    <>
      <div className={`border-b border-slate-100 dark:border-slate-700 ${collapsed ? "px-3 py-4" : "px-5 py-5"}`}>
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
            <CheckIcon />
          </div>
          {!collapsed && (
            <div className="min-w-0 overflow-hidden">
              <h1 className="ui-static-text truncate text-base font-bold text-slate-900 dark:text-white">Task Manager</h1>
              <p className="ui-static-text truncate text-xs text-slate-500 dark:text-slate-400">Stay organized, get more done</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="mt-4 hidden w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 lg:flex dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <ChevronIcon direction="left" />
            Collapse sidebar
          </button>
        )}
      </div>

      <nav className={`flex-1 space-y-1 py-4 ${collapsed ? "px-2" : "px-3"}`}>
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.id];
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              title={collapsed ? item.label : undefined}
              onClick={() => onViewChange(item.id)}
              className={`flex w-full items-center rounded-xl text-sm font-medium transition ${
                collapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5"
              } ${
                isActive
                  ? "bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-white"
              }`}
            >
              <Icon className={isActive ? "text-violet-600 dark:text-violet-400" : "text-slate-400"} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="px-3 pb-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-violet-500 shadow-sm dark:bg-slate-700">
              <ClipboardSmallIcon />
            </div>
            <p className="ui-static-text text-sm font-semibold text-slate-800 dark:text-white">Plan your day</p>
            <p className="ui-static-text mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Add tasks and track your progress easily.
            </p>
            <button
              type="button"
              onClick={onAddTask}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 dark:shadow-violet-900/30"
            >
              <PlusIcon />
              Add New Task
            </button>
          </div>
        </div>
      )}

      {collapsed && (
        <div className="px-2 pb-3">
          <button
            type="button"
            title="Add New Task"
            onClick={onAddTask}
            className="flex w-full items-center justify-center rounded-xl bg-violet-600 p-3 text-white transition hover:bg-violet-700"
          >
            <PlusIcon />
          </button>
        </div>
      )}

      <div
        className={`flex items-center border-t border-slate-100 dark:border-slate-700 ${
          collapsed ? "flex-col gap-1 px-2 py-3" : "gap-2 px-4 py-4"
        }`}
      >
        <button
          type="button"
          title="Light mode"
          onClick={() => onThemeChange("light")}
          className={`rounded-lg p-2 transition ${
            theme === "light"
              ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40"
              : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          }`}
          aria-label="Light mode"
        >
          <SunIcon />
        </button>
        <button
          type="button"
          title="Dark mode"
          onClick={() => onThemeChange("dark")}
          className={`rounded-lg p-2 transition ${
            theme === "dark"
              ? "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300"
              : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          }`}
          aria-label="Dark mode"
        >
          <MoonIcon />
        </button>
        {collapsed && (
          <button
            type="button"
            title="Expand sidebar"
            onClick={onToggleCollapse}
            className="hidden rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 lg:block dark:hover:bg-slate-700"
          >
            <ChevronIcon direction="right" />
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-label="Close menu"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col overflow-hidden border-r border-slate-200/80 bg-white transition-transform duration-300 lg:hidden dark:border-slate-700 dark:bg-slate-900 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-end border-b border-slate-100 p-3 dark:border-slate-700">
          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Close sidebar"
          >
            <CloseIcon />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden shrink-0 flex-col overflow-hidden border-r border-slate-200/80 bg-white transition-[width] duration-300 lg:flex dark:border-slate-700 dark:bg-slate-900 ${
          collapsed ? "w-[72px]" : "w-[260px]"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
