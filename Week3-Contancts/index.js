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
    console.log(event.target);
    const fd = new FormData(event.target);
    const contact = Object.fromEntries(fd);
    console.log(contact);
    append(contact);
    render();
}


function onSubmitDelete(event) {
    event.preventDefault();

    const form = document.getElementsByName("delete");
    var indexArray = [];
    for(var index = 0; index < form.length; index++)
        if (form[index].checked)
            indexArray.push(Array.prototype.indexOf.call(form[index].parentNode.parentNode.children, form[index].parentNode));

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
