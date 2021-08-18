function Item(title, dueDate, priority) {
  const props = {
    title,
    description: '',
    dueDate,
    priority    // implement a priority queue to sort this
  }
  
  const setDescription = (text) => description = text;
  const setTitle = (text) => title = text;
  return Object.assign(props, setDescription, setTitle);
}

function ItemList() {
  let list = [];

  const addItem = (item) => list.push(item);
  const clearItems = () => {
    localStorage.clear();
    list = [];
  }

  return { list, addItem, clearItems };
}

function listModel() {

}

export {
  Item,
  ItemList
}