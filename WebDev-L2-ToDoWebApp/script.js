(() => {
  "use strict";

  const STORAGE_KEY = "taskflow_oibsip_tasks_v1";
  const THEME_KEY = "taskflow_oibsip_theme_v1";
  const $ = (selector) => document.querySelector(selector);

  const elements = {
    form: $("#taskForm"), input: $("#taskInput"),
    pendingList: $("#pendingList"), completedList: $("#completedList"),
    pendingCount: $("#pendingCount"), completedCount: $("#completedCount"),
    totalStat: $("#totalStat"), pendingStat: $("#pendingStat"), completedStat: $("#completedStat"),
    completionFoot: $("#completionFoot"), allCount: $("#allCount"),
    navPendingCount: $("#navPendingCount"), navCompletedCount: $("#navCompletedCount"),
    allTasksNav: $("#allTasksNav"), pendingNav: $("#pendingNav"), completedNav: $("#completedNav"),
    breadcrumbCurrent: $("#breadcrumbCurrent"), sectionTitle: $("#sectionTitle"),
    focusAddButton: $("#focusAddButton"), clearCompletedButton: $("#clearCompletedButton"),
    themeToggle: $("#themeToggle"), todayLabel: $("#todayLabel"), greeting: $("#greeting"), toast: $("#toast")
  };

  let tasks = loadTasks();
  let activeFilter = "all";
  let toastTimeout;

  function loadTasks() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved.filter((task) =>
        task && typeof task.id === "string" && typeof task.text === "string" &&
        typeof task.completed === "boolean"
      ) : [];
    } catch (error) {
      console.warn("Could not load saved tasks:", error);
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      showToast("Unable to save tasks in this browser.");
      console.error("Could not save tasks:", error);
    }
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function makeId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function formatDate(isoDate) {
    if (!isoDate) return "Added just now";
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return "Added recently";
    return `Added ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })} at ${date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => elements.toast.classList.remove("show"), 2300);
  }

  function createEmptyState(title, message, icon) {
    return `<div class="empty-state"><span class="empty-icon">${icon}</span><div><strong>${title}</strong>${message}</div></div>`;
  }

  function taskMarkup(task) {
    const complete = task.completed;
    const completionMeta = complete && task.completedAt
      ? `Completed ${new Date(task.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
      : formatDate(task.createdAt);
    return `<article class="task-row ${complete ? "is-complete" : ""}" data-id="${escapeHTML(task.id)}">
      <button class="check-button" type="button" data-action="toggle" aria-label="${complete ? "Mark pending" : "Mark complete"}" title="${complete ? "Mark pending" : "Mark complete"}">${complete ? "✓" : ""}</button>
      <div class="task-main"><div class="task-text">${escapeHTML(task.text)}</div><div class="task-meta">${escapeHTML(completionMeta)}</div></div>
      <div class="task-actions">
        <button class="action-button" type="button" data-action="edit" aria-label="Edit task" title="Edit task">✎</button>
        <button class="action-button delete" type="button" data-action="delete" aria-label="Delete task" title="Delete task">×</button>
      </div>
    </article>`;
  }

  function renderList(container, list, emptyTitle, emptyMessage, icon) {
    container.innerHTML = list.length
      ? list.map(taskMarkup).join("")
      : createEmptyState(emptyTitle, emptyMessage, icon);
  }

  function render() {
    const pending = tasks.filter((task) => !task.completed);
    const completed = tasks.filter((task) => task.completed);
    const visiblePending = activeFilter === "completed" ? [] : pending;
    const visibleCompleted = activeFilter === "pending" ? [] : completed;

    renderList(elements.pendingList, visiblePending,
      activeFilter === "completed" ? "Pending tasks are hidden" : "You’re all caught up",
      activeFilter === "completed" ? "Switch to All tasks or Pending to see them." : "Add a task above and it will show up here.",
      "✦");
    renderList(elements.completedList, visibleCompleted,
      activeFilter === "pending" ? "Completed tasks are hidden" : "No completed tasks yet",
      activeFilter === "pending" ? "Switch to All tasks or Completed to see them." : "Finished tasks will be collected here. Keep going!",
      "✓");

    elements.totalStat.textContent = tasks.length;
    elements.pendingStat.textContent = pending.length;
    elements.completedStat.textContent = completed.length;
    elements.pendingCount.textContent = `${pending.length} pending`;
    elements.completedCount.textContent = `${completed.length} completed`;
    elements.allCount.textContent = tasks.length;
    elements.navPendingCount.textContent = pending.length;
    elements.navCompletedCount.textContent = completed.length;
    elements.completionFoot.textContent = tasks.length
      ? `${Math.round((completed.length / tasks.length) * 100)}% of tasks completed`
      : "Every win counts";
    elements.clearCompletedButton.hidden = completed.length === 0;

    const filterNames = { all: "All tasks", pending: "Pending", completed: "Completed" };
    elements.breadcrumbCurrent.textContent = filterNames[activeFilter];
    elements.sectionTitle.textContent = activeFilter === "all" ? "Your tasks" : `${filterNames[activeFilter]} tasks`;
    [elements.allTasksNav, elements.pendingNav, elements.completedNav].forEach((button) => button.classList.remove("active"));
    ({ all: elements.allTasksNav, pending: elements.pendingNav, completed: elements.completedNav })[activeFilter].classList.add("active");
  }

  function addTask(text) {
    const cleanText = text.trim();
    if (!cleanText) {
      showToast("Please enter a task first.");
      elements.input.focus();
      return;
    }
    tasks.unshift({ id: makeId(), text: cleanText, completed: false, createdAt: new Date().toISOString(), completedAt: null });
    saveTasks();
    activeFilter = "all";
    render();
    elements.input.value = "";
    elements.input.focus();
    showToast("Task added to your list.");
  }

  function findTask(id) {
    return tasks.find((task) => task.id === id);
  }

  function handleTaskAction(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const row = button.closest(".task-row");
    if (!row) return;
    const task = findTask(row.dataset.id);
    if (!task) return;

    switch (button.dataset.action) {
      case "toggle":
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        saveTasks();
        render();
        showToast(task.completed ? "Nice work — task completed!" : "Task moved back to pending.");
        break;
      case "edit": {
        const updated = window.prompt("Edit your task:", task.text);
        if (updated === null) return;
        if (!updated.trim()) {
          showToast("Task text cannot be empty.");
          return;
        }
        task.text = updated.trim();
        saveTasks();
        render();
        showToast("Task updated.");
        break;
      }
      case "delete":
        if (!window.confirm(`Delete “${task.text}”? This cannot be undone.`)) return;
        tasks = tasks.filter((item) => item.id !== task.id);
        saveTasks();
        render();
        showToast("Task deleted.");
        break;
    }
  }

  function setFilter(filter) {
    activeFilter = filter;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setTheme(theme) {
    document.body.classList.toggle("dark", theme === "dark");
    elements.themeToggle.textContent = theme === "dark" ? "☾" : "☼";
    elements.themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) { /* Theme still works for this session. */ }
  }

  function initializeDate() {
    const now = new Date();
    elements.todayLabel.textContent = now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    const hour = now.getHours();
    elements.greeting.textContent = hour < 12 ? "GOOD MORNING — YOUR DAY, YOUR PACE"
      : hour < 17 ? "GOOD AFTERNOON — YOUR DAY, YOUR PACE"
      : "GOOD EVENING — YOUR DAY, YOUR PACE";
  }

  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    addTask(elements.input.value);
  });
  elements.pendingList.addEventListener("click", handleTaskAction);
  elements.completedList.addEventListener("click", handleTaskAction);
  elements.focusAddButton.addEventListener("click", () => {
    elements.input.focus();
    document.querySelector(".add-form").scrollIntoView({ behavior: "smooth", block: "center" });
  });
  elements.allTasksNav.addEventListener("click", () => setFilter("all"));
  elements.pendingNav.addEventListener("click", () => setFilter("pending"));
  elements.completedNav.addEventListener("click", () => setFilter("completed"));
  elements.clearCompletedButton.addEventListener("click", () => {
    const count = tasks.filter((task) => task.completed).length;
    if (!count) return;
    if (!window.confirm(`Permanently delete all ${count} completed task(s)?`)) return;
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    render();
    showToast("Completed tasks cleared.");
  });
  elements.themeToggle.addEventListener("click", () => {
    setTheme(document.body.classList.contains("dark") ? "light" : "dark");
  });

  let savedTheme = "light";
  try { savedTheme = localStorage.getItem(THEME_KEY) || "light"; } catch (_) { /* Use default theme. */ }
  setTheme(savedTheme);
  initializeDate();
  render();
})();
