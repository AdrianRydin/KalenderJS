const todoEditModal = document.querySelector("#todo-edit-modal");
const todoEditModalSubmit = document.querySelector("#todo-edit-modal .modal-submit");
const todoEditModalClose = document.querySelectorAll("#todo-edit-modal .modal-close");
const todoEditModalDelete = document.querySelector("#todo-edit-modal .delete");

const todoEditModalText = document.querySelector("#todo-edit-modal input[type='text']");
const todoEditModalDate = document.querySelector("#todo-edit-modal input[type='date']") ;

/**
 * hämtar alla todos som är sparade i localstorage och displayar de på sidan
 */
function getLocalTodo() {
    let todoList = getTodoList();
    console.log(todoList);
    todoList.forEach(todo => {
        add(todo.txt, todo.date, todo.id, false);
    });

    renderCalendar();
}
/**
 * kollar senaste id i localstorage och adderar 1 så at tvarje todo har eget id
 */
function generateID() {
    if(!localStorage.getItem("todoID")) {
        localStorage.setItem("todoID", 0);
    }
    
    let id = parseInt(localStorage.getItem("todoID"));
    localStorage.setItem("todoID", id + 1);
    
    return id;
}
/**
 * skaffar todo värdena från formen på sidan
 */
function formAdd() {
    let input_value = document.form_main.task.value;
    let input_date = new Date(document.form_main.date.value);
    let input_id = generateID();
    
    let todoAdd = add(input_value, input_date, input_id);
    if(todoAdd) {
        saveTodo(todoAdd);
    }
    renderCalendar();
}
/**
 * hämtar todos som är sparade i en array i localstorage
 */
function getTodoList() {
  if(!localStorage.getItem("todoList")) {
    localStorage.setItem("todoList", JSON.stringify([]));
  }
  return JSON.parse(localStorage.getItem("todoList"));
}
  
/**
 * Sparar todo object i en array som pushas in i localstorage
 * @param  {object} todo todo object som har texten, date och id för todon
 * 
 */
function saveTodo(todo) {
    let todoList = getTodoList();
    todoList.push(todo);
    localStorage.setItem("todoList", JSON.stringify(todoList));
}
/**
 * Skapar todo li element med värdena som användaren har specificerat
 * @param  {string} value Text värdet när man lägger in en todo
 * @param  {Date} date Datum värdet som man väljer när man lägger in en todo
 * @param  {int} id När man skapar en todo så får todon ett id som är skapat av generateID()
 * 
 */
function add(value, date, id) {
    
    if (value === "") {
        return false;
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
/**
 * updaterar todo med ändringarna som gjordes
 * @param {int} id id av todon
 * @param {string} txt text value av todon
 * @param {Date} date date value av todon
 */
function editTodo(id, txt, date) {
    let todoList = getTodoList();

    let todoIndex = 0;
    for(let i = 0; i < todoList.length; i++) {
        if(todoList[i].id === id) {
            todoIndex = i;
            break;
        }
    }

    let todo = todoList[todoIndex];
    todo.txt = txt;
    todo.date = String(date);

    localStorage.setItem("todoList", JSON.stringify(todoList));
}
/**
 * hämtar rätt todo i todo array
 * @param {int} id id av todo som ska hämtas
 * @returns om den hittar object med id så skickas den vidare
 * @returns om den inte hittar ett objekt med id så skickar den tillbaka failsafe todo
 */
function getTodoById(id) {
    let todoList = getTodoList();
    
    for(let i = 0; i < todoList.length; i++) {
        if(todoList[i].id === id) {
            return todoList[i];
        }
    }

    return {
        id: -1,
        txt: "Unknown",
        date: "Unknown",
    };
}
/**
 *  lägger till en edit knapp i li element så man kan edita todon
 * @param  {HTMLElement} parent förälder element i html
 * 
 */
function createEditButton(parent) {
    let span = document.createElement("SPAN");
    let txt = document.createTextNode("\u270E");

    span.className = "edit";
    span.appendChild(txt);
    parent.appendChild(span);

    span.onclick = () => {
        let id = parseInt(parent.dataset.id);
        let todo = getTodoById(id);

        todoEditModal.style.display = "block";
        todoEditModal.dataset.current_id = id;

        todoEditModalText.value = todo.txt;
        todoEditModalDate.valueAsDate = new Date(todo.date);
    };
}
/**
 * tar bort todo från arrayen och pushar den nya till localstorage
 * @param  {int} id todo objectets id
 * 
 */
function removeTodo(id) {
    let todoList = getTodoList();
    todoList = todoList.filter(todo => todo.id !== id);
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }
/**
 * lägger till en stäng knapp så man kan ta bort en todo
 * @param  {HTMLElement} parent förälder element i html
 * 
 */
function createCloseButton(parent) {
    let span = document.createElement("SPAN");
    let txt = document.createTextNode("\u00D7");
    
    span.className = "close";
    span.appendChild(txt);
    parent.appendChild(span);
    
    span.onclick = () => {
        span.parentElement.remove()
        let id = parseInt(parent.dataset.id);
        removeTodo(id);

        renderCalendar();
    };
}

window.addEventListener("load", () => {
    getLocalTodo();
});

todoEditModalClose.forEach(element => { 
    element.addEventListener("click", (e) => {
        todoEditModal.style.display = "none";
    });
});

todoEditModalSubmit.addEventListener("click", (e) => {
    let id = parseInt(todoEditModal.dataset.current_id);
    let text = todoEditModalText.value;
    let date = new Date(todoEditModalDate.value);

    if (text !== "") {
        editTodo(id, text, date);
        window.location.reload();
    }
});

todoEditModalDelete.addEventListener("click", (e) => {
    let id = parseInt(todoEditModal.dataset.current_id);
    removeTodo(id);
    window.location.reload();
});