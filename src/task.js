export default function Task() {
    let title = '';
    let description = '';
    let dueDate = '';
    let priority = 4;
    let notes = '';
    let subTasks = [];
    let isMyDay = false;
    let isImportant = false;
    let isChecked = false;
    let indexes = '';

    const getTitle = () => title;
    const getDescription = () => description;
    const getDueDate = () => dueDate;
    const getPriority = () => priority;
    const getNotes = () => notes;
    const getSubTasks = () => subTasks;
    const getIsMyDay = () => isMyDay;
    const getIsImportant = () => isImportant;
    const getIsChecked = () => isChecked;
    const getIndexes = () => indexes;

    const setTitle = (input) => title = input;
    const setDescription = (input) => description = input;
    const setDueDate = (input) => dueDate = input;
    const setPriority = (input) => priority = input;
    const setNotes = (input) => notes = input;
    const setIsMyDay = (bool) => isMyDay = bool;
    const setIsImportant = (bool) => isImportant = bool;
    const setIsChecked = (bool) => isChecked = bool;
    const setIndexes = (value) => indexes = value;

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
        removeSubTask,
        getIsMyDay,
        setIsMyDay,
        getIsImportant,
        setIsImportant,
        getIsChecked,
        setIsChecked,
        getIndexes,
        setIndexes
    };
}