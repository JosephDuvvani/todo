export default function Task() {
    let title = '';
    let description = '';
    let dueDate = '';
    let priority = 4;
    let notes = '';
    let subTasks = [];

    const getTitle = () => title;
    const getDescription = () => description;
    const getDueDate = () => dueDate;
    const getPriority = () => priority;
    const getNotes = () => notes;
    const getSubTasks = () => subTasks;

    const setTitle = (input) => title = input;
    const setDescription = (input) => description = input;
    const setDueDate = (input) => dueDate = input;
    const setPriority = (input) => priority = input;
    const setNotes = (input) => notes = input;

    const addSubTask = (input) => subTasks.push(input);
    const removeSubTask = (index) => subTasks.splice(index, 1);

    return {
        getTitle,
        getDescription,
        getDueDate,
        getPriority,
        getNotes,
        getSubTasks,
        setTitle,
        setDescription,
        setDueDate,
        setPriority,
        setNotes,
        addSubTask,
        removeSubTask
    };
}