function Task(title, completed, onChange) {
    this.title = ko.observable(title);
    this.completed = ko.observable(completed || false);

    if (onChange) {
        this.completed.subscribe(onChange);
    }
}

function TaskViewModel() {
    const self = this;

    self.newTask = ko.observable("");
    self.tasks = ko.observableArray([]);
    self.filter = ko.observable("all");

    self.addTask = function () {
        const text = self.newTask().trim();
        if (!text) return;

        self.tasks.push(new Task(text, false, self.saveTasks));
        self.newTask("");
        self.saveTasks();
    };

    self.removeTask = function (task) {
        self.tasks.remove(task);
        self.saveTasks();
    };

    self.completedCount = ko.computed(() =>
        self.tasks().filter(t => t.completed()).length
    );

    self.filteredTasks = ko.computed(function () {
        if (self.filter() === "active")
            return self.tasks().filter(t => !t.completed());
        if (self.filter() === "completed")
            return self.tasks().filter(t => t.completed());
        return self.tasks();
    });

    self.saveTasks = function () {
        localStorage.setItem("tasks", JSON.stringify(ko.toJS(self.tasks)));
    };

    self.loadTasks = function () {
        const data = JSON.parse(localStorage.getItem("tasks")) || [];
        data.forEach(t =>
            self.tasks.push(new Task(t.title, t.completed, self.saveTasks))
        );
    };

    self.loadTasks();
}

ko.applyBindings(new TaskViewModel());
