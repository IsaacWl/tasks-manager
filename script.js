class TaskManager {
  constructor() {
    this.tasksContainer = document.querySelector('#tasks');
    this.addTaskButton = document.querySelector('#addBtn');
    this.cancelEditButton = document.querySelector('#cancelBtn');
    this.editTaskButton = document.querySelector('#editBtn');
    this.taskField = document.querySelector('#field');
    this.editButtons = []; // toggle visibility
    this.editMode = false;
    this.editId = null;
    this.event = null;
    this.task = null;
    this.tasks = this.getTasks() || [];
  }

  start() {
    this.generateLists();
    this.events();
  }

  events() {
    this.taskField.addEventListener('change', (ev) => this.handleChange(ev));
    this.cancelEditButton.addEventListener('click', (ev) =>
      this.cancelEdit(ev)
    );
    this.addTaskButton.addEventListener('click', () => this.addTask());
  }

  handleChange(ev) {
    this.value = ev.target.value;
    this.event = ev;
  }

  addTask() {
    if (!this.value || !this.value.trim()) return;

    const task = {
      id: this.tasks.length + 1,
      task: this.value,
      completed: false,
    };

    this.setTask(task);

    const li = this.createLi(task);
    this.addToContainer(li);

    this.value = '';
    this.event.target.value = '';
  }

  editTask(ev) {
    this.editMode = true;
    this.editId = ev.target.dataset.id;
    this.taskField.value = this.editId;

    this.addTaskButton.classList.toggle('none');
    this.cancelEditButton.classList.toggle('none');
    this.editTaskButton.classList.toggle('none');

    this.editButtons.forEach((button) => {
      button.classList.add('none');
    });
  }

  cancelEdit() {
    this.editMode = false;
    this.editId = null;
    this.taskField.value = '';

    this.addTaskButton.classList.toggle('none');
    this.cancelEditButton.classList.toggle('none');
    this.editTaskButton.classList.toggle('none');

    this.editButtons.forEach((button) => {
      button.classList.remove('none');
    });
  }

  createLi(task) {
    const li = document.createElement('li');
    const field = document.createElement('input');
    const div = document.createElement('div');
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    li.setAttribute('data-id', task.id);
    li.classList.add('d-flex', 'gap-1', 'align-center');

    field.setAttribute('type', 'checkbox');
    field.addEventListener('change', (ev) => this.toggleComplete(ev));
    field.setAttribute('data-id', task.id);
    field.checked = task.completed;

    div.textContent = task.task;

    editButton.setAttribute('data-id', task.id);
    editButton.addEventListener('click', (ev) => this.editTask(ev));
    editButton.textContent = 'Edit';
    editButton.classList.add('right', 'btn', 'btn-sm');
    this.editButtons.push(editButton);

    deleteButton.setAttribute('data-id', task.id);
    deleteButton.textContent = 'Remove';
    deleteButton.classList.add(
      'right',
      'btn',
      'btn-sm',
      `${!task.completed && 'none'}`
    );
    deleteButton.id = `deleteButton${task.id}`;
    deleteButton.addEventListener('click', (ev) => this.removeTask(ev));

    li.appendChild(field);
    li.appendChild(div);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    return li;
  }

  addToContainer(element) {
    this.tasksContainer.appendChild(element);
  }

  generateLists() {
    if (!this.tasks.length) return;
    this.tasks.forEach((task) => {
      const li = this.createLi(task);
      this.addToContainer(li);
    });
  }

  toggleComplete(ev) {
    if (this.editMode) this.cancelEdit();
    const id = ev.target.dataset.id;
    const tasks = this.tasks.map((task) => {
      return task.id === +id
        ? { ...task, completed: !task.completed }
        : { ...task };
    });
    this.tasks = tasks;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.querySelector(`#deleteButton${id}`).classList.toggle('none');
    //ev.target.parentElement.remove();
  }

  removeTask(ev) {}

  setTask(task) {
    this.tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  getTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || null;
    return tasks;
  }
}

const tasks = new TaskManager();
tasks.start();
