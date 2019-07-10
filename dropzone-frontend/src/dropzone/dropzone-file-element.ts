import { DropzoneFile } from './model/dropzone-file';
import EventsEmitter from './event-emitter';
import { DropzoneEvents } from './dropzone-events';
import { DropzoneI18nResource } from './model/dropzone-i18n';

export class DropzoneFileElement extends EventsEmitter {
  private readonly element: HTMLDivElement;
  private readonly outputElement: HTMLDivElement;
  private readonly uploadStatusElement: HTMLDivElement;

  constructor(protected dropzoneFile: DropzoneFile, protected i18nResource: DropzoneI18nResource) {
    super();
    this.element = document.createElement('div');
    this.element.classList.add('m-dropzone-file');
    this.outputElement = document.createElement('div');
    this.outputElement.classList.add('m-dropzone-output');
    this.uploadStatusElement = document.createElement('div');
    this.uploadStatusElement.classList.add('m-dropzone-upload-status');
    this.element.appendChild(this.outputElement);
    this.element.appendChild(this.uploadStatusElement);
    this.initHtml();
  }

  public update(dropzoneFile: DropzoneFile): void {
    this.dropzoneFile = dropzoneFile;
    this.clearInnerHtml();
    this.initHtml();
  }

  public addOnDeleteFileEventListener(listener: (dropzoneFile: DropzoneFile) => void): void {
    this.on(DropzoneEvents.DELETE_FILE, listener);
  }

  public addOnRemoveDropzoneFileElementEventListener(listener: () => void): void {
    this.on(DropzoneEvents.REMOVE_DROPZONE_FILE_ELEMENT, listener);
  }

  public addOnDownloadFileEventListener(listener: (dropzoneFile: DropzoneFile) => void): void {
    this.on(DropzoneEvents.DOWNLOAD_FILE, listener);
  }

  public isElementFor(dropzoneFile: DropzoneFile): boolean {
    if (dropzoneFile === this.dropzoneFile) {
      return true;
    }
    if (dropzoneFile && this.dropzoneFile) {
      return this.dropzoneFile.id === dropzoneFile.id;
    }
    return false;
  }

  public markAsDeleteInProgress(): void {
    this.outputElement.classList.add('m-dropzone-output--delete-in-progress');
  }

  private initHtml(): void {
    this.outputElement.innerHTML = `<div class="js-dropzone-output-start-download m-dropzone-output__file-icon dropzone-file"></div>
                        <div class="js-dropzone-output-thumbnail-container js-dropzone-output-start-download m-dropzone-output__thumbnail-container"></div>
                        <a class="js-dropzone-output-start-download m-dropzone-output__file-name">${
                          this.dropzoneFile.fileName
                        }</a>
                        <div class="m-dropzone-output__bottom-container"><span class="m-dropzone-output__size">${this.convertSizeToReadableFormat()}</span>
                           <a class="js-dropzone-output-start-delete m-dropzone-output__delete-button dropzone-delete-file"></a>
                        </div>`;

    if (!!this.dropzoneFile.thumbnailUrl) {
      this.outputElement.querySelector('.js-dropzone-output-thumbnail-container').innerHTML =
        '<img class="m-dropzone-output__thumbnail-img" src="' + this.dropzoneFile.thumbnailUrl + '" />';
      this.outputElement.classList.add('m-dropzone-output--with-thumbail');
    } else {
      this.outputElement.classList.remove('m-dropzone-output--with-thumbail');
    }

    if (this.dropzoneFile.canBeDownloaded) {
      this.makeDownloadable();
    }
    if (this.dropzoneFile.canBeDeleted) {
      this.makeDeletable();
    }
  }

  private convertSizeToReadableFormat(): string {
    if (this.dropzoneFile.fileSizeInBytes) {
      if (this.dropzoneFile.fileSizeInBytes > 1000000) {
        /* Megabytes*/
        return (this.dropzoneFile.fileSizeInBytes / 1000000).toFixed(0) + ' MB';
      } else if (this.dropzoneFile.fileSizeInBytes > 1000) {
        /* Kilobytes*/
        return (this.dropzoneFile.fileSizeInBytes / 1000).toFixed(0) + ' kB';
      } else {
        return this.dropzoneFile.fileSizeInBytes + ' b';
      }
    } else {
      return '0 b';
    }
  }

  public handleDeleteCompleted(): void {
    this.outputElement.classList.remove('m-dropzone-output--delete-in-progress');
    this.destroy();
  }

  public handleUploadCompleted(dropzoneFile: DropzoneFile): void {
    this.dropzoneFile = dropzoneFile;
    this.clearInnerHtml();
    this.initHtml();

    setTimeout(() => {
      this.uploadStatusElement.innerHTML = `<span class="m-dropzone-upload-status__progress">${this.i18nResource.uploadCompleteLabel}</span>`;
      setTimeout(() => {
        this.uploadStatusElement.classList.remove('m-dropzone-upload-status--is-in-progress');
      }, 1000);
    }, 500);
  }

  private makeDownloadable() {
    this.outputElement.classList.add('m-dropzone-output--is-download-enabled');
    this.outputElement.querySelectorAll('.js-dropzone-output-start-download').forEach(element => {
      element.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        this.emit(DropzoneEvents.DOWNLOAD_FILE, this.dropzoneFile);
      });
    });
  }

  private makeDeletable() {
    this.outputElement.classList.add('m-dropzone-output--is-deletable');
    this.unmarkDeleteInProgress();
    this.outputElement.querySelector('.js-dropzone-output-start-delete').addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      this.emit(DropzoneEvents.DELETE_FILE, this.dropzoneFile);
    });
  }

  public handleUploadError(error: any): void {
    this.uploadStatusElement.classList.add('m-dropzone-upload-status--has-upload-error');
    this.uploadStatusElement.innerHTML = `<span class="m-dropzone-upload-status__upload-error">${this.i18nResource.uploadErrorLabel}</span>`;
    setTimeout(() => {
      this.emit(DropzoneEvents.REMOVE_DROPZONE_FILE_ELEMENT);
    }, 6000);
  }

  public handleUploadProgress(uploadPercentage: number): void {
    this.uploadStatusElement.classList.add('m-dropzone-upload-status--is-in-progress');
    this.uploadStatusElement.innerHTML = `<span class="m-dropzone-upload-status__progress">${this.i18nResource.uploadProgressLabel} ' + uploadPercentage + '%</span>`;
  }

  public handleDeleteError(error: any): void {
    this.unmarkDeleteInProgress();
  }

  private unmarkDeleteInProgress() {
    this.outputElement.classList.remove('m-dropzone-output--delete-in-progress');
  }

  public getElement(): HTMLDivElement {
    return this.element;
  }

  public destroy(): void {
    this.clearInnerHtml();
    this.off(DropzoneEvents.DELETE_FILE);
    this.off(DropzoneEvents.DOWNLOAD_FILE);
  }

  private clearInnerHtml() {
    this.outputElement.innerHTML = null; // the 'click' - eventlistener (for deleting and downloading) are not
    // explicitly removed, but they should be automatically be set elegible for garbage collection.
    // due to the clearing of the HTML.
  }
}
