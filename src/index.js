import Project from "./project";
import Task from "./task";
import Collections from "./collections";
import './style.css';

const collections = Collections();

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

        const name = document.createElement('span');
        name.setAttribute('data-index', `${taskList.indexOf(task)}`);
        name.textContent = task.getTitle();
        item.appendChild(name);

        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('data-removeTask', `${taskList.indexOf(task)}`);
        deleteBtn.classList.add('delete-task');
        deleteBtn.textContent = '×';
        item.appendChild(deleteBtn);

        destination.appendChild(item);
    })
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