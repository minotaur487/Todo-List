function ItemList() {
    let list = [];
  
    const addItem = (item) => list.push(item);
    const clearItems = () => {
      localStorage.clear();
      list = [];
    }
    const getItemList = () => list;
    const setItemList = (l) => list = l;
  
    return { setItemList, getItemList, addItem, clearItems };
  }
  
  function listModel() {
  
  }

  export default ItemList;