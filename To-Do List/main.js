'use strict';

const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const btnAddTask = document.querySelector('.btn-success');
const sortCheckbox = document.getElementById('sortCheckbox');
const completedCheckbox = document.getElementById('completedCheckbox');

var taskObj = [];

var tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Cargar tareas desde el localstorage
window.addEventListener('load', (event) => {
    tasks.forEach((task, index) => {
        taskObj.push({"name":task.name,"isCheked":task.isCheked})
        const newTask = createTaskElement();
        taskList.appendChild(newTask);
    });
});

// Añadir tarea
btnAddTask.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        taskObj.push({"name":taskText,"isCheked":false})
        const newTask = createTaskElement();
        taskList.appendChild(newTask);
        tasks.push(taskText);
        
        updateLocalStorage();

        taskInput.value = ''; // Limpiar el input después de añadir la tarea
    }
});

function removeTask() {
    if (document.querySelector('.btn-info')) {
        alert('Tiene una tarea pendiente de editar')
        return;
    }

    if (confirm("¿Está seguro, quiere eliminar la tarea?") == true) {
        const taskItem = this.closest('.task-item');
        const taskText = taskItem.querySelector('p').textContent;
        debugger
        taskObj = taskObj.filter(task => task.name !== taskText);
        taskList.removeChild(taskItem);

        updateLocalStorage();
    }
}

function editTask() {
    const taskItem = this.closest('.task-item');
    const taskText = taskItem.querySelector('p').textContent;

    if (document.querySelector('.btn-info')) {
        alert('Solo puede editar una tarea a la vez')
        return;
    }
    taskInput.value = taskText;
    btnAddTask.disabled = true;
    
    const btnAccept = createButton('Aceptar', 'btn btn-info', acceptEditTask.bind(this, taskItem, taskText));
    this.replaceWith(btnAccept);
    
}

function acceptEditTask(taskItem, oldText, btnAcept) {

    const newText = taskInput.value.trim();
    if (newText) {
        taskItem.querySelector('p').textContent = newText;
        debugger
        taskObj = tasks.filter(task => task.name !== oldText);
        taskObj.push({"name":newText,"isCheked":false});
        updateLocalStorage();

        resetEditUI(btnAcept.target);
    }
}

// Evento que se invoca al hacer check al ordenar las tareas
sortCheckbox.addEventListener('change',  ()=> {
    const tasksChildren = Array.from(taskList.children);
    
    if (sortCheckbox.checked)
        tasksChildren.sort((a, b) => a.children[0].textContent.trim().localeCompare(b.children[0].textContent.trim()));
    else {
        let _tasks = tasks.map(t  => t.name)
        tasksChildren.sort((a, b) => _tasks.indexOf(a.children[0].textContent) - _tasks.indexOf(b.children[0].textContent));
    }
        
    
    taskList.innerHTML = '';
    tasksChildren.forEach(task => taskList.appendChild(task));
});

// Evento que se invoca al hacer check al obtener todas la tareas completadas
completedCheckbox.addEventListener('change',  ()=> {
    const tasksChildren = Array.from(taskList.children);
    
    if (completedCheckbox.checked) {
        let tasksChecked = []
        tasksChecked = tasksChildren.filter( task => task.children[1].children[0].checked);
        taskList.innerHTML = '';
        tasksChecked.forEach(task => taskList.appendChild(task));
        console.log(tasksChecked)
    } else {
        taskList.innerHTML = '';
        tasks.forEach(taskText => {
            const newTask = createTaskElement();
            taskList.appendChild(newTask);
        });
        console.log(tasksChildren)
    }
       
});

function toggleTask(checkbox) {
    debugger
    if (document.querySelector('.btn-info')) {
        checkbox.target.checked = false;
        alert('Tiene una tarea pendiente de editar')
        return;
    }

    const taskItem = this.closest('.task-item');
    taskItem.classList.toggle('completed', this.checked);
    checkbox.target.disabled = this.checked;
    //console.log(this.closest('.form-check-input'))
    Array.from(taskItem.querySelectorAll('button')).forEach(btn => btn.hidden = this.checked);
}

function resetEditUI(acceptButton) {
    const btnEdit = createButton('Editar', 'btn btn-warning', editTask);
    acceptButton.replaceWith(btnEdit);
    btnAddTask.disabled = false;
    taskInput.value = '';
}

function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(taskObj));
}

// Crear elemento de tarea
function createTaskElement() {
    const taskContainer = document.createElement('LI');
    taskContainer.classList.add('task-item');

    const taskContent = document.createElement('P');
    taskContent.textContent = taskObj[taskObj.length-1].name;

    const checkContainer = createCheckContainer();
    const btnRemove = createButton('Eliminar', 'btn btn-danger', removeTask);
    const btnEdit = createButton('Editar', 'btn btn-warning', editTask);

    taskContainer.append(taskContent, checkContainer, btnRemove, btnEdit);
    return taskContainer;
}

function createCheckContainer() {
    const checkContainer = document.createElement('DIV');
    checkContainer.classList.add('form-check', 'mb-2');

    const checkbox = document.createElement('INPUT');
    checkbox.type = 'checkbox';
    checkbox.classList.add('form-check-input');
    checkbox.addEventListener('change', toggleTask);
    if (taskObj[taskObj.length-1].isCheked)
        toggleTask(checkbox)

    const label = document.createElement('LABEL');
    label.textContent = 'Completado';
    label.classList.add('form-check-label');

    checkContainer.append(checkbox, label);
    return checkContainer;
}

// Crear botones reutilizables
function createButton(text, classes, onClick) {
    const button = document.createElement('BUTTON');
    button.textContent = text;
    button.className = classes;
    button.addEventListener('click', onClick);
    return button;
}