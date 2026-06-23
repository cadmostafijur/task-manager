"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AddTaskForm from "@/components/AddTaskForm";
import Sidebar from "@/components/Sidebar";
import StatCards from "@/components/StatCards";
import StatisticsPanel from "@/components/StatisticsPanel";
import TaskList from "@/components/TaskList";
import { CheckIcon, MenuIcon } from "@/components/icons/SidebarIcons";

const VIEW_HEADERS = {
  overview: {
    title: "Good things take time. 👋",
    subtitle: "Here's what's happening with your tasks today.",
  },
  all: {
    title: "All Tasks",
    subtitle: "View and manage every task in your workspace.",
  },
  today: {
    title: "Today's Tasks",
    subtitle: "Tasks you created today.",
  },
  categories: {
    title: "Categories",
    subtitle: "Your tasks grouped by status.",
  },
  statistics: {
    title: "Statistics",
    subtitle: "Track your productivity and task progress.",
  },
};

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("overview");
  const [taskFilter, setTaskFilter] = useState("ALL");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const formRef = useRef(null);
  const tasksRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch {
      console.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "TODO").length,
      inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      done: tasks.filter((t) => t.status === "DONE").length,
    }),
    [tasks]
  );

  function scrollToForm() {
    setMobileSidebarOpen(false);
    if (activeView === "statistics") {
      setActiveView("overview");
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      return;
    }
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToTasks() {
    tasksRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleViewChange(view) {
    setActiveView(view);
    setMobileSidebarOpen(false);

    if (view === "all") {
      setTaskFilter("ALL");
      setTimeout(scrollToTasks, 150);
    } else if (view === "overview") {
      setTaskFilter("ALL");
    } else if (view === "today" || view === "categories") {
      setTaskFilter("ALL");
      setTimeout(scrollToTasks, 150);
    }
  }

  const header = VIEW_HEADERS[activeView];
  const showForm = activeView === "overview" || activeView === "all";
  const showTaskList = activeView !== "statistics";
  const showStatsRow = true;

  return (
    <div className="flex min-h-screen bg-[#f5f6fa] dark:bg-slate-950">
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        onAddTask={scrollToForm}
      />

      <div className="relative z-0 flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200/80 bg-white px-4 py-4 lg:hidden dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white">
            <CheckIcon />
          </div>
          <div className="min-w-0 flex-1">
            <p className="ui-static-text truncate text-sm font-bold text-slate-900 dark:text-white">Task Manager</p>
            <p className="ui-static-text truncate text-xs text-slate-500 dark:text-slate-400">Stay organized, get more done</p>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="ui-static-text text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl dark:text-white">
              {header.title}
            </h1>
            <p className="ui-static-text mt-1 text-sm text-slate-500 sm:text-base dark:text-slate-400">{header.subtitle}</p>
          </div>

          {showStatsRow && (
            <div className="mb-6 sm:mb-8">
              <StatCards stats={stats} />
            </div>
          )}

          {activeView === "statistics" ? (
            <StatisticsPanel stats={stats} tasks={tasks} />
          ) : (
            <div
              className={`grid grid-cols-1 gap-6 ${
                showForm ? "xl:grid-cols-2" : ""
              }`}
            >
              {showForm && <AddTaskForm formRef={formRef} onTaskAdded={fetchTasks} />}
              {showTaskList && (
                <div ref={tasksRef} className={showForm ? "" : "xl:col-span-2"}>
                  <TaskList
                    tasks={tasks}
                    loading={loading}
                    onTaskUpdated={fetchTasks}
                    activeView={activeView}
                    filter={taskFilter}
                    onFilterChange={setTaskFilter}
                  />
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="border-t border-slate-200/60 bg-white/50 px-4 py-4 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="text-violet-400">Developed by Mostafijur Rahman</span>
            Make progress, one task at a time. @mostafijurdev
          </span>
        </footer>
      </div>
    </div>
  );
}
