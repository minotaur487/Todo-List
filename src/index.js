import { initPage, appendItemList } from "./html";
import { ItemList, Item } from "./object";

const itemList = ItemList();
initPage(itemList);
const newItem = Item('title', 'time', 'priori');
appendItemList(newItem);
