import Project from "./project";
import Task from "./task";
import Collections from "./collections";
import './style.css';
import { ta } from "date-fns/locale";

const collections = Collections();

//Placeholders
const t = Task();
t.setTitle('Task 1')
t.setDueDate('2024-12-02');
t.setDescription('This is the description');
t.setPriority('low');
collections.getMyDay().addTask(t);
const a = Task();
a.setTitle('Task A')
a.setDueDate('2024-11-02');
a.setDescription('This is the description');
a.setPriority('medium');
collections.getMyDay().addTask(a);

const b = Task();
b.setTitle('Task A')
b.setDueDate('2024-12-25');
b.setDescription('This is the description');
b.setPriority('high');
collections.getImportant().addTask(b);

// const personal = Project();
// personal.setName('Personal');
// collections.addProject(personal);

// const work = Project();
// work.setName('Work');
// collections.addProject(work);

// const health = Project();
// health.setName('Health');
// collections.addProject(health);
// displayProjects();

//Local Storage

if(!localStorage.getItem('projects')) {
    populateStorage()
}   else {
    checkStorage();
    displayProjects()
}

function populateStorage() {
    const allProjects = collections.getMyProjects();
    const store = JSON.stringify(allProjects.map(proj =>
                    JSON.stringify({
                        name : proj.getName(),
                        tasks: proj.getTasks().map(task => JSON.stringify(
                            {
                                title : task.getTitle(),
                                description : task.getDescription(),
                                date : task.getDueDate(),
                                priority : task.getPriority()
                            }
                        ))                     
                    }
                )));
    localStorage.setItem('projects', store);
}

function checkStorage() {
    const projects = JSON.parse(localStorage.getItem('projects'));

    projects.forEach(proj => {
        const project = Project();
        project.setName(JSON.parse(proj).name);
        collections.addProject(project);

        const tasks = JSON.parse(proj).tasks;

        tasks.forEach(task => {
            const newTask = Task();
            newTask.setTitle(JSON.parse(task).title);
            newTask.setDescription(JSON.parse(task).description);
            newTask.setDueDate(JSON.parse(task).date);
            newTask.setPriority(JSON.parse(task).priority);

            project.addTask(newTask);
        })
    })
}

//Create New List
const newProjectBtn = document.getElementById('add-project');
const cancelProjectBtn = document.getElementById('cancel-project');
const newListBtn = document.getElementById('new-list');
const addProjectForm = document.getElementById('new-list-form');

newListBtn.addEventListener('click', () => {
    addProjectForm.classList.toggle('hide', false);
})

cancelProjectBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addProjectForm.classList.toggle('hide', true);
})

newProjectBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('new-project-name');

    if(nameInput.value === '') return;
    const newProject = Project();
    newProject.setName(nameInput.value.trim());
    collections.addProject(newProject);

    populateStorage();
    
    displayProjects();
    addProjectForm.classList.toggle('hide', true);
})

//Delete Project
function deleteProjectEventListener() {
    const deleteProjectBtns = document.querySelectorAll('.delete-project');

    deleteProjectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targ = e.target;
            const index = targ.dataset.remove;
            collections.removeProject(index);
    
            populateStorage();
            displayProjects();
        })
    })
}

//Edit Project
function editProject() {
    const editProjectBtn = document.querySelectorAll('.edit-project')
    const newProjectName = document.getElementById('edit-project-name');
    const saveProjectEdit = document.getElementById('save-project-edit');
    const cancelProjectEdit = document.getElementById('cancel-project-edit');
    const editListForm = document.querySelector('.edit-list-form');

    editProjectBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectIndex = btn.dataset.edit;
            const proj = collections.getMyProjects()[projectIndex];
            newProjectName.value = proj.getName();
            saveProjectEdit.dataset.edit = projectIndex;

            const editListForm = document.querySelector('.edit-list-form');
            editListForm.classList.toggle('hide', false);
        })

        saveProjectEdit.addEventListener('click', (e) => {
            e.preventDefault()
            if(newProjectName.value === '') return;
            const proj = collections.getMyProjects()[e.target.dataset.edit];
            proj.setName(newProjectName.value);

            populateStorage();
            displayProjects();

            newProjectName.value = '';
            editListForm.classList.toggle('hide', true);
        })

        cancelProjectEdit.addEventListener('click', (e) => {
            e.preventDefault();
            editListForm.classList.toggle('hide', true);
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
        item.classList.add('display-project', 'item');
        item.setAttribute('data-index', `${projects.indexOf(proj)}`);

        const iconTemplate = document.getElementById('list-icon');
        const listIcon = iconTemplate.content.cloneNode(true);

        item.appendChild(listIcon);

        const name = document.createElement('span');
        name.classList.add('project-name');
        name.setAttribute('data-index', `${projects.indexOf(proj)}`);
        name.textContent = proj.getName();
        item.appendChild(name);

        const editBtn = document.createElement('button');
        editBtn.setAttribute('data-edit', `${projects.indexOf(proj)}`);
        editBtn.classList.add('edit-project', 'edit');
        editBtn.textContent = 'Edit';
        item.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('data-remove', `${projects.indexOf(proj)}`);
        deleteBtn.classList.add('delete-project', 'delete');
        deleteBtn.textContent = '×';
        item.appendChild(deleteBtn);

        destination.appendChild(item);
    })
    editProject();
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
    const cancelTaskBtn = document.getElementById('cancel-task');
    const newTaskBtn = document.getElementById('new-task');
    const addTaskForm = document.getElementById('task-form');

    newTaskBtn.addEventListener('click', () => {
        addTaskForm.classList.toggle('hide', false);
    })

    cancelTaskBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addTaskForm.classList.toggle('hide', true);
    })

    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const newTask = Task();
        if(newTitle.value === '') return;
        newTask.setTitle(newTitle.value.trim());
        newTask.setDescription(newDescription.value.trim());
        newTask.setDueDate(newDate.value);

        (newPriority.value === '') ?
            newTask.setPriority('low') :
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

        populateStorage();
        displayTasks(active);

        newTitle.value = '';
        newDescription.value = '';
        newDate.value = '';
        newPriority.value = '';
        addTaskForm.classList.toggle('hide', true);
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
    
            populateStorage();
            displayTasks(active);
        })
    })
}

//Edit Task
function editTask() {
    const editBtn = document.querySelectorAll('.edit-task');
    const currentList = document.getElementById('tasks').dataset.current;
    const newTitle = document.getElementById('edit-task-title');
    const newDescription = document.getElementById('edit-task-description');
    const newDate = document.getElementById('edit-task-date');
    const newPriority = document.getElementById('edit-task-priority');
    const saveBtn = document.getElementById('save-task-edit');
    const cancelTaskEdit = document.getElementById('cancel-task-edit');
    const editTaskForm = document.querySelector('.edit-task-form');

    editBtn.forEach(btn => {
        let proj;
        if(currentList === 'my-day') {
            proj = collections.getMyDay();       
        } else if(currentList === 'important') {
            proj = collections.getImportant();
        } else if(currentList === 'all-tasks') {
            proj = collections.getAllTasks();
        }  else if(+currentList >= 0 || +currentList <= collections.getMyProjects().length) {
            proj = collections.getMyProjects()[currentList];
        }

        btn.addEventListener('click', (e) => {
            editTaskForm.classList.toggle('hide', false);
            const taskIndex = btn.dataset.edit;

            const task = proj.getTasks()[taskIndex];
            
            newTitle.value = task.getTitle();
            newDescription.value = task.getDescription();
            newDate.value = task.getDueDate();
            newPriority.value = task.getPriority();

            saveBtn.dataset.edit = taskIndex;
            e.stopPropagation();
        })

        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(newTitle.value === '') return;
            const currentList = document.getElementById('tasks').dataset.current;

            if(currentList === 'my-day') {
                proj = collections.getMyDay();       
            } else if(currentList === 'important') {
                proj = collections.getImportant();
            } else if(currentList === 'all-tasks') {
                proj = collections.getAllTasks();
            }  else if(+currentList >= 0 || +currentList <= collections.getMyProjects().length) {
                proj = collections.getMyProjects()[currentList];
            }

            const task = proj.getTasks()[e.target.dataset.edit];

            task.setTitle(newTitle.value);
            task.setDescription(newDescription.value);
            task.setDueDate(newDate.value);
            task.setPriority(newPriority.value);

            populateStorage();
            displayTasks(currentList);

            newTitle.value = '';
            newDescription.value = '';
            newDate.value = '';
            newPriority.value = '';
            editTaskForm.classList.toggle('hide', true);
        })

        cancelTaskEdit.addEventListener('click', (e) => {
            e.preventDefault();
            const editTaskForm = document.getElementById('edit-task-form');
            editTaskForm.classList.toggle('hide', true);
        })
    })
}

//Show/hide Description

function toggleDescription() {
    const tasks = document.querySelectorAll('.task-item');
    tasks.forEach(task => {
        task.addEventListener('click', () => {
            const descr = task.querySelector('.description');
            if(descr.className.includes('show')) {
                descr.classList.toggle('show', false);
            } else {
                descr.classList.toggle('show');
            }
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
        item.classList.add('task-item', 'item', `priority-${task.getPriority()}`);
        item.setAttribute('data-index', `${taskList.indexOf(task)}`);

        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', `checkbox`);
        checkbox.setAttribute('id', `check-${taskList.indexOf(task)}`);
        item.appendChild(checkbox);

        const label = document.createElement('label');
        label.setAttribute('for', `check-${taskList.indexOf(task)}`);
        item.appendChild(label);

        const customCheckbox = document.createElement('span');
        customCheckbox.classList.add('custom-checkbox');
        label.appendChild(customCheckbox);

        const text = document.createElement('div');
        text.classList.add('task-text');

        const title = document.createElement('div');
        title.classList.add('task-title');
        title.setAttribute('data-index', `${taskList.indexOf(task)}`);
        title.textContent = task.getTitle();
        text.appendChild(title);

        const date = document.createElement('div');
        date.classList.add('due-date');
        date.textContent = task.getDueDate();
        text.appendChild(date);

        item.appendChild(text);

        const description = document.createElement('div');
        description.classList.add('description');
        description.setAttribute('data-show', `${taskList.indexOf(task)}`);
        const descriptionText = document.createElement('div');
        descriptionText.textContent = task.getDescription();
        description.appendChild(descriptionText);
        item.appendChild(description);

        const editBtn = document.createElement('button');
        editBtn.setAttribute('data-edit', `${taskList.indexOf(task)}`);
        editBtn.classList.add('edit-task', 'edit');
        editBtn.textContent = 'Edit';
        item.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('data-removetask', `${taskList.indexOf(task)}`);
        deleteBtn.classList.add('delete-task', 'delete');
        deleteBtn.textContent = '×';
        item.appendChild(deleteBtn);

        destination.appendChild(item);
    })
    toggleDescription();
    editTask();
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