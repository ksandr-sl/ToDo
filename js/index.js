const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(task => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask(event) {
    // отменяем отправку формы (обновление страницы)
    event.preventDefault();

    // получаем текст задачи из поля ввода
    const taskText = taskInput.value;

    // если текста нет - выходим из ф-ции
    if (!taskText) return;

    // создаем объект задачи
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
        length: taskText.length,
    };

    // добавляем задачу в массив
    tasks.push(newTask);

    // добавляем задачу в разметку
    renderTask(newTask);

    // очищаем поле ввода
    taskInput.value = '';

    checkEmptyList();
    saveToLocalStorage();
}

function deleteTask(event) {
    // если клик НЕ по кнопке "удалить" - выходим из ф-ции
    if (event.target.dataset.action !== 'delete') return;

    // находим родителя
    const parentNode =  event.target.closest('.body__task');
    // получаем его id 
    const id = +parentNode.id;

    // находим индекс задачи в массиве по id
    const index = tasks.findIndex(task => task.id === id);

    // удаляем задачу из массива
    tasks.splice(index, 1);

    // удаляем задачу из разметки
    parentNode.remove();

    checkEmptyList();
    saveToLocalStorage();
    taskInput.focus();
}

function doneTask(event) {
    // если клик НЕ по кнопке "выполнить" - выходим из ф-ции
    if (event.target.dataset.action !== 'done') return;

    // находим родителя
    const parentNode =  event.target.closest('.body__task');
    const id = +parentNode.id;

    const doneImg =  event.target.children[0];
    
    // находим задачу в массиве
    const task = tasks.find(task => task.id === id);

    !task.done ? doneImg.src = '/img/svg/back.svg': doneImg.src = '/img/svg/green-check.svg';

    task.done = !task.done;


    parentNode.classList.toggle('--done');
    saveToLocalStorage();
    taskInput.focus();
}

function checkEmptyList() {
    const emptyListHTML = `
    <li id="emptylist" class="body__emptylist">
        <img src="/img/empty.png" alt="" class="body__emptyImg"/>
        <div>No tasks for today</div>
    </li>`;

    if (tasks.length === 0) {
        tasksList.insertAdjacentHTML('beforeend', emptyListHTML);
    }   
    if (tasks.length > 0) {
        const emptylist = document.querySelector('.body__emptylist');
        if (emptylist) emptylist.remove();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    const taskCssClass = task.done ? 'body__task --done' : 'body__task';
    const srcImg = task.done ? '/img/svg/back.svg' : '/img/svg/green-check.svg';
    const textCssClass = task.length > 56 ? 'body__task-title --padding' : 'body__task-title';

    // формируем разметку для новой задачи
    const taskHTML = `
    <li id="${task.id}" class="${taskCssClass}">
        <div class="${textCssClass}">${task.text}</div>
        <div class="body__button-group">
            <button data-action="done" type="button" class="body__btn-done">
                <img src="${srcImg}" alt="" class="body__done-img">
            </button>
            <button data-action="delete" type="button" class="body__btn-delete">
                <img src="/img/svg/delete-img.svg" alt="" class="body__delete-img">
            </button>
        </div>
    </li>`;

    // добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}