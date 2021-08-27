import Item from './item'
import { Project, ProjectList } from './project'

const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

export function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

const JSONtoItem = (item) => {
    const date = new Date(item.dueDate);
    item.dueDate = date;
    return Object.assign(Item(), item);
}

export function saveLocal(projectList) {
    localStorage.setItem('projectList', JSON.stringify(projectList));
}

export function getProjectList() {
    const data = JSON.parse(localStorage.getItem('projectList'));
    if (data) {
        const projectList = Object.assign(ProjectList(), data);
        for (let project in projectList.projectDict) {
            const curProj = projectList.projectDict[project];
            projectList.projectDict[project] = Object.assign(Project(curProj.name), curProj);
            projectList.projectDict[project].itemList = projectList.projectDict[project].itemList.map(JSONtoItem);            
        }
        return projectList;
    }
    return null;
}

export function deleteProject(name) {
    const projectList = getProjectList();
    projectList.deleteProject(name);
    saveLocal(projectList);
}

export function addProject(name) {
    const projectList = getProjectList();
    const project = Project(name)
    projectList.projectDict[name] = project;
    // projectList.addProject(project);
    saveLocal(projectList);
}

export function addTask(projectName, itemName, dueDate=Date()) {
    const projectList = getProjectList();
    const item = Item(itemName, dueDate, '');
    projectList.projectDict[projectName].addItem(item);
    saveLocal(projectList);
}

export function updateTaskDueDate(projectName, itemName, dueDate) {
    const projectList = getProjectList();
    projectList.projectDict[projectName].findItem(itemName).dueDate = dueDate;
    saveLocal(projectList);
}

export function updateTaskTitle(projectName, itemName, newName) {
    const projectList = getProjectList();
    projectList.projectDict[projectName].findItem(itemName).title = newName;
    saveLocal(projectList);
}

export function updateTaskDescription(projectName, itemName, body) {
    const projectList = getProjectList();
    projectList.projectDict[projectName].findItem(itemName).description = body;
    saveLocal(projectList);
}

export function deleteItem(projectName, itemName) {
    const projectList = getProjectList();
    projectList.projectDict[projectName].removeItem(itemName);
    if (projectName === 'Today') {
        for (let project in projectList.projectDict) {
            projectList.projectDict[project].itemList.forEach(element => {
                if (element.title === itemName && isToday(element.dueDate))
                    projectList.projectDict[project].removeItem(itemName);
            });
        }
    }
    saveLocal(projectList);
}

export function loadToday() {    
    const projectList = getProjectList();
    const projectDict = projectList.projectDict;
    projectList.projectDict['Today'].clearItems();
    let cumulativeItemList = [];
    for (let project in projectDict) {
      const filteredItemList = projectDict[project].itemList.filter((item) => {
        return isToday(item.dueDate);
      })
      cumulativeItemList = cumulativeItemList.concat(filteredItemList);
    }
    projectList.projectDict['Today'].itemList = cumulativeItemList;
    saveLocal(projectList);
  }