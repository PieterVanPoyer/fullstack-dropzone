# dropzone-frontend

Turns an html5 - component in an amazing dropzone for fileupload.
- There is a fallback to an html5 with input type file provided.
- It can directly be consumed as a typescript library.
- Styling can be changed through changing of scss variables or through css - overrides.
- You have to provide the handlers for uploading, downloading, deleting yourself offcourse. 
So, there are no strings attached to any backend technology. 
- The dropzone can be populated with current state. It can be used for a readonly file output object.
- i18n: you can add custom labels, or translate labels with the i18n dropzone resource.
- The current setup needs a scss compilation step.
- can be used for uploading on drop, or deleting on delete pressed
- can be used for uploading after an external trigger (for example a button press) 

![dropzone-example-giffy](https://github.com/PieterVanPoyer/fullstack-dropzone/blob/master/dropzone-frontend/readme/dropzone-example.gif?raw=true)

## Installation
    npm i dropzone-frontend

## How to use

### TypeScript setup with scss
 
- Include scss in scss file

        @import '../../node_modules/dropzone-frontend/lib/styles/export/dropzone-lib';

- Html file: add a container on your Html file

        <div id="myDropzone">
        </div>
        
- TypeScript file: turn the html-container in a dropzone

#### Meta flow
- turn the html element in a dropzone
    
        const dropzone: Dropzone = new Dropzone(window.document.querySelector('#myDropzone')/*,
            optionally a dropzoneProps - object can be added,  
            optionally an i18n - override can be added */);
        
- add a listener for a file drop (give feedback with the progress, succesCallback and errorCallback - functions)

        dropzone.addOnFileDroppedEventListener((file: DropzoneFile,
            successCallback: (createdDropzoneFile: DropzoneFile) => any | void,
            errorCallback: (error?: any) => any,
            progress: (uploadPercentage: number) => void) => {
            // <- upload the file anyway you want

- add a listener when the user wants to download the file
        
        dropzone.addDownloadFileEventListener((dropzoneFile: DropzoneFile) => { 
            // <- download the file any way you want
          

- add a delete listener

        dropzone.addOnDeleteFileEventListener((file: DropzoneFile,
           successCallback: (deletedFile?: any) => any,
           errorCallback: (error?: any) => void) => {
           // <- delete the file, any way you want.
                                   
- popupulate the dropzone with the current state. (Expected type: DropzoneFile)

        dropzone.setDropzoneFiles(jsonData); // put the loaded files on the dropzone

#### Full example with a node backend running on port 3000.

````
import {DropzoneFile} from "dropzone-frontend/lib/scripts/model/dropzone-file";
import {Dropzone} from "dropzone-frontend/lib/scripts/dropzone";

const dropzone: Dropzone = new Dropzone(window.document.querySelector('#myDropzone')/*, 
    optionally a dropzoneProps - object can be added, 
    optionally an i18n - override can be added */); 

// upload the file when it is dropped.
dropzone.addOnFileDroppedEventListener((file: DropzoneFile,
    successCallback: (createdDropzoneFile: DropzoneFile) => any | void,
    errorCallback: (error?: any) => any,
    progress: (uploadPercentage: number) => void) => {
  const formData = new FormData();
  formData.append('file', file.file); 
    // <- the file is in the file.file attribute.
  
  if (xhr.upload) {
    xhr.upload.onprogress = (e: any) => {
      const done = e.position || e.loaded,
        total = e.totalSize || e.total;
      const percentage = Math.floor((done / total) * 1000) / 10;
      progress(percentage); 
        // <- give progress feedback by calling progress with percentage
    };
  }
  
  xhr.onerror = () => {
    errorCallback(); // <- if something goes wrong with the upload, let it know at the dropzone with the error callback function
  };
  
  xhr.onreadystatechange = (e: any) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      successCallback(file); 
        // <- if everything goes well notify the dropzone by the successCallback
        // the successCallback excepts an object of type DropzoneFile
    }
  };
  xhr.open('post', 'http://localhost:3000/api/upload-file', true);
    xhr.send(formData); // <- upload the file anyway you want
  });

// handle the download file action
dropzone.addDownloadFileEventListener((dropzoneFile: DropzoneFile) => {
  window.open(`http://localhost:3000/api/upload-file/${dropzoneFile.fileName}`); 
    // <- download the file any way you want
});

// When the user want's to delete the file, do the delete
dropzone.addOnDeleteFileEventListener((file: DropzoneFile,
   successCallback: (deletedFile?: any) => any,
   errorCallback: (error?: any) => void) => {
  const formData = new FormData();
  formData.append('file', file.file);
  fetch(`http://localhost:3000/api/upload-file/${file.id}`, {
    method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: formData, // body data type must match "Content-Type" header
  })
    .then(data => {
      successCallback(data as any);
    }) // JSON-string from `response.json()` call
    .catch(error => {
      errorCallback(error);
    });
});

// load all the files
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
    data.json().then(jsonData => {
      jsonData.forEach((aJson: any) => {
        if (aJson.thumbnail) {
          aJson.thumbnailUrl = 'http://localhost:3000/api/upload-file/' + aJson.thumbnail;
        }
      });
      dropzone.setDropzoneFiles(jsonData); // put the loaded files on the dropzone
    });
  }) // JSON-string from `response.json()` call
  .catch(error => {
    console.error('error during read', error);
  });
  
````

#### Upload after an external trigger (buttonpress): Full example with a node backend running on port 3000.

- Html file: add a container on your Html file

        <h1>Attachments  but no autoupload</h1>
        <div class="m-dropzone--no-autoupload">
        </div>
        <button id="saveNotUploadDropzoneButton">SAVE THEM</button>
        
- TypeScript file: turn the html-container in a dropzone Keep track of the items to save/delete. Use the isSaved - flag of the DropzoneFile - model.

````
const notAutoUploadOnDropDropzone: Dropzone = new Dropzone(
    window.document.querySelector('.m-dropzone--no-autoupload'),
    {
        readonly: false,
    },
    {
        uploadProgressLabel: 'upload progress',
        uploadErrorLabel: 'upload error',
        uploadCompleteLabel: 'De upload is voltooid',
        browseLabel: 'browse.',
        dropFilesLabel: 'Sleep bestanden om bij te voegen of ',
    },
);

let filesToSave: DropzoneFile[] = []; // <- keep state of filesToSave
let filesToDelete: DropzoneFile[] = []; // <- keep state of filesToDelete

notAutoUploadOnDropDropzone.addOnFileDroppedEventListener((file, successCallback, errorCallback, progress) => {
    // <- do not save to backend on drop! but update state.
    filesToSave.push(file);
    file.canBeDeleted = true;
    if (file.file.type.indexOf('image/') === 0) {
        file.thumbnailObjectURL = URL.createObjectURL(file.file);
        // <- optionally provide a thumbnailObjectURL for an image type
    }
    notAutoUploadOnDropDropzone.updateDropzoneFile(file);
});

notAutoUploadOnDropDropzone.addDownloadFileEventListener((dropzoneFile: DropzoneFile) => {
    if (dropzoneFile.isSaved) {
        window.open(`http://localhost:3000/api/upload-file/${dropzoneFile.fileName}`);
    } else {
        window.alert('This file cannot be donwloaded yet, because it is not saved yet!');
    }
});


notAutoUploadOnDropDropzone.addOnDeleteFileEventListener((file, successCallback, errorCallback) => {
    // <- do not persist to backend, but keep track of the filesToSave and delete state.
    if (file.isSaved) { // <- use the isSaved flag to keep your state nice and clean.
        filesToDelete.push(file);
    } else if (filesToSave.indexOf(file) !== -1) {
        // <- item is not yet saved, so it doesn't need to be persisted to backend later.
        filesToSave = filesToSave.filter(aFileToSave => {
            return aFileToSave.id !== file.id;
        });
        
    }
    successCallback(file); // <- successCallback removes the item visually from the dropzoe
});

// <- init the dropzone with your file data.
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
        data.json().then(jsonData => {
            jsonData.forEach((aJson: any | DropzoneFile) => {
                if (aJson.thumbnail) {
                    aJson.thumbnailUrl = 'http://localhost:3000/api/upload-file/' + aJson.thumbnail;
                }
                aJson.isSaved = true;
            });
            notAutoUploadOnDropDropzone.setDropzoneFiles(jsonData);
        });
    }) 
    .catch(error => {
        console.error('error during read', error);
    });

// <- add a button and handle the file upload/delete there.
// off course you can prefer to send them all at once to the backend. Suit yourself!

document.querySelector('#saveNotUploadDropzoneButton').addEventListener('click', () => {
    filesToDelete.forEach(aFileToDelete => {
        const formData = new FormData();
        formData.append('file', aFileToDelete.file);

        fetch(`http://localhost:3000/api/upload-file/${aFileToDelete.id}`, {
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
                console.log('file is deleted!');
            })
            .catch(error => {
                window.alert('An error did occur while deleting file ' + aFileToDelete.fileName + '. The file is added again to the dropzone.');
                notAutoUploadOnDropDropzone.appendDropzoneFile(aFileToDelete);
            });
        filesToDelete = [];
    });

    filesToSave.forEach(aFileToSave => {
        const formData = new FormData();
        formData.append('file', aFileToSave.file);

        const xhr = new XMLHttpRequest();

        xhr.onerror = () => {
            console.log('** An error occurred during the transaction');
            window.alert('An error did occur while saving file ' + aFileToSave.fileName + '.');
            notAutoUploadOnDropDropzone.appendDropzoneFile(aFileToSave);
            filesToSave.push(aFileToSave);
        };

        xhr.onreadystatechange = (e: any) => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                aFileToSave.canBeDeleted = true;
                aFileToSave.canBeDownloaded = true;
                aFileToSave.isSaved = true;
                notAutoUploadOnDropDropzone.updateDropzoneFile(aFileToSave);
            }
        };
        xhr.open('post', 'http://localhost:3000/api/upload-file', true);
        // xhr.setRequestHeader("Content-Type","multipart/form-data");
        xhr.send(formData);
    });
    filesToSave = [];
});
````