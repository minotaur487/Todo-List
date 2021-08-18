import { Item, ItemList } from './object.js'

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

const JSONtoItem = (item) => {
    return Item(item.title, item.dueDate, item.priority);
}

function saveLocal(listOfItems) {
    localStorage.setItem('listOfItems', listOfItems);
}

function restoreLocal(itemList) {
    const listOfItems = JSON.parse(localStorage.getItem('listOfItems'));
    if (listOfItems) {
        itemList.list = listOfItems.map(JSONtoItem);
    }

    return itemList;
}

export {
    saveLocal,
    restoreLocal,
    storageAvailable
}