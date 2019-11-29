import { Dropzone } from './dropzone/dropzone';
import { DropzoneFile } from './dropzone/model/dropzone-file';
import { DefaultDropzoneProps } from './dropzone/model/dropzone-props';

const dropzoneProps = new DefaultDropzoneProps();
// dropzoneProps.acceptedFileTypeSpecifiers = ['.pdf', 'video/*', 'image/png'];
dropzoneProps.acceptedFileTypeSpecifiers = ['application/pdf'];

let dropzone: Dropzone = new Dropzone(window.document.querySelector('.m-dropzone--default'), dropzoneProps, {
  uploadProgressLabel: 'upload progress',
  uploadErrorLabel: 'upload error',
  uploadCompleteLabel: 'De upload is voltooid',
  browseLabel: 'browse.',
  dropFilesLabel: 'Sleep bestanden om bij te voegen of ',
  invalidTypeText: 'Gelieve enkel pdf - bestanden bij te voegen.',
});

dropzone.destroy();

dropzone = new Dropzone(window.document.querySelector('.m-dropzone--default'), dropzoneProps, {
  uploadProgressLabel: 'upload progress',
  uploadErrorLabel: 'upload error',
  uploadCompleteLabel: 'De upload is voltooid',
  browseLabel: 'browse.',
  dropFilesLabel: 'Sleep bestanden om bij te voegen of ',
  invalidTypeText: 'Gelieve enkel pdf - bestanden bij te voegen.',
});

dropzone.setReadonly(true);
dropzone.setReadonly(false);

dropzone.addOnFileDroppedEventListener((file, successCallback, errorCallback, progress) => {
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
    };
  }
  xhr.onreadystatechange = (e: any) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // upload is complete
      file.canBeDeleted = true;
      file.canBeDownloaded = true;
      file.isSaved = true;
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

let filesToSave: DropzoneFile[] = [];

notAutoUploadOnDropDropzone.addOnFileDroppedEventListener((file, successCallback, errorCallback, progress) => {
  filesToSave.push(file);

  file.canBeDeleted = true;
  if (file.file.type.indexOf('image/') === 0) {
    file.thumbnailObjectURL = URL.createObjectURL(file.file);
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

let filesToDelete: DropzoneFile[] = [];

notAutoUploadOnDropDropzone.addOnDeleteFileEventListener((file, successCallback, errorCallback) => {
  if (file.isSaved) {
    filesToDelete.push(file);
  } else if (filesToSave.indexOf(file) !== -1) {
    filesToSave = filesToSave.filter(aFileToSave => {
      return aFileToSave.id !== file.id;
    });
  }
  successCallback(file);
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
    data.json().then(jsonData => {
      console.log('json', jsonData);
      jsonData.forEach((aJson: any | DropzoneFile) => {
        if (aJson.thumbnail) {
          aJson.thumbnailUrl = 'http://localhost:3000/api/upload-file/' + aJson.thumbnail;
        }
        aJson.isSaved = true;
      });
      notAutoUploadOnDropDropzone.setDropzoneFiles(jsonData);
    });
  }) // JSON-string from `response.json()` call
  .catch(error => {
    console.error('error during read', error);
  });

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
        window.alert(
          'An error did occur while deleting file ' +
            aFileToDelete.fileName +
            '. The file is added again to the dropzone.',
        );
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

notAutoUploadOnDropDropzone.setReadonly(true);
