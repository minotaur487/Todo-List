import flatpickr from "flatpickr";
import { initPage } from "./view";
import { restoreLocal, storageAvailable } from './storage';
import { ProjectList } from './project';


if (storageAvailable('localStorage')) {
    let projectList = restoreLocal();
    if (projectList)
      initPage(projectList);
    else
      initPage(ProjectList());
  }
else {
    const projectList = ProjectList();
    initPage(projectList);
}
