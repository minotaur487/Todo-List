function Project(name) {
    const props = {
        name,
        itemList: []
    }

    const clearItems = () => {
      props.itemList = []; // Must clear local storage
    }

    const addItem = (item) => props.itemList.push(item);
    const findItem = (itemName) => props.itemList.find(e => e.title === itemName);
    const removeItem = (itemName) => {
      props.itemList = props.itemList.filter((item) => item.title !== itemName
    )};
    
    const functions = {
      clearItems, addItem, findItem, removeItem
    }

    return Object.assign(props, functions);
}

function ProjectList() {
    const main = Project('Main');
    const today = Project('Today');
    const projectDict = {};
    projectDict[main.name] = main;
    projectDict[today.name] = today;
  
    const clearItems = () => {
      localStorage.clear();
      projectDict = {};
    }

    const deleteProject = (name) => delete projectDict[name];
  
    return { projectDict, clearItems, deleteProject };
  }

export {
    Project,
    ProjectList
}