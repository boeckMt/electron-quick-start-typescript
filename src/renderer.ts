// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// In renderer process (web page).

const { ipcRenderer } = require('electron');
const { fs } = require('fs');
const { path } = require('path');

import { MainHelpers } from "./helpers";
const helpers = new MainHelpers();


//http://wesbos.com/template-strings-html/
function getContent() {
    var files_de = helpers.getContent('source/de/')
    var files_en = helpers.getContent('source/en/')

    let content = `
        <h3> Content DE </h3>
        <ul>
            ${files_de.map(file => `<li>${file}</li>`)}
        </ul>

        <h3> Content EN </h3>
        <ul>
            ${files_en.map(file => `<li>${file}</li>`)}
        </ul>
        `

    document.querySelector('#content').innerHTML = content;

}
getContent();

ipcRenderer.on('asynchronous-reply', (event: any, arg: any) => {
    console.log(arg) // prints "pong"
})


document.querySelector('#test_btn').addEventListener('click', () => {
    ipcRenderer.send('asynchronous-message', 'ping')
})