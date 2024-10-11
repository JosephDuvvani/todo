export default function Project() {
    let name = '';
    let tasks = [];

    const getName = () => name;

    const getTasks = () => tasks;

    const setName = (newName) => name = newName;

    const addTask = (task) => tasks.push(task);

    const removeTask = (index) => tasks.splice(index, 1);

    return {
        getName,
        getTasks,
        setName,
        addTask,
        removeTask
    };
}