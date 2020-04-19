import { read, append, edit, remove, getContactById } from './storage.js';

export function init() {
  document.getElementById('form-add').addEventListener('submit', onSubmitAdd);
  document.getElementById('form-delete').addEventListener('submit', onSubmitDelete);
  document.getElementById('form-delete').addEventListener('change', onChangeDelete);
  navigator.serviceWorker.register('sw.js');
  render();
}

function addEventListenersToEditButtons() {
  document.querySelectorAll('.editbutton').forEach(element =>
    element.addEventListener('click', function (element) {
      onClickEdit(element.toElement.value);
    })
  );
}

function addEventListenerToSave(buttonId) {
  document.querySelectorAll('.savebutton').forEach(element => {
    if (element.value == buttonId)
      element.addEventListener('click', function (element) {
        onClickSave(element.toElement.value);
      });
  });
}

function addEventListenerToCancel(buttonId) {
  document.querySelectorAll('.cancelbutton').forEach(element => {
    if (element.value == buttonId)
      element.addEventListener('click', function (element) {
        onClickCancel(element.toElement.value);
      });
  });
}

function onSubmitAdd(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  data.set('id', Date.now());
  const contact = Object.fromEntries(data);
  append(contact);
  render();
}

function onSubmitDelete(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const contacts = read();
  data.getAll('id').forEach(id => {
    const contact = contacts.find(contact => contact.id === id);
    if (contact) {
      remove(contact);
    }
  });
  render();
}

function onChangeDelete(event) {
  const { form } = event.target;
  // const form = event.target.form;
  const data = new FormData(form);
  const hasChecked = data.getAll('id').length > 0;
  form.elements.delete.disabled = !hasChecked;
}

function onClickSave(buttonId) {
  document.getElementById(buttonId).childNodes.forEach(element => {
    if (element.tagName === 'INPUT') element.readOnly = true;

    switch (element.className) {
      case "editbutton": element.hidden = false; break;
      case "savebutton": element.hidden = true; break;
      case "cancelbutton": element.hidden = false; break;
    }
  });

  event.preventDefault();

  const contacts = read();
  
  contacts.forEach(element => {
    if (element.id === buttonId) {
      const contact = new Object;
      contact.id = buttonId;
      contact.name = document.getElementById(buttonId).childNodes[3].value;
      contact.email = document.getElementById(buttonId).childNodes[5].value;
      contact.phone = document.getElementById(buttonId).childNodes[7].value;
      edit(contact);
    }
  });
  render();
}

function onClickCancel(buttonId) {
  document.getElementById(buttonId).childNodes.forEach(element => {

    switch (element.name) {
      case "contactname": element.value = getContactById(buttonId).name; element.readOnly=true; break;
      case "contactemail": element.value = getContactById(buttonId).email; element.readOnly=true; break;
      case "contactphone": element.value = getContactById(buttonId).phone; element.readOnly=true; break;
    }

    console.log(element.className);
    switch (element.className) {
      case "editbutton": element.hidden = false;break;
      case "savebutton": element.hidden = true;break;
      case "cancelbutton": element.hidden = true;break;
    }
  });
}

function onClickEdit(buttonId) {
  event.preventDefault();
  document.getElementById(buttonId).childNodes.forEach(element => {
    if (element.tagName === 'INPUT') element.readOnly = false;
  });

  document.getElementById(buttonId).childNodes.forEach(element => {
    if (element.className === 'editbutton') element.hidden = true;
  });

  const saveButton = document.createElement('button');
  saveButton.innerHTML = 'Save';
  saveButton.setAttribute('type', 'button');
  saveButton.setAttribute('value', buttonId);
  saveButton.setAttribute('class', 'savebutton');
  document.getElementById(buttonId).appendChild(saveButton);
  addEventListenerToSave(buttonId);

  const cancelButton = document.createElement('button');
  cancelButton.innerHTML = 'Cancel';
  cancelButton.setAttribute('type', 'button');
  cancelButton.setAttribute('value', buttonId);
  cancelButton.setAttribute('class', 'cancelbutton');
  document.getElementById(buttonId).appendChild(cancelButton);
  addEventListenerToCancel(buttonId);
}

function render() {
  const contacts = read();
  const items = contacts.map(
    contact => `
        <label>
            <fieldset id="${contact.id}" name="contact-field" value="${contact.id}">
                <input type="checkbox" name="id" value="${contact.id}">
                <input type="text" name="contactname" value="${contact.name}" readonly>
                <input type="email" name="contactemail" value="${contact.email}" readonly>
                <input type="phone" name="contactphone" value="${contact.phone}" readonly>
                <button class="editbutton" type="button" value="${contact.id}">Edit</button>
            </fieldset>
        </label>
      </input>
    `
  );
  document.getElementById('list').innerHTML = items.join('');
  document.getElementById('form-delete').hidden = contacts.length === 0;
  addEventListenersToEditButtons();
}
