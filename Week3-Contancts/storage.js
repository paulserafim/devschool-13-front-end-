export function read() {
    const data = window.localStorage.getItem('ds-contacts');
    return data===null ? [] : JSON.parse(data); //in local storage punem doar stringuri
}

function write(contacts) {
    const data = JSON.stringify(contacts);//transforma in string
    window.localStorage.setItem('ds-contacts',data);
}

export function append (contact) {
    const contacts = read();
    contacts.push(contact);
    write(contacts);
}

export function del (indexArray) {
    const contacts = read();
    for (var index = 0; index < indexArray.length; index++)
        contacts.splice(indexArray[index], 1);
    write(contacts);
}