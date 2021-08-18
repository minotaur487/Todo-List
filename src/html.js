import './style.css';
import { Item } from './object.js'
import { restoreLocal, storageAvailable } from './storage'

function createCard(title, dueDate, body) {
  const item = document.createElement('div');
  const itemHeader = document.createElement('div');
  const itemBody = document.createElement('div');

  const itemTitle = document.createElement('span');
  const itemDueDate = document.createElement('span');

  itemTitle.textContent = title;
  itemDueDate.textContent = dueDate;
  itemBody.textContent = body;

  // Attach styles
  item.classList.toggle('item');
  itemHeader.classList.toggle('item-header');
  itemBody.classList.toggle('item-body');

  itemHeader.appendChild(itemTitle);
  itemHeader.appendChild(itemDueDate);
  item.appendChild(itemHeader);
  item.appendChild(itemBody);

  return item;
}

function listView(htmlList, data) {
  data.forEach((e) => {
    card = createCard(e.title, e.dueDate, e.body);
    htmlList.appendChild(card);
  })

  return htmlList;
}

function appendItemList(data) {
  const itemList = document.querySelector('.item-list');
  const newItem = createCard(data.title, data.dueDate, data.body);
  itemList.appendChild(newItem);
}

function initPage(list) {
  const container = document.createElement('div');
  const navigator = document.createElement('div');
  const header = document.createElement('header');
  const main = document.createElement('a');
  const priority = document.createElement('a');

  let itemList = document.createElement('div');
  itemList.classList.toggle('item-list');

  container.classList.toggle('interface');
  navigator.classList.toggle('navigator');
  main.textContent = 'Main';
  priority.textContent= 'Priority';

  // Build interface
  if (storageAvailable('localStorage')) {
    const data = restoreLocal(list);
    itemList = listView(itemList, data.list);
  }

  navigator.appendChild(main);
  navigator.appendChild(priority);
  container.appendChild(navigator);
  container.appendChild(itemList);

  // Attach interface to html
  document.body.appendChild(header);
  document.body.appendChild(container);
}

export {
  initPage,
  appendItemList
}