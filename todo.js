

function getLocalTodo() {
    let todoList = getTodoList();
    console.log(todoList);
    todoList.forEach(todo => {
        add(todo.txt, todo.date, todo.id, false);
    });

    renderCalendar();
}

function generateID() {
    if(!localStorage.getItem("todoID")) {
        localStorage.setItem("todoID", 0);
      }
    
      let id = parseInt(localStorage.getItem("todoID"));
      localStorage.setItem("todoID", id + 1);
    
      return id;
}

function formAdd() {
    let input_value = document.form_main.task.value;
    let input_date = new Date(document.form_main.date.value);
    let input_id = generateID();
    
    
    let todoAdd = add(input_value, input_date, input_id);
    saveTodo(todoAdd);
    renderCalendar();
}

function getTodoList() {
  if(!localStorage.getItem("todoList")) {
    localStorage.setItem("todoList", JSON.stringify([]));
  }
  return JSON.parse(localStorage.getItem("todoList"));
}
  
function saveTodo(todo) {
    let todoList = getTodoList();
    todoList.push(todo);
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

function add(value, date, id) {
    
    if (value === "") {
        return;
    }

    let li = document.createElement('LI');
    
    let input_todo = {
        txt:value,
        date:String(date),
        id:id};
    let input_text = document.createTextNode(input_todo.txt);
    

    

    li.appendChild(input_text);
    li.dataset.id = id;
    document.querySelector('ul').appendChild(li);
    document.form_main.task.value = "";
        


    createEditButton(li);
    createCloseButton(li);

    return input_todo;
}

function createEditButton(li) {
    let span = document.createElement("SPAN");
    let txt = document.createTextNode("\u270E");

    span.className = "edit";
    span.appendChild(txt);
    li.appendChild(span);

    //span.onclick = () => ;
}

function removeTodo(id) {
    let todoList = getTodoList();
    todoList = todoList.filter(todo => todo.id !== id);
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }

function createCloseButton(li) {
    let span = document.createElement("SPAN");
    let txt = document.createTextNode("\u00D7");
    
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);
    
    span.onclick = () => {
        span.parentElement.remove()
        let id = parseInt(li.dataset.id);
        removeTodo(id);

        renderCalendar();
    };
}

document.querySelectorAll('li').forEach(createCloseButton);

document.querySelector('ul').addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        e.target.classList.toggle('checked');
    }
})

window.addEventListener("load", () => {
    getLocalTodo();
});