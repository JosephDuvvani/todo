import Project from "./project";

export default function TaskCollections() {
    const myDay = Project();
    myDay.setName('My Day');

    const important = Project();
    important.setName('Important');

    const allTasks = Project();
    allTasks.setName('All Tasks');

    const getMyDay = () => myDay;
    const getImportant = () => important;
    const getAllTasks = () => allTasks;

    return {
        getMyDay,
        getImportant,
        getAllTasks
    };
}