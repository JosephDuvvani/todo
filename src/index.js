import Project from "./project";
import Task from "./task";
import Collections from "./collections";
import './style.css';
import { ta } from "date-fns/locale";

const collections = Collections();

//Local Storage

if(!localStorage.getItem('projects') ||
    !localStorage.getItem('tasks')) 
{
    populateStorage()
}   else {
    checkStorage();
    displayProjects()
}

function populateStorage() {
    const tasksProject = collections.getAllTasks().getTasks();
    const allProjects = collections.getMyProjects();

    const tasks = JSON.stringify(tasksProject.map(task =>
                    JSON.stringify(
                        {
                            title : task.getTitle(),
                            description : task.getDescription(),
                            date : task.getDueDate(),
                            priority : task.getPriority(),
                            isMyDay : task.getIsMyDay(),
                            isImportant : task.getIsImportant(),
                            isChecked : task.getIsChecked(),
                            indexes : task.getIndexes()
                        }
                    )
                ))

    const store = JSON.stringify(allProjects.map(proj =>
                    JSON.stringify({
                        name : proj.getName(),
                        tasks: proj.getTasks().map(task => JSON.stringify(
                            {
                                title : task.getTitle(),
                                description : task.getDescription(),
                                date : task.getDueDate(),
                                priority : task.getPriority(),
                                isMyDay : task.getIsMyDay(),
                                isImportant : task.getIsImportant(),
                                isChecked : task.getIsChecked(),
                                indexes : task.getIndexes()
                            }
                        ))                     
                    }
                )));
    localStorage.setItem('projects', store);
    localStorage.setItem('tasks', tasks);
}

function checkStorage() {
    const allTasks = JSON.parse(localStorage.getItem('tasks'));
    const projects = JSON.parse(localStorage.getItem('projects'));

    allTasks.forEach(task => {
        const newTask = Task();
        newTask.setTitle(JSON.parse(task).title);
        newTask.setDescription(JSON.parse(task).description);
        newTask.setDueDate(JSON.parse(task).date);
        newTask.setPriority(JSON.parse(task).priority);
        newTask.setIsMyDay(JSON.parse(task).isMyDay);
        newTask.setIsImportant(JSON.parse(task).isImportant);
        newTask.setIsChecked(JSON.parse(task).isChecked);
        newTask.setIndexes(JSON.parse(task).indexes);

        collections.getAllTasks().addTask(newTask);
    })

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
            newTask.setIsMyDay(JSON.parse(task).isMyDay);
            newTask.setIsImportant(JSON.parse(task).isImportant);
            newTask.setIsChecked(JSON.parse(task).isChecked);
            newTask.setIndexes(JSON.parse(task).indexes);

            project.addTask(newTask);
        })
    })
}

const isWhitespaceString = str => !str.replace(/\s/g, '').length;

function getValidName(name) {
    const myProjects = collections.getMyProjects();
    const myNames = myProjects.map(proj => proj.getName());
    if(!myNames.includes(name)) return name;

    for(let i = 1; i <= myProjects.length; i++) {
        let validName = `${name} (${i})`;
        if(!myNames.includes(validName)) return validName;
    }
}

//Create New List
const newProjectBtn = document.getElementById('add-project');
const cancelProjectBtn = document.getElementById('cancel-project');
const newListBtn = document.getElementById('new-list');
const addProjectForm = document.getElementById('new-list-form');

newListBtn.addEventListener('click', (e) => {
    hideChildWithParent(addProjectForm, false);
})

cancelProjectBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideChildWithParent(addProjectForm, true);
})

newProjectBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('new-project-name');

    if(nameInput.value === '' ||
        isWhitespaceString(nameInput.value)
    ) {
        nameInput.focus();
        nameInput.value = '';
        return;
    }
    const newProject = Project();
    newProject.setName(getValidName(nameInput.value.trim()));
    collections.addProject(newProject);

    populateStorage();
    
    displayProjects();
    nameInput.value = '';
    hideChildWithParent(addProjectForm, true);
})

//Delete Project
let currentProject = document.getElementById('tasks').dataset.current;
function deleteProjectEventListener() {
    const deleteProjectBtns = document.querySelectorAll('.delete-project');

    deleteProjectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targ = e.target;
            const index = targ.dataset.remove;
            collections.removeProject(index);
    
            populateStorage();
            displayProjects();
            if(index == currentProject) {
                document.getElementById('tasks').dataset.current = 'my-day';
                displayTasks('my-day');            
            }
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
            hideChildWithParent(editListForm, false);
        })

        saveProjectEdit.addEventListener('click', (e) => {
            e.preventDefault()
            if(newProjectName.value === '' ||
                isWhitespaceString(newProjectName.value)
            ) {
                newProjectName.focus();
                newProjectName.value = '';
                return;
            }
            const proj = collections.getMyProjects()[e.target.dataset.edit];
            if(newProjectName.value.trim() !== proj.getName()) {
                proj.setName(getValidName(newProjectName.value.trim()));
            } else {
                newProjectName.value = '';
                hideChildWithParent(editListForm, true);
                return;
            }

            populateStorage();
            displayProjects();

            const currentList = document.getElementById('tasks').dataset.current;
            displayTasks(currentList);

            newProjectName.value = '';
            hideChildWithParent(editListForm, true);
        })

        cancelProjectEdit.addEventListener('click', (e) => {
            e.preventDefault();
            hideChildWithParent(editListForm, true);
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
    projectOnClick();
    deleteProjectEventListener();
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
        hideChildWithParent(addTaskForm, false);
    })

    cancelTaskBtn.addEventListener('click', (e) => {
        e.preventDefault();
        hideChildWithParent(addTaskForm, true);
    })

    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const newTask = Task();
        if(newTitle.value === '' ||
            isWhitespaceString(newTitle.value)
        ) {
            newTitle.focus();
            newTitle.value = '';
            return;
        }
        newTask.setTitle(newTitle.value.trim());
        newTask.setDescription(newDescription.value.trim());
        newTask.setDueDate(newDate.value);

        (newPriority.value === '') ?
            newTask.setPriority('low') :
            newTask.setPriority(newPriority.value);

        const active = currentList.dataset.current;

        if(active === 'my-day') {
            newTask.setIndexes(`all-tasks ${collections.getAllTasks().getTasks().length}`);
            newTask.setIsMyDay(true);
            collections.getAllTasks().addTask(newTask);       
        } else if(active === 'important') {
            newTask.setIndexes(`all-tasks ${collections.getAllTasks().getTasks().length}`);
            newTask.setIsImportant(true);
            collections.getAllTasks().addTask(newTask);
        } else if(active === 'all-tasks') {
            newTask.setIndexes(`all-tasks ${collections.getAllTasks().getTasks().length}`);
            collections.getAllTasks().addTask(newTask);
        }  else if(+active >= 0 || +active <= collections.getMyProjects().length) {
            newTask.setIndexes(`${active} ${collections.getMyProjects()[active].getTasks().length}`);
            collections.getMyProjects()[active].addTask(newTask);
        }

        populateStorage();
        displayTasks(active);

        newTitle.value = '';
        newDescription.value = '';
        newDate.value = '';
        newPriority.value = '';
        hideChildWithParent(addTaskForm, true);
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
            const indexes = targ.dataset.indexes.split(' ')
            
            if(active === 'my-day' || active === 'important') {
                indexes[0] === 'all-tasks' ?
                    collections.getAllTasks().removeTask(indexes[1]) :
                    collections.getMyProjects()[indexes[0]].removeTask(indexes[1]);      
            } else if(active === 'all-tasks') {
                collections.getAllTasks().removeTask(index);
            }  else if(+active >= 0 || +active <= collections.getMyProjects().length) {
                collections.getMyProjects()[active].removeTask(index);
            }
    
            UpdateIndexes(indexes[0]);
            populateStorage();
            displayTasks(active);
        })
    })
}

//Edit Task
function editTask() {
    const editBtn = document.querySelectorAll('.edit-task');
    const newTitle = document.getElementById('edit-task-title');
    const newDescription = document.getElementById('edit-task-description');
    const newDate = document.getElementById('edit-task-date');
    const newPriority = document.getElementById('edit-task-priority');
    const saveBtn = document.getElementById('save-task-edit');
    const cancelTaskEdit = document.getElementById('cancel-task-edit');
    const editTaskForm = document.querySelector('.edit-task-form');

    editBtn.forEach(btn => {
        const currentList = document.getElementById('tasks').dataset.current;
        let proj;
        const indexes = btn.dataset.indexes.split(' ')
        if(currentList === 'my-day' || currentList === 'important') {
            indexes[0] === 'all-tasks' ?
            proj = collections.getAllTasks() :
            proj = collections.getMyProjects()[indexes[0]];        
        } else if(currentList === 'all-tasks') {
            proj = collections.getAllTasks();
        }  else if(+currentList >= 0 || +currentList <= collections.getMyProjects().length) {
            proj = collections.getMyProjects()[currentList];
        }

        btn.addEventListener('click', (e) => {
            hideChildWithParent(editTaskForm, false);
            const taskIndex = btn.dataset.edit;
            const task = proj.getTasks()[indexes[1]];

            newTitle.value = task.getTitle();
            newDescription.value = task.getDescription();
            newDate.value = task.getDueDate();
            newPriority.value = task.getPriority();

            saveBtn.dataset.edit = taskIndex;
            saveBtn.dataset.indexes = btn.dataset.indexes;
            e.stopPropagation();
        })

        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(newTitle.value === '' ||
                isWhitespaceString(newTitle.value)
            ) {
                newTitle.focus();
                newTitle.value = '';
                return;
            }
            const currentList = document.getElementById('tasks').dataset.current;
            const indexes = saveBtn.dataset.indexes.split(' ');

            if(currentList == 'my-day' || currentList == 'important') {
                indexes[0] == 'all-tasks' ?
                proj = collections.getAllTasks() :
                proj = collections.getMyProjects()[indexes[0]];        
            } else if(currentList == 'all-tasks') {
                proj = collections.getAllTasks();
            }  else if(+currentList >= 0 || +currentList <= collections.getMyProjects().length) {
                proj = collections.getMyProjects()[currentList];
            }

            const task = proj.getTasks()[indexes[1]];

            task.setTitle(newTitle.value.trim());
            task.setDescription(newDescription.value.trim());
            task.setDueDate(newDate.value);
            task.setPriority(newPriority.value);

            populateStorage();
            displayTasks(currentList);

            newTitle.value = '';
            newDescription.value = '';
            newDate.value = '';
            newPriority.value = '';
            hideChildWithParent(editTaskForm, true);
        })

        cancelTaskEdit.addEventListener('click', (e) => {
            e.preventDefault();
            const editTaskForm = document.getElementById('edit-task-form');
            hideChildWithParent(editTaskForm, true);
        })
    })
}

//Update Indexes
function UpdateIndexes(list) {
    if(list === 'all-tasks') {
        const proj = collections.getAllTasks().getTasks();
        proj.forEach(task => {
            task.setIndexes(`all-tasks ${proj.indexOf(task)}`);
        })
    } else {
        const proj = collections.getMyProjects()[list].getTasks();
        proj.forEach(task => {
            task.setIndexes(`${list} ${proj.indexOf(task)}`);
        })
    }
}

//Show/hide Description

function toggleDescription() {
    const tasks = document.querySelectorAll('.task-item');
    tasks.forEach(task => {
        task.addEventListener('click', () => {
            const hidden = task.querySelector('.task-hidden');
            if(hidden.className.includes('show')) {
                hidden.classList.toggle('show', false);
            } else {
                hidden.classList.toggle('show');
            }
        })
    })
}

function makeMyDay() {
    let myDay = [];
    const allTasks = collections.getAllTasks().getTasks();
    const myProjects = collections.getMyProjects();
    if(allTasks.length > 0) {
        allTasks.forEach(task => {
            if(task.getIsMyDay() === true) {
                myDay.push(task);
            }
        })
    }
    if(myProjects.length > 0) {
        myProjects.forEach(proj => {
            const tasks = proj.getTasks();
            if(tasks.length > 0) {
                tasks.forEach(task => {
                    if(task.getIsMyDay() === true) {
                        myDay.push(task);
                    }
                })
            }
        })
    }

    return myDay;
}

function makeImportant() {
    let important = [];
    const allTasks = collections.getAllTasks().getTasks();
    const myProjects = collections.getMyProjects();
    if(allTasks.length > 0) {
        allTasks.forEach(task => {
            if(task.getIsImportant() === true) {
                important.push(task);
            }
        })
    }

    if(myProjects.length > 0) {
        myProjects.forEach(proj => {
            const tasks = proj.getTasks();
            if(tasks.length > 0) {
                tasks.forEach(task => {
                    if(task.getIsImportant() === true) {
                        important.push(task);
                    }
                })
            }
        })
    }
    return important;
}

//Mark Task as Important

function markAsImportant() {
    const important = document.querySelectorAll('.important-btn');
    const currentList = document.getElementById('tasks').dataset.current;
    important.forEach(btn => {
        const index = btn.dataset.index;
        const indexes = btn.dataset.indexes.split(' ');
        btn.addEventListener('click', () => {
            if(currentList === 'all-tasks') {             
                collections.getAllTasks().getTasks()[index].getIsImportant() === false ?
                    collections.getAllTasks().getTasks()[index].setIsImportant(true) :                 
                    collections.getAllTasks().getTasks()[index].setIsImportant(false);
            } else if(Number.isInteger(+currentList)) {
                collections.getMyProjects()[+currentList].getTasks()[index].getIsImportant() === false ?
                    collections.getMyProjects()[+currentList].getTasks()[index].setIsImportant(true) :
                    collections.getMyProjects()[+currentList].getTasks()[index].setIsImportant(false);
            } else if(currentList === 'my-day') {
                if(indexes[0] === 'all-tasks') {
                    collections.getAllTasks().getTasks()[indexes[1]].getIsImportant() === false ?
                        collections.getAllTasks().getTasks()[indexes[1]].setIsImportant(true) :
                        collections.getAllTasks().getTasks()[indexes[1]].setIsImportant(false);
                } else {
                    collections.getMyProjects()[indexes[0]].getTasks()[indexes[1]].getIsImportant() === false ?
                        collections.getMyProjects()[indexes[0]].getTasks()[indexes[1]].setIsImportant(true) :
                        collections.getMyProjects()[indexes[0]].getTasks()[indexes[1]].setIsImportant(false);
                }
            } else {
                (indexes[0] === 'all-tasks') ? 
                    collections.getAllTasks().getTasks()[indexes[1]].setIsImportant(false) :
                    collections.getMyProjects()[indexes[0]].getTasks()[indexes[1]].setIsImportant(false);
                    displayTasks(currentList);
            }
            populateStorage();
        })
    })
}

//Add to My Day

function addToMyDay() {
    const myDay = document.querySelectorAll('.my-day-btn');
    const currentList = document.getElementById('tasks').dataset.current;
    myDay.forEach(btn => {
        const index = btn.dataset.index;
        const indexes = btn.dataset.indexes.split(' ');
        btn.addEventListener('click', () => {
            if(currentList === 'all-tasks') {             
                collections.getAllTasks().getTasks()[index].getIsMyDay() === false ?
                    collections.getAllTasks().getTasks()[index].setIsMyDay(true) :                 
                    collections.getAllTasks().getTasks()[index].setIsMyDay(false);
            } else if(Number.isInteger(+currentList)) {
                collections.getMyProjects()[+currentList].getTasks()[index].getIsMyDay() === false ?
                    collections.getMyProjects()[+currentList].getTasks()[index].setIsMyDay(true) :
                    collections.getMyProjects()[+currentList].getTasks()[index].setIsMyDay(false);
            } else if(currentList === 'important') {
                if(indexes[0] === 'all-tasks') {
                    collections.getAllTasks().getTasks()[indexes[1]].getIsMyDay() === false ?
                        collections.getAllTasks().getTasks()[indexes[1]].setIsMyDay(true) :
                        collections.getAllTasks().getTasks()[indexes[1]].setIsMyDay(false);
                } else {
                    collections.getMyProjects()[indexes[0]].getTasks()[indexes[1]].getIsMyDay() === false ?
                        collections.getMyProjects()[indexes[0]].getTasks()[indexes[1]].setIsMyDay(true) :
                        collections.getMyProjects()[indexes[0]].getTasks()[indexes[1]].setIsMyDay(false);
                }
            } else {
                (indexes[0] === 'all-tasks') ? 
                    collections.getAllTasks().getTasks()[indexes[1]].setIsMyDay(false) :
                    collections.getMyProjects()[indexes[0]].getTasks()[indexes[1]].setIsMyDay(false);
                    displayTasks(currentList);
            }
            populateStorage();
        })
    })
}

//Display Tasks
function displayTasks(selected) {
    hideChildWithParent(document.getElementById('task-form'), true);
    hideChildWithParent(document.getElementById('edit-task-form'), true);

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

    let taskList;
    if(selected === 'my-day') {
        taskList = makeMyDay();
    } else if(selected === 'important') {
        taskList = makeImportant();
    } else {
        taskList = proj.getTasks();
    }

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
        label.setAttribute('data-indexes', `${task.getIndexes()}`);
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

        const projectName = document.createElement('div');
        projectName.classList.add('task-project');

        if(!Number.isInteger(+selected) && selected !== 'all-tasks'){
            let indexes = task.getIndexes().split(' ');
            if(indexes[0] === 'all-tasks') {
                projectName.textContent = 'Tasks';
            } else {
                projectName.textContent = collections.getMyProjects()[indexes[0]].getName();
            }
        }
        text.appendChild(projectName);

        const date = document.createElement('div');
        date.classList.add('due-date');
        date.textContent = task.getDueDate();
        text.appendChild(date);

        item.appendChild(text);

        const hidden = document.createElement('div');
        hidden.classList.add('task-hidden');
        item.appendChild(hidden);

        const description = document.createElement('div');
        description.classList.add('description');
        description.setAttribute('data-show', `${taskList.indexOf(task)}`);
        const descriptionText = document.createElement('div');
        descriptionText.textContent = task.getDescription();
        description.appendChild(descriptionText);
        hidden.appendChild(description);

        const importantBtn = document.createElement('button');
        importantBtn.setAttribute('data-index', `${taskList.indexOf(task)}`);
        importantBtn.setAttribute('data-indexes', `${task.getIndexes()}`);
        importantBtn.classList.add('important-btn');
        const starIconTemplate = document.getElementById('star-icon');
        const starIcon = starIconTemplate.content.cloneNode(true);
        importantBtn.appendChild(starIcon);
        hidden.appendChild(importantBtn);

        const myDayBtn = document.createElement('button');
        myDayBtn.setAttribute('data-index', `${taskList.indexOf(task)}`);
        myDayBtn.setAttribute('data-indexes', `${task.getIndexes()}`);
        myDayBtn.classList.add('my-day-btn');
        const iconTemplate = document.getElementById('sun-icon');
        const sunIcon = iconTemplate.content.cloneNode(true);
        myDayBtn.appendChild(sunIcon);
        hidden.appendChild(myDayBtn);

        const editBtn = document.createElement('button');
        editBtn.setAttribute('data-edit', `${taskList.indexOf(task)}`);
        editBtn.setAttribute('data-indexes', `${task.getIndexes()}`);
        editBtn.classList.add('edit-task', 'edit');
        editBtn.textContent = 'Edit';
        item.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('data-removetask', `${taskList.indexOf(task)}`);
        deleteBtn.setAttribute('data-indexes', `${task.getIndexes()}`);
        deleteBtn.classList.add('delete-task', 'delete');
        deleteBtn.textContent = '×';
        item.appendChild(deleteBtn);

        destination.appendChild(item);
    })
    toggleDescription();
    editTask();
    deleteTask();
    markAsImportant();
    addToMyDay();
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
            currentProject = activeProject;
            
            displayTasks(activeProject);
        })
    })
}

(function overlayOnClick() {
    const forms = document.querySelectorAll('.form');
    const overlay = document.querySelectorAll('.form-container');

    forms.forEach(form => {
        form.addEventListener('click', (e) => {
            e.stopPropagation();
        })
    })

    overlay.forEach(layer => {
        layer.addEventListener('click', (e) => {
            hideChildWithParent(layer.children[0], true);
        })
    })
})();

function hideChildWithParent(element, state) {
    element.classList.toggle('hide', state);
    element.parentElement.classList.toggle('hide', state);
}