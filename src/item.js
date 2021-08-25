function Item(title, dueDate, priority) {
  const props = {
    title,
    description: '',
    dueDate,
    priority    // implement a priority queue to sort this
  }
  
  const setDescription = (text) => description = text;
  const setTitle = (text) => title = text;
  return { setDescription, setTitle };
}

function ItemList() {
  let list = [];

  const addItem = (item) => list.push(item);
  const clearItems = () => {
    localStorage.clear();
    list = [];
  }
  const getItems = () => list;
  const setItems = (l) => list = l;

  return { setItems, getItems, addItem, clearItems };
}

function listModel() {

}

export {
  Item,
  ItemList
}