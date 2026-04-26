(function () {
  const STORAGE_KEY = "assignment4a_tasks";
  let tasks = [];

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function loadTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
  }

  function updateStats() {
    const total = tasks.length;
    const done = tasks.filter((task) => task.done).length;
    const pending = total - done;

    $("#totalCount").text(total);
    $("#doneCount").text(done);
    $("#pendingCount").text(pending);
  }

  function taskItemTemplate(task) {
    const titleClass = task.done ? "task-title done" : "task-title";
    const toggleLabel = task.done ? "Undo" : "Done";

    return `
      <li>
        <div class="task-main">
          <div>
            <div class="${titleClass}">${task.text}</div>
            <span class="priority-tag priority-${task.priority}">${task.priority}</span>
          </div>
          <div class="task-actions">
            <button class="ui-btn ui-mini ui-corner-all ui-btn-inline ui-btn-b toggle-btn" data-id="${task.id}">${toggleLabel}</button>
            <button class="ui-btn ui-mini ui-corner-all ui-btn-inline ui-btn-a delete-btn" data-id="${task.id}">Delete</button>
          </div>
        </div>
      </li>
    `;
  }

  function renderTasks() {
    const html = tasks
      .slice()
      .sort((a, b) => Number(a.done) - Number(b.done))
      .map(taskItemTemplate)
      .join("");

    const $list = $("#taskList");
    $list.html(html || '<li><p>No tasks yet. Add your first one.</p></li>');
    $list.listview("refresh");
    updateStats();
  }

  function addTask(text, priority) {
    tasks.unshift({
      id: Date.now().toString(),
      text,
      priority,
      done: false,
    });
    saveTasks();
    renderTasks();
  }

  function toggleTask(id) {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    saveTasks();
    renderTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
  }

  function clearDoneTasks() {
    tasks = tasks.filter((task) => !task.done);
    saveTasks();
    renderTasks();
  }

  $(document).on("pagecreate", "#home", function () {
    loadTasks();
    renderTasks();

    $("#taskForm").on("submit", function (event) {
      event.preventDefault();
      const text = $("#taskText").val().toString().trim();
      const priority = $("#taskPriority").val();

      if (!text) {
        return;
      }

      addTask(text, priority);
      $("#taskText").val("");
    });

    $(document).on("click", ".toggle-btn", function () {
      toggleTask($(this).data("id"));
    });

    $(document).on("click", ".delete-btn", function () {
      deleteTask($(this).data("id"));
    });

    $("#clearDoneBtn").on("click", function (event) {
      event.preventDefault();
      clearDoneTasks();
    });
  });
})();
