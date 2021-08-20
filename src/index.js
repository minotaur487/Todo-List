import flatpickr from "flatpickr";
import { initPage, appendItemList } from "./html";
import { ItemList, Item } from "./object";

const itemList = ItemList();
// const newItem2 = Item('s', 'd', 'd');
initPage(itemList);
