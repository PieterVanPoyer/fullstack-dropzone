import { sayHello } from './greet';
import { Dropzone } from './dropzone/dropzone';
import { DropzoneFile } from './dropzone/model/dropzone-file';

const dropzone: Dropzone = new Dropzone(window.document.querySelector('.m-dropzone'), {
  uploadProgressLabel: 'upload progress',
  uploadErrorLabel: 'upload error',
  uploadCompleteLabel: 'Upload is compleet',
  browseLabel: 'browse.',
  dropFilesLabel: 'Sleep bestanden om bij te voegen of ',
});
dropzone.setReadonly(true);
dropzone.setReadonly(false);

dropzone.addOnFileDroppedEventListener((file, successCallback, errorCallback, progress) => {
  console.log(file);
  const output = document.querySelector('.output');
  output.innerHTML = '';
  if (file.file.type.indexOf('image/') === 0) {
    output.innerHTML += '<img width="200" src="' + URL.createObjectURL(file.file) + '" />';
  }
  output.innerHTML += '<p>' + file.file.name + '</p>';

  //setTimeout(() => {
  //    progress(25);
  //}, 1000);

  const formData = new FormData();
  formData.append('file', file.file);

  const xhr = new XMLHttpRequest();
  //xhr.file = file.file; // not necessary if you create scopes like this
  xhr.addEventListener(
    'progress',
    (e: any) => {
      const done = e.position || e.loaded,
        total = e.totalSize || e.total;
      const percentage = Math.floor((done / total) * 1000) / 10;
      progress(percentage);
      console.log('xhr progress: ' + Math.floor((done / total) * 1000) / 10 + '%');
    },
    false,
  );

  xhr.onerror = () => {
    console.log('** An error occurred during the transaction');
    errorCallback();
  };
  if (xhr.upload) {
    xhr.upload.onprogress = (e: any) => {
      const done = e.position || e.loaded,
        total = e.totalSize || e.total;
      const percentage = Math.floor((done / total) * 1000) / 10;
      progress(percentage);
      console.log(
        'xhr.upload progress: ' + done + ' / ' + total + ' = ' + Math.floor((done / total) * 1000) / 10 + '%',
      );
    };
  }
  xhr.onreadystatechange = (e: any) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log('xhr upload complete', e);
      file.canBeDeleted = true;
      file.canBeDownloaded = true;
      successCallback(file); // todo piv return data from backend, data as any
    }
  };
  xhr.open('post', 'http://localhost:3000/api/upload-file', true);
  // xhr.setRequestHeader("Content-Type","multipart/form-data");
  xhr.send(formData);
});

dropzone.addDownloadFileEventListener((dropzoneFile: DropzoneFile) => {
  console.log('download file', dropzoneFile);
  window.open(`http://localhost:3000/api/upload-file/${dropzoneFile.fileName}`);
});

dropzone.addOnDeleteFileEventListener((file, successCallback, errorCallback) => {
  const formData = new FormData();
  formData.append('file', file.file);
  fetch(`http://localhost:3000/api/upload-file/${file.id}`, {
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
  })
    .then(data => {
      console.log(JSON.stringify(data));
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
})
  .then(data => {
    console.log('result', data);
    data.json().then(jsonData => {
      console.log('json', jsonData);
      jsonData.forEach((aJson: any) => {
        if (aJson.thumbnail) {
          aJson.thumbnailUrl = 'http://localhost:3000/api/upload-file/' + aJson.thumbnail;
        }
      });
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

showHello('greeting', 'TypeScript');
