import flatpickr from "flatpickr";
import { initPage } from "./view";
import * as Storage from './storage';
import { ProjectList } from './project';

if (Storage.storageAvailable('localStorage')) {
    // localStorage.clear();
    let projectList = Storage.getProjectList();
    if (projectList)
      initPage(projectList);
    else {
      const pL = ProjectList();
      Storage.saveLocal(pL);
      initPage(pL);
    }
  }
else {
    const projectList = ProjectList();
    initPage(projectList);
}
