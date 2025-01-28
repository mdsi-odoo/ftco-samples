const { Component, mount, xml, useRef, onMounted, useState } = owl;

// -------------------------------------------------------------------------
// Task Component
// -------------------------------------------------------------------------
class Task extends Component {
  static props = ["task", "onDelete"];
  toggleTask() {
    this.props.task.isCompleted = !this.props.task.isCompleted;
  }
  deleteTask() {
    this.props.onDelete(this.props.task);
  }
  static template = xml /* xml */`
      <div class="task" t-att-class="props.task.isCompleted ? 'done' : ''">
        <input type="checkbox" t-att-checked="props.task.isCompleted" t-on-click="toggleTask"/>
        <span><t t-esc="props.task.text"/></span>
        <span class="delete" t-on-click="deleteTask">🗑</span>
      </div>`;
}

// -------------------------------------------------------------------------
// Root Component
// -------------------------------------------------------------------------
class Root extends Component {
  // in App
  setup() {
    const inputRef = useRef("add-input");
    onMounted(() => inputRef.el.focus());
  }

  tasks = useState([]);
  nextId = 1;

  static template = xml /* xml */`
    <div class="todo-app">
        <input placeholder="Enter a new task" t-on-keyup="addTask" t-ref="add-input"/>
        <div class="task-list">
            <t t-foreach="tasks" t-as="task" t-key="task.id">
                <Task task="task" onDelete.bind="deleteTask"/>
            </t>
        </div>
    </div>`;
  static components = { Task };

  addTask(ev) {
    // 13 is keycode for ENTER
    if (ev.keyCode === 13) {
      const text = ev.target.value.trim();
      ev.target.value = "";
      if (text) {
        const newTask = {
          id: this.nextId++,
          text: text,
          isCompleted: false,
        };
        this.tasks.push(newTask);
      }
    }
  }
  deleteTask(task) {
    const index = this.tasks.findIndex(t => t.id === task.id);
    this.tasks.splice(index, 1);
  }

}

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------
mount(Root, document.body, { dev: true });
