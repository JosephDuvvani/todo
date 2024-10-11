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

    const newProject = Project();
    newProject.setName(nameInput.value);
    collections.addProject(newProject);
    
    displayProjects();
})

//Display My Projects
function displayProjects() {
    const destination = document.getElementById('my-projects');
    destination.textContent = '';
    
    const projects = collections.getMyProjects();

    projects.forEach(proj => {
        const item = document.createElement('li');
        item.setAttribute('data-index', `${projects.indexOf(proj)}`);
        item.textContent = proj.getName();
        destination.appendChild(item);
    })
}