import Project from "./project";
import Task from "./task";
import Collections from "./collections";
import './style.css';

const collections = Collections();
const t = Task();
t.setTitle('Task 1')
t.setDueDate('2024-12-02');
collections.getMyDay().addTask(t);
const a = Task();
a.setTitle('Task A')
a.setDueDate('2024-11-02');
collections.getMyDay().addTask(a);

const b = Task();
b.setTitle('Task A')
b.setDueDate('2024-12-25');
collections.getImportant().addTask(b);

//Create New List
const newProjectBtn = document.getElementById('add-project');

newProjectBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('new-project-name');

    if(nameInput.value === '') return;
    const newProject = Project();
    newProject.setName(nameInput.value.trim());
    collections.addProject(newProject);
    
    displayProjects();
})

//Delete Project
function deleteProjectEventListener() {
    const deleteProjectBtns = document.querySelectorAll('.delete-project');

    deleteProjectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targ = e.target;
            const index = targ.dataset.remove;
            collections.removeProject(index);
    
            displayProjects();
        })
    })
}

//Display My Projects
function displayProjects() {
    const destination = document.getElementById('my-projects');
    destination.textContent = '';
    
    const projects = collections.getMyProjects();

    projects.forEach(proj => {
        const item = document.createElement('li');
        item.classList.add('display-project');
        item.setAttribute('data-index', `${projects.indexOf(proj)}`);

        const name = document.createElement('span');
        name.setAttribute('data-index', `${projects.indexOf(proj)}`);
        name.textContent = proj.getName();
        item.appendChild(name);

        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('data-remove', `${projects.indexOf(proj)}`);
        deleteBtn.classList.add('delete-project');
        deleteBtn.textContent = '×';
        item.appendChild(deleteBtn);

        destination.appendChild(item);
    })
    deleteProjectEventListener();
    projectOnClick();
}

//Add Task
(function addNewTask() {
    const currentList = document.getElementById('tasks');
    const newTitle = document.getElementById('task-title');
    const newDescription = document.getElementById('task-description');
    const newDate = document.getElementById('task-date');
    const newPriority = document.getElementById('task-priority');
    const addTaskBtn = document.getElementById('add-task');

    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const newTask = Task();
        if(newTitle.value === '') return;
        newTask.setTitle(newTitle.value.trim());
        newTask.setDescription(newDescription.value.trim());
        newTask.setDueDate(newDate.value);
        newTask.setPriority(newPriority.value);

        const active = currentList.dataset.current;

        if(active === 'my-day') {
            collections.getMyDay().addTask(newTask);       
        } else if(active === 'important') {
            collections.getImportant().addTask(newTask);
        } else if(active === 'all-tasks') {
            collections.getAllTasks().addTask(newTask);
        }  else if(+active >= 0 || +active <= collections.getMyProjects().length) {
            collections.getMyProjects()[active].addTask(newTask);
        }
        displayTasks(active);
    })
})();

//Remove Task
function deleteTask() {
    const deleteTaskBtns = document.querySelectorAll('.delete-task');
    const currentList = document.getElementById('tasks');
    const active = currentList.dataset.current;

    deleteTaskBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targ = e.target;
            const index = targ.dataset.removetask;
            
            if(active === 'my-day') {
                collections.getMyDay().removeTask(index);      
            } else if(active === 'important') {
                collections.getImportant().removeTask(index);
            } else if(active === 'all-tasks') {
                collections.getAllTasks().removeTask(index);
            }  else if(+active >= 0 || +active <= collections.getMyProjects().length) {
                collections.getMyProjects()[active].removeTask(index);
            }
    
            displayTasks(active);
        })
    })
}

//Display Tasks
function displayTasks(selected) {
    let proj;
    if(selected === 'my-day') {
        proj = collections.getMyDay();       
    } else if(selected === 'important') {
        proj = collections.getImportant();
    } else if(selected === 'all-tasks') {
        proj = collections.getAllTasks();
    }  else if(+selected >= 0 || +selected <= collections.getMyProjects().length) {
        proj = collections.getMyProjects()[selected];
    }
    
    const title = document.getElementById('title');
    const tasks = document.getElementById('tasks');

    title.textContent = '';
    tasks.textContent = '';

    title.textContent = proj.getName();

    const destination = document.getElementById('tasks');
    const taskList = proj.getTasks();

    taskList.forEach(task => {
        const item = document.createElement('li');
        item.classList.add('task-item');
        item.setAttribute('data-index', `${taskList.indexOf(task)}`);

        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', `checkbox`);
        checkbox.setAttribute('id', `check-${taskList.indexOf(task)}`);
        item.appendChild(checkbox);

        const text = document.createElement('div');
        text.classList.add('task-text')

        const title = document.createElement('div');
        title.setAttribute('data-index', `${taskList.indexOf(task)}`);
        title.textContent = task.getTitle();
        text.appendChild(title);

        const date = document.createElement('div');
        date.classList.add('due-date');
        date.textContent = task.getDueDate();
        text.appendChild(date);

        item.appendChild(text);

        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('data-removetask', `${taskList.indexOf(task)}`);
        deleteBtn.classList.add('delete-task');
        deleteBtn.textContent = '×';
        item.appendChild(deleteBtn);

        destination.appendChild(item);
    })
    deleteTask();
}
displayTasks('my-day');

(function displayOnClick() {
    const selected = document.querySelectorAll('.display-list');
    const activeList = document.getElementById('tasks');

    selected.forEach(proj => {
        proj.addEventListener('click', (e) => {
            const targ = e.target;
            if(!targ.dataset.active) return;
            const activeProject = targ.dataset.active;
            activeList.dataset.current = activeProject;
            
            displayTasks(activeProject);
        })
    })
})()

function projectOnClick() {
    const selected = document.querySelectorAll('.display-project');
    const activeList = document.getElementById('tasks');

    selected.forEach(proj => {
        proj.addEventListener('click', (e) => {
            const targ = e.target;
            if(!targ.dataset.index) return;
            const activeProject = targ.dataset.index;
            activeList.dataset.current = activeProject;
            
            displayTasks(activeProject);
        })
    })
}