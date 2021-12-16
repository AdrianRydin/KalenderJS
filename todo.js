
let todoList = [];

let id = 0;

function generateID() {
    return id++;
}

function add() {
    let li = document.createElement('LI');
    let input_value = document.form_main.task.value;
    let input_date = new Date(document.form_main.date.value);
    let input_id = generateID();
    let input_todo = {txt:input_value ,date:input_date, id:input_id};
    let input_text = document.createTextNode(input_todo.txt);
    console.log(input_date);

    if (input_value === "") {
        return;
    }

    todoList.push(input_todo);
    li.appendChild(input_text );
    li.dataset.id = input_id;
    document.querySelector('ul').appendChild(li);
    document.form_main.task.value = "";

    createEditButton(li);
    createCloseButton(li);
    renderCalendar();
}

function createEditButton(li) {
    let span = document.createElement("SPAN");
    let txt = document.createTextNode("\u270E");

    span.className = "edit";
    span.appendChild(txt);
    li.appendChild(span);

    //span.onclick = () => ;
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
        todoList = todoList.filter(todo=>{ return todo.id !== id});
        renderCalendar();
    };
}

document.querySelectorAll('li').forEach(createCloseButton);

document.querySelector('ul').addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        e.target.classList.toggle('checked');
    }
})