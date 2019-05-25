import { sayHello } from "./greet";
import { Dropzone } from './dropzone/dropzone';
import { DropzoneFile } from './dropzone/model/dropzone-file';

const dropzone: Dropzone = new Dropzone(window.document.querySelector('.m-dropzone'));
dropzone.addOnFileDroppedEventListener((file, successCallback, errorCallback) => {
    console.log(file);
    const output = document.querySelector('.output');
    output.innerHTML = '';
    if (file.file.type.indexOf('image/') === 0) {
        output.innerHTML += '<img width="200" src="' + URL.createObjectURL(file.file) + '" />';
    }
    output.innerHTML += '<p>' + file.file.name + '</p>';

    const formData = new FormData();
    formData.append('file', file.file);

    fetch('http://localhost:3000/api/upload-file', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        //headers: {
        //    'Content-Type': 'multipart/form-data', https://muffinman.io/uploading-files-using-fetch-multipart-form-data/
        //},
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: formData, // body data type must match "Content-Type" header
    }).then(data => {
        console.log(JSON.stringify(data))
        successCallback(data as any);
    }) // JSON-string from `response.json()` call
        .catch(error => {
            errorCallback(error);
        });
});

dropzone.addDownloadFileEventListener((dropzoneFile: DropzoneFile) => {
    console.log('download file', dropzoneFile);
    window.open(`http://localhost:3000/api/upload-file/${dropzoneFile.fileName}`);
});

dropzone.addOnDeleteFileEventListener((file, successCallback, errorCallback) => {
    const formData = new FormData();
    formData.append('file', file.file);

    fetch(`http://localhost:3000/api/upload-file/${file.fileName}`, {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        //headers: {
        //    'Content-Type': 'multipart/form-data', https://muffinman.io/uploading-files-using-fetch-multipart-form-data/
        //},
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: formData, // body data type must match "Content-Type" header
    }).then(data => {
        console.log(JSON.stringify(data))
        successCallback(data as any);
    }) // JSON-string from `response.json()` call
        .catch(error => {
            errorCallback(error);
        });
});

fetch('http://localhost:3000/api/upload-file', {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
        'Content-Type': 'application/json',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: undefined, // body data type must match "Content-Type" header
}).then(data => {
    console.log('result', data);
    data.json().then((jsonData) => {
        console.log('json', jsonData);
        dropzone.setDropzoneFiles(jsonData);
    });
}) // JSON-string from `response.json()` call
    .catch(error => {
        console.error('error during read', error);
    });

function showHello(divName: string, name: string) {
    const elt = document.getElementById(divName);
    elt.innerText = sayHello(name) + 'main upd this works veel beter!';
}

showHello("greeting", "TypeScript")
