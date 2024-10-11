import Project from "./project";

export default function Collections() {
    const myDay = Project();
    myDay.setName('My Day');

    const important = Project();
    important.setName('Important');

    const allTasks = Project();
    allTasks.setName('All Tasks');

    const myProjects = [];

    const getMyDay = () => myDay;
    const getImportant = () => important;
    const getAllTasks = () => allTasks;
    const getMyProjects = () => myProjects;
    const addProject = (proj) => myProjects.push(proj);
    const removeProject = (index) => myProjects.splice(index, 1);

    return {
        getMyDay,
        getImportant,
        getAllTasks,
        getMyProjects,
        addProject,
        removeProject
    };
}