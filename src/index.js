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
        item.setAttribute('data-index', `${projects.indexOf(proj)}`);

        const name = document.createElement('span');
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
}