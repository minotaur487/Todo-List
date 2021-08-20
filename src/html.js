import './style.css';
import { Item } from './object.js';
import { restoreLocal, storageAvailable } from './storage';
import flatpickr from 'flatpickr';


function toggleInput() {
  const inputTitle = this.nextElementSibling;
  this.classList.toggle('off');

  inputTitle.classList.toggle('off');
  inputTitle.value = itemTitle.textContext;
}

function handleEscape(e) {
  if (e.key === 'Escape') {
    const uninitializedItems = document.querySelector('input#input-title-id:not(.off)');
    uninitializedItems.parentElement.parentElement.parentElement.remove();
  }
}

function renameItem(e) {
  if (e.key === 'Enter' && this.value === '') {
    alert('Title must not be blank');
    this.focus();
    return;
  }
  else if (e.key === 'Enter') {
    const title = this.previousElementSibling;
    title.textContent = this.value;
    title.classList.toggle('off');
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
  }
}

function addItemClick() {
  const newItem = createCard();
  appendItemList(newItem);

  const itemTitle = newItem.querySelector('#title-id');
  const inputTitle = newItem.querySelector('#input-title-id');
  itemTitle.classList.toggle('off');
  inputTitle.classList.toggle('off');
  inputTitle.focus();
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

function createCard(title='No title', dueDate='No due date', body='') {
  const item = document.createElement('div');
  const itemHeader = document.createElement('div');
  const itemHeaderContainer = document.createElement('div');
  const itemBody = document.createElement('div');
  const titleContainer = document.createElement('div');
  const dueDateContainer = document.createElement('div');
  const expandIconContainer = document.createElement('div');
  const expandIcon = document.createElement('i');
  const completedIconContainer = document.createElement('div');

  // Elements inside of the containers
  const bodyText = document.createElement('p');
  const inputBody = document.createElement('textarea');
  const inputTitle = document.createElement('input');
  const gap = document.createElement('div');
  const inputDueDate = document.createElement('input');
  const dueDateText = document.createElement('p');
  const itemTitle = document.createElement('span');
  const completedIcon = document.createElement('i');

  completedIconContainer.classList.toggle('item-header-subitem');
  completedIconContainer.classList.toggle('completed-item-icon');
  inputTitle.setAttribute('type', 'text');
  inputBody.classList.toggle('off');
  inputTitle.classList.toggle('off');
  inputDueDate.setAttribute('type', 'text');
  expandIcon.classList.toggle('material-icons');
  expandIcon.textContent = 'expand_more';
  completedIcon.classList.toggle('material-icons');
  completedIcon.textContent = 'radio_button_unchecked';

  inputTitle.setAttribute('id', 'input-title-id');
  inputTitle.setAttribute('maxlength', '20');
  inputTitle.setAttribute('size', '20');
  itemTitle.setAttribute('id', 'title-id');
  inputBody.setAttribute('maxlength', '1000');
  inputBody.setAttribute('rows', '5');
  inputBody.setAttribute('cols', '70');

  inputTitle.addEventListener('keypress', renameItem);
  itemTitle.addEventListener('click', toggleInput);
  expandIcon.addEventListener('click', toggleExpandCardBody);
  expandIconContainer.classList.toggle('item-header-subitem');
  expandIconContainer.classList.toggle('expand-body-icon');
  inputBody.addEventListener('keypress', editItemBody);
  itemBody.addEventListener('click', toggleItemBody);
  dueDateText.addEventListener('click', toggleDueDate);
  inputDueDate.classList.toggle('off');

  expandIconContainer.appendChild(expandIcon);
  titleContainer.appendChild(itemTitle);
  titleContainer.appendChild(inputTitle);
  completedIconContainer.appendChild(completedIcon);

  itemTitle.textContent = title;
  dueDateText.textContent = dueDate;
  itemBody.textContent = body;

  // Attach styles
  item.classList.toggle('item');
  gap.classList.toggle('gap');
  itemHeader.classList.toggle('item-header');
  itemBody.classList.toggle('item-body');
  itemBody.classList.toggle('off');
  titleContainer.classList.toggle('item-title');
  dueDateContainer.classList.toggle('item-due-date');
  dueDateContainer.classList.toggle('item-header-subitem');
  titleContainer.classList.toggle('item-header-subitem');
  itemHeaderContainer.classList.toggle('header-container');
  // inputDueDate.addEventListener('click', updateDate);

  itemBody.appendChild(bodyText);
  itemBody.appendChild(inputBody);
  dueDateContainer.appendChild(dueDateText);
  dueDateContainer.appendChild(inputDueDate);
  itemHeader.appendChild(completedIconContainer);
  itemHeader.appendChild(titleContainer);
  itemHeader.appendChild(gap);
  itemHeader.appendChild(dueDateContainer);
  itemHeader.appendChild(expandIconContainer);
  itemHeaderContainer.appendChild(itemHeader);
  item.appendChild(itemHeaderContainer);
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

function listView(htmlList, data) {
  data.forEach((e) => {
    card = createCard(e.title, e.dueDate, e.body);
    htmlList.appendChild(card);
  })

  return htmlList;
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

function initPage(list) {
  const icons = document.createElement('link');
  const container = document.createElement('div');
  const navigator = document.createElement('div');
  const header = document.createElement('header');
  const main = document.createElement('a');
  const priority = document.createElement('a');

  // Setting up icons
  icons.setAttribute('rel', 'stylesheet');
  icons.setAttribute('href', 'https://fonts.googleapis.com/icon?family=Material+Icons');
  const head = document.querySelector('head');
  head.appendChild(icons);

  // Item list
  let itemList = document.createElement('div');
  itemList.classList.toggle('item-list');

  // General interface
  container.classList.toggle('interface');
  navigator.classList.toggle('navigator');
  main.textContent = 'Main';
  priority.textContent= 'Priority';

  // Build interface
  if (storageAvailable('localStorage')) {
    const data = restoreLocal(list);
    itemList = listView(itemList, data.list);
  }
  const newCardButton = addItemButton();
  itemList.appendChild(newCardButton);
  navigator.appendChild(main);
  navigator.appendChild(priority);
  container.appendChild(navigator);
  container.appendChild(itemList);

  // Attach interface to html
  document.body.appendChild(header);
  document.body.appendChild(container);
  document.addEventListener('keydown', handleEscape);
}

// function updateDate() {
//   const year, month, day;
//   year, month, day = this.value.split('-');
// }

export {
  initPage,
  appendItemList
}