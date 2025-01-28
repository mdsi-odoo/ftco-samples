document.addEventListener("click", ev => {
    if (ev.target.className === "add-todo") {
        addTodo();
    } else if (ev.target.className === "remove-todo") {
        removeTodo(ev.target);
    }
});

const addTodo = () => {
    const itemText = document.getElementById("todo-text");
    if (!itemText.value) return;

    const itemList = document.getElementById("todo-list");
    const item = document.createElement("div");
    item.className = "todo";
    item.innerHTML = `<p>${itemText.value}</p> <button class="remove-todo">Remove</button>`;

    itemList.insertBefore(item, itemList.firstChild);
    itemText.value = "";
};

const removeTodo = (target) => {
    target.parentElement.remove();
};
