import './style.css';
import flatpickr from 'flatpickr';
import * as Storage from './storage';

    // Helper Functions

function toggleInput() {
  const inputTitle = this.nextElementSibling;
  this.classList.toggle('off');

  inputTitle.classList.toggle('off');
  inputTitle.value = this.textContext;
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
  const inputBox = document.querySelector('.item-due-date').lastElementChild;
  const text = inputBox.previousElementSibling;
  inputBox.classList.toggle('off');
  text.classList.toggle('off');
  text.textContent = instance.selectedDates[0].toString();
}

function toggleDueDate(e) {
  this.classList.toggle('off');
  this.nextElementSibling.classList.toggle('off');
  this.nextElementSibling.focus();
}

function editItemBody(e) {
  if (e.key === 'Enter') {
    const body = this.previousElementSibling;
    body.textContent = this.value;
    body.classList.toggle('off');
    this.classList.toggle('off');

    const project= document.querySelector('.current-project');
    const itemTitle = this.closest('.title-id');
    Storage.updateTaskDescription(project.textContent, itemTitle.textContent, this.value);
  }
}

function addItemClick() {
  if (document.querySelectorAll('.input-title-id.off').length > 1) {
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

  function createDueDate(d) {
    const dueDateContainer = document.createElement('div');
    const inputDueDate = document.createElement('input');
    const dueDateText = document.createElement('p');
    inputDueDate.setAttribute('type', 'text');
    dueDateText.addEventListener('click', toggleDueDate);
    inputDueDate.classList.toggle('off');
    dueDateText.textContent = d;
    dueDateContainer.classList.toggle('item-due-date');
    dueDateContainer.classList.toggle('item-header-subitem');
    dueDateContainer.appendChild(dueDateText);
    dueDateContainer.appendChild(inputDueDate);
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
  const itemBody = document.createElement('div');
  
  // Elements inside of the containers
  const bodyText = document.createElement('p');
  const inputBody = document.createElement('textarea');

  inputBody.classList.toggle('off');
  inputBody.setAttribute('maxlength', '1000');
  inputBody.setAttribute('rows', '5');
  inputBody.setAttribute('cols', '70');
  inputBody.addEventListener('keypress', editItemBody);
  itemBody.addEventListener('click', toggleItemBody);
  itemBody.textContent = body;
  itemBody.classList.toggle('item-body');
  itemBody.classList.toggle('off');
  itemBody.appendChild(bodyText);
  itemBody.appendChild(inputBody);

  return itemBody;
}

function createCard(title='No title', dueDate='No due date', body='') {
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
    card = createCard(e.title, e.dueDate, e.body);
    itemList.appendChild(card);
  })

  return itemList;
}

function appendItemList(newItem) {
  const itemList = document.querySelector('.item-list');
  // const newItem = createCard(data.title, data.dueDate, data.body);
  
  if (itemList.lastElementChild.tagName === 'DIV') {
    itemList.insertBefore(newItem, itemList.lastElementChild)
  }
  else {
    itemList.appendChild(newItem);
  }
  flatpickr(newItem.querySelector('.item-due-date').lastElementChild, {
    onChange: onChangeFunction
  });
}

function createItemList(itemList) {
  let itemListContainer = document.querySelector('.item-list');
  if (!!itemListContainer) {
    itemListContainer.remove();
  }
  itemListContainer = document.createElement('div');
  itemListContainer.classList.toggle('item-list');
  const newCardButton = addItemButton();
  itemListContainer = listView(itemListContainer, itemList);
  itemListContainer.appendChild(newCardButton);

  return itemListContainer;
}

function createNavigator(projectList, currentProjectName) {
  function nameProject(e) {
    if (e.key === 'Enter' && this.value === '') {
      alert('Project name must not be blank');
      this.focus();
      return;
    }
    else if (e.key === 'Enter') {
      const projectNameElement = this.previousElementSibling;
      const name = this.value;
      Storage.addProject(name);
      projectNameElement.textContent = name;
      projectNameElement.classList.toggle('off');
      this.parentElement.removeChild(this);
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
    newProjectLabel.classList.toggle('off');
    const navContainer = document.querySelector('#project-nav-container');
    navContainer.insertBefore(inputNewProject, navContainer.lastElementChild);
    navContainer.insertBefore(newProjectLabel, navContainer.lastElementChild);
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
    expandProjectsIcon.addEventListener('click', function() {
      if (this.textContent === 'expand_more')
        this.textContent = 'expand_less';
      else
        this.textContent = 'expand_more';
      this.parentElement.nextElementSibling.classList.toggle('off');
    })
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
    a.addEventListener('click', function() {
      const itemList = createItemList(pL[key].itemList);
      const view = document.querySelector('.interface');
      view.appendChild(itemList);
      const previousProject = document.querySelector('.current-project');
      previousProject.classList.toggle('current-project');
      this.classList.toggle('current-project');
    })
    if (name === currentProjectName)
      a.classList.toggle('current-project');
    if (name === 'Main' || name === 'Today')
    {
      navigator.appendChild(a);
    }
    else
      projects.appendChild(a);
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

  // Setting up icons
  icons.setAttribute('rel', 'stylesheet');
  icons.setAttribute('href', 'https://fonts.googleapis.com/icon?family=Material+Icons');
  const head = document.querySelector('head');
  head.appendChild(icons);

  // General interface
  container.classList.toggle('interface');


  // Build interface
  const homeProject = projectList.projectDict['Main'];
  const itemListContainer = createItemList(homeProject.itemList);
  const navigator = createNavigator(projectList, 'Main');

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