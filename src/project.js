import { ItemList } from './item'

function Project(name, itemList) {
    const props = {
        name,
        itemList
    }

    const setName = (n) => props.name = n;
    const getName = () => props.name;
    const getItemList = () => props.itemList.getItems();
    const appendItemList = (item) => props.itemList.addItem(item);
    const resetItemList = () => props.itemList.clear();
    return { setName, getName, getItemList, appendItemList, resetItemList};
}

function ProjectList() {
    const main = Project('Main', ItemList());
    const today = Project('Today', ItemList());
    let list = {};
    list[main.getName()] = main;
    list[today.getName()] = today;
  
    const addProject = (project) => {
        const projectName = project.getName();
        const projectObj = {};
        projectObj[projectName] = project;
        return Object.assign(list, projectObj);
    }
    const clearItems = () => {
      localStorage.clear();
      list = {};
    }
    const getProjectList = () => list;
    const setProjectList = (l) => list = l;
  
    return { setProjectList, getProjectList, addProject, clearItems };
  }

export {
    Project,
    ProjectList
}