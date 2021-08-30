import './style.css';
import flatpickr from 'flatpickr';
import * as Storage from './storage';

    // Helper Functions

function toggleInput() {
  const inputTitle = this.nextElementSibling;
  this.classList.toggle('off');

  inputTitle.value = this.textContent;
  inputTitle.classList.toggle('off');
}

function removeCurrentItem() {
  const item = this.closest('.item');
  const itemTitle = item.querySelector('.title-id');
  this.classList.toggle('off');
  this.nextElementSibling.classList.toggle('off');
  item.classList.toggle('completed-icon-onclick');
  const project= document.querySelector('.current-project');
  Storage.deleteItem(project.textContent, itemTitle.textContent);
}

function handleEscape(e) {
  if (e.key === 'Escape') {
    const uninitializedItems = document.querySelector('input.input-title-id:not(.off)');
    uninitializedItems.closest('.item').remove();
  }
}

function renameItem(e) {
  if (e.key === 'Enter' && this.value === '') {
    alert('Title must not be blank');
    this.focus();
    return;
  }
  else if (e.key === 'Enter') {
    const titleElement = this.previousElementSibling;
    const title = this.value;
    const project= document.querySelector('.current-project');
    Storage.updateTaskTitle(project.textContent, titleElement.textContent, title);
    titleElement.textContent = title;
    titleElement.classList.toggle('off');
    this.classList.toggle('off');
  }
}

function toggleItemBody() {
  const input = this.querySelector('textarea');
  const text = this.querySelector('p');

  text.classList.toggle('off');
  input.classList.toggle('off');
  input.focus();
}

function onChangeFunction(selectedDates, dateStr, instance) {
  const inputBox = instance.element;
  const text = inputBox.previousElementSibling;
  inputBox.classList.toggle('off');
  text.classList.toggle('off');
  const date = instance.selectedDates[0];
  text.textContent = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
  const project= document.querySelector('.current-project');
  const itemTitle = text.closest('.item').querySelector('.title-id');
  Storage.updateTaskDueDate(project.textContent, itemTitle.textContent, date);
}

function toggleDueDate(e) {
  const container = this.closest('.item-due-date');
  const text = container.querySelector('p');
  const input = container.querySelector('input');
  text.classList.toggle('off');
  input.classList.toggle('off');
  input.focus();
}

function editItemBody(e) {
  const body = e.previousElementSibling;
  body.textContent = e.value;
  body.classList.toggle('off');
  e.classList.toggle('off');

  const project= document.querySelector('.current-project');
  const itemTitle = e.parentElement.previousElementSibling.querySelector('.title-id');
  Storage.updateTaskDescription(project.textContent, itemTitle.textContent, e.value);
}

function addItemClick() {
  if (document.querySelectorAll('.input-title-id:not(.off)').length > 0) {
    return alert('You must finish filling out your current item.');
  }
  const newItem = createCard();
  appendItemList(newItem);

  const itemTitle = newItem.querySelector('.title-id');
  const inputTitle = newItem.querySelector('.input-title-id');
  itemTitle.classList.toggle('off');
  inputTitle.classList.toggle('off');
  inputTitle.focus();
  const project= document.querySelector('.current-project');
  Storage.addTask(project.textContent, 'No title');
}

function changeProject() {
  const previousProject = document.querySelector('.current-project');
  previousProject.classList.toggle('current-project');
  if (previousProject.style.removeProperty) {
    previousProject.parentElement.style.removeProperty('background-color');
  } else {
    previousProject.parentElement.style.removeAttribute('background-color');
  }
  this.parentElement.style.backgroundColor = 'darkgrey';
  this.classList.toggle('current-project');
  if (this.textContent === 'Today') {
    const projectList = Storage.getProjectList();
    Storage.loadToday();
  }
  const pL = Storage.getProjectList().projectDict;
  const itemList = createItemList(pL[this.textContent].itemList);
  const view = document.querySelector('.interface');
  view.appendChild(itemList);
}

function toggleExpandCardBody() {
  const itemBody = this.parentElement.parentElement.parentElement.parentElement.querySelector('.item-body');
  const item = itemBody.parentElement;
  if (this.textContent === 'expand_more') {
    this.textContent = 'expand_less';
    itemBody.classList.toggle('off');
    item.classList.toggle('item-expanded');
  }
  else {
    this.textContent = 'expand_more';
    itemBody.classList.toggle('off');
    item.classList.toggle('item-expanded');
  }
}

    // View constructors

function createItemHeader(title, dueDate) {
  function createTitle(t) {
    const titleContainer = document.createElement('div');
    const inputTitle = document.createElement('input');
    const itemTitle = document.createElement('span');
    inputTitle.setAttribute('type', 'text');
    inputTitle.classList.toggle('off');
    inputTitle.classList.toggle('input-title-id');
    inputTitle.setAttribute('maxlength', '20');
    inputTitle.setAttribute('size', '20');
    itemTitle.classList.toggle('title-id');
  
    inputTitle.addEventListener('keypress', renameItem);
    itemTitle.addEventListener('click', toggleInput);
    itemTitle.textContent = t;
    titleContainer.classList.toggle('item-title');
    titleContainer.classList.toggle('item-header-subitem');
  
    titleContainer.appendChild(itemTitle);
    titleContainer.appendChild(inputTitle);
    return titleContainer;
  }

  function createDueDate(date) {
    const dueDateContainer = document.createElement('div');
    const inputDueDate = document.createElement('input');
    const dueDateText = document.createElement('p');
    const calendarIcon = document.createElement('i');
    calendarIcon.classList.toggle('material-icons');
    calendarIcon.textContent = 'today';
    calendarIcon.addEventListener('click', toggleDueDate);
    inputDueDate.setAttribute('type', 'text');
    dueDateText.addEventListener('click', toggleDueDate);
    dueDateText.textContent = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
    inputDueDate.classList.toggle('off');
    dueDateContainer.classList.toggle('item-due-date');
    dueDateContainer.classList.toggle('item-header-subitem');
    dueDateContainer.append(calendarIcon, dueDateText, inputDueDate);
    return dueDateContainer;
  }
  
  function createHeaderIcons() {
    const expandIconContainer = document.createElement('div');
    const expandIcon = document.createElement('i');
    expandIcon.classList.toggle('material-icons');
    expandIconContainer.classList.toggle('item-header-subitem');
    expandIconContainer.classList.toggle('expand-body-icon');
    expandIcon.textContent = 'expand_more';
    expandIcon.addEventListener('click', toggleExpandCardBody);
    expandIconContainer.appendChild(expandIcon);
    
    const completedIconContainer = document.createElement('div');
    const uncompletedIcon = document.createElement('i');
    const completedIcon = document.createElement('i');
    completedIconContainer.classList.toggle('item-header-subitem');
    completedIconContainer.classList.toggle('completed-icon-container');
    uncompletedIcon.classList.toggle('material-icons');
    uncompletedIcon.textContent = 'radio_button_unchecked';
    completedIcon.classList.toggle('off');
    completedIcon.classList.toggle('material-icons');
    completedIcon.textContent = 'radio_button_checked';
    uncompletedIcon.addEventListener('click', removeCurrentItem);
    completedIconContainer.append(uncompletedIcon, completedIcon);

    const icons = {
      completedIcon: completedIconContainer,
      expandIcon: expandIconContainer
    }
  
    return icons;
  }

  // gap
  const gap = document.createElement('div');
  gap.classList.toggle('gap');

  // Header container
  const itemHeader = document.createElement('div');
  const itemHeaderContainer = document.createElement('div');
  itemHeaderContainer.classList.toggle('header-container');
  itemHeader.classList.toggle('item-header');

  // Get header components
  const icons = createHeaderIcons();
  const completedIcon = icons.completedIcon;
  const expandIcon= icons.expandIcon;
  const titleElement = createTitle(title);
  const dueDateElement = createDueDate(dueDate);

  itemHeader.append(completedIcon, titleElement, gap, dueDateElement,
    expandIcon);
  itemHeaderContainer.appendChild(itemHeader);

  return itemHeaderContainer;
}

function createItemBody(body) {
  function handleDescriptionClick() {
    const textBox = document.querySelector('.item-body:not(.off)').querySelector('textarea:not(.off)');
    textBox.editItemBody({key: 'Enter'});
  }
  const itemBody = document.createElement('div');
  
  // Elements inside of the containers
  const bodyText = document.createElement('p');
  const inputBody = document.createElement('textarea');

  // document.addEventListener('click', handleDescriptionClick);
  inputBody.addEventListener('change', function(e) {
    editItemBody(this);
  });
  inputBody.classList.toggle('off');
  inputBody.setAttribute('maxlength', '1000');
  inputBody.setAttribute('rows', '5');
  inputBody.setAttribute('cols', '70');
  inputBody.addEventListener('keypress', function(e) {
    if (e.key === 'Enter')
      editItemBody(this);
  });
  itemBody.addEventListener('click', toggleItemBody);
  bodyText.textContent = body;
  itemBody.classList.toggle('item-body');
  itemBody.classList.toggle('off');
  itemBody.appendChild(bodyText);
  itemBody.appendChild(inputBody);

  return itemBody;
}

function createCard(title='No title', dueDate=new Date(), body='') {
  const item = document.createElement('div');
  const itemHeader = createItemHeader(title, dueDate);
  const itemBody = createItemBody(body);
  
  // Attach styles
  item.classList.toggle('item');
  item.addEventListener('transitionend', function() {this.remove();});

  item.appendChild(itemHeader);
  item.appendChild(itemBody);

  return item;
}

function addItemButton() {
  const button = document.createElement('div');
  const icon = document.createElement('i');
  icon.classList.toggle('material-icons');
  icon.textContent = 'add';

  button.setAttribute('id', 'add-item-button');
  button.addEventListener('click', addItemClick);
  button.appendChild(icon);
  return button;
}

function listView(itemList, data) {
  let card;
  data.forEach((e) => {
    card = createCard(e.title, e.dueDate, e.description);
    flatpickr(card.querySelector('.item-due-date').querySelector('input'), {
      onChange: onChangeFunction,
      // altInput: true,
      // altFormat: "F j, Y"
    });
    itemList.appendChild(card);
  })

  return itemList;
}

function appendItemList(newItem) {
  const itemList = document.querySelector('.item-list');
  
  if (itemList.lastElementChild.tagName === 'DIV') {
    itemList.insertBefore(newItem, itemList.lastElementChild)
  }
  else {
    itemList.appendChild(newItem);
  }
  flatpickr(newItem.querySelector('.item-due-date').querySelector('input'), {
    onChange: onChangeFunction,
    // altInput: true,
    // altFormat: "F j, Y"
  });
}

function createItemList(itemList) {
  let itemListContainer = document.querySelector('#item-list-container');
  if (!!itemListContainer) {
    itemListContainer.remove();
  }
  const itemListText = document.createElement('div');
  const container = document.createElement('div');
  itemListText.setAttribute('id', 'item-list-label')
  container.setAttribute('id', 'item-list-container');
  itemListContainer = document.createElement('div');
  itemListContainer.classList.toggle('item-list');
  const newCardButton = addItemButton();
  itemListContainer = listView(itemListContainer, itemList);
  itemListContainer.appendChild(newCardButton);
  const project= document.querySelector('.current-project');
  itemListText.textContent = project ? project.textContent : 'Main';
  container.append(itemListText, itemListContainer);
  return container;
}

function createNavigator(projectList, currentProjectName) {
  function nameProject(e) {
    if (e.key === 'Enter' && this.value === '') {
      alert('Project name must not be blank');
      this.focus();
      return;
    }
    else if (e.key === 'Enter') {
      const projectNameElement = this.previousElementSibling.lastElementChild.lastElementChild;
      const name = this.value;
      Storage.addProject(name);
      projectNameElement.textContent = name;
      projectNameElement.classList.toggle('off');
      this.parentElement.removeChild(this);
      document.querySelector('#add-project-button').classList.toggle('off');
    }
  }
  function addProjectClick() {
    // Build Input
    const inputNewProject = document.createElement('input');
    inputNewProject.setAttribute('type', 'text');
    inputNewProject.setAttribute('id', 'input-new-project');
    inputNewProject.addEventListener('keypress', nameProject);
    inputNewProject.focus();

    // Build Label
    const newProjectLabel = document.createElement('a');
    const newProjectContainer = document.createElement('div');
    newProjectContainer.classList.toggle('project-label-container');
    newProjectContainer.append(newProjectLabel);
    newProjectLabel.classList.toggle('off');
    newProjectLabel.addEventListener('click', changeProject)
    const navContainer = document.querySelector('#project-nav-container');
    const navList = document.querySelector('#project-nav-list');
    navList.append(newProjectContainer);
    navContainer.insertBefore(inputNewProject, navContainer.lastElementChild);
    document.querySelector('#add-project-button').classList.toggle('off');
  }

  function expandProjectList() {
    if (this.textContent === 'expand_more')
      this.textContent = 'expand_less';
    else if (this.textContent === 'expand_less')
      this.textContent = 'expand_more';
    this.parentElement.nextElementSibling.classList.toggle('off');
  }
  
  function createNavHeader() {
    const projectNavHeader = document.createElement('div');
    projectNavHeader.setAttribute('id', 'nav-header');

    // Label
    const projectLabel = document.createElement('span');
    projectLabel.textContent = 'Lists';

    // Expand Icon
    const expandProjectsIcon = document.createElement('i');
    expandProjectsIcon.classList.toggle('material-icons');
    expandProjectsIcon.textContent = 'expand_more';
    expandProjectsIcon.addEventListener('click', expandProjectList)
    projectLabel.addEventListener('click', expandProjectList)
    projectNavHeader.append(expandProjectsIcon, projectLabel);
    return projectNavHeader;
  }
  
  const projectNavContainer = document.createElement('div');
  const projects = document.createElement('div');

  projectNavContainer.setAttribute('id', 'project-nav-container');
  projects.setAttribute('id', 'project-nav-list');
  projects.classList.toggle('off');

  const navigator = document.createElement('div');
  const pL = projectList.projectDict;
  navigator.classList.toggle('navigator');
  
  let name = '';
  for (let key in pL) {
    const a = document.createElement('a');
    name = pL[key].name;
    a.textContent = name;
    a.addEventListener('click', changeProject);
    const labelContainer = document.createElement('div');
    labelContainer.classList.toggle('project-label-container');
    if (name === currentProjectName) {
      a.classList.toggle('current-project');
      labelContainer.style.backgroundColor = 'darkgrey';
    }
    if (name === 'Main' || name === 'Today') {
      const labelIcon = document.createElement('i');
      labelIcon.classList.toggle('material-icons');
      labelIcon.textContent = name === 'Main' ? 'list' : 'calendar_today';
      labelContainer.append(labelIcon, a);
      navigator.appendChild(labelContainer);
    }
    else
    {
      labelContainer.append(a);
      projects.appendChild(labelContainer);
    }
  }

  const button = document.createElement('div');
  const icon = document.createElement('i');
  icon.classList.toggle('material-icons');
  icon.textContent = 'add';

  button.setAttribute('id', 'add-project-button');
  button.addEventListener('click', addProjectClick);
  button.appendChild(icon);

  const header = createNavHeader();
  projectNavContainer.append(header, projects, button);
  navigator.appendChild(projectNavContainer);
  return navigator;
}

function initPage(projectList) {
  const icons = document.createElement('link');
  const container = document.createElement('div');
  const header = document.createElement('header');
  header.textContent = 'Todo List';

  // Setting up icons
  icons.setAttribute('rel', 'stylesheet');
  icons.setAttribute('href', 'https://fonts.googleapis.com/icon?family=Material+Icons');
  const head = document.querySelector('head');
  head.appendChild(icons);

  // General interface
  container.classList.toggle('interface');


  // Build interface
  const navigator = createNavigator(projectList, 'Main');
  const homeProject = projectList.projectDict['Main'];
  const itemListContainer = createItemList(homeProject.itemList);

  container.appendChild(navigator);
  container.appendChild(itemListContainer);

  // Attach interface to html
  document.body.appendChild(header);
  document.body.appendChild(container);
  document.addEventListener('keydown', handleEscape);
}

export {
  initPage,
  appendItemList
}