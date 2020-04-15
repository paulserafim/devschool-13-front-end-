import {append, read, del} from './storage.js'

export function init() {
    window.addEventListener('DOMContentLoaded', onLoad);
}

function onLoad() {
    render();
    document.getElementById('form-add').addEventListener('submit', onSubmitAdd);
    document.getElementById('form-delete').addEventListener('submit', onSubmitDelete);
}

function onSubmitAdd(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const contact = Object.fromEntries(fd);
    append(contact);
    render();
}


function onSubmitDelete(event) {
    event.preventDefault();

    var indexArray = [];
    document.getElementsByName("delete").forEach(element => { 
        if(element.checked)
            indexArray.push(Array.prototype.indexOf.call(element.parentNode.parentNode.children, element.parentNode));
    });

    del(indexArray);
    render();
}

function render() {
    const contacts = read();
    const list = document.getElementById('list');
    const items = contacts.map(contact => `<li><input type="checkbox" name="delete" /> ${contact.name} &lt ${contact.email}&gt ${contact.phone} </li>`);
    list.innerHTML = items.join('');
    const formDelete = document.getElementById('form-delete');
    formDelete.hidden = contacts.length === 0;
}
