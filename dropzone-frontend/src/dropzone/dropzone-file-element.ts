import { DropzoneFile } from './model/dropzone-file';
import EventsEmitter from './event-emitter';
import { DropzoneEvents } from './dropzone-events';

export class DropzoneFileElement extends EventsEmitter {

    private readonly outputElement: HTMLDivElement;

    constructor(private dropzoneFile: DropzoneFile) {
        super();
        this.outputElement = document.createElement('div');
        this.outputElement.classList.add('m-dropzone-output-element');
        this.initHtml();
    }

    update(dropzoneFile: DropzoneFile): void {
        this.dropzoneFile = dropzoneFile;
        this.clearInnerHtml();
        this.initHtml();
    }

    addOnDeleteFileEventListener(listener: (dropzoneFile: DropzoneFile) => void): void {
        this.on(DropzoneEvents.DELETE_FILE, listener);
    }

    addOnDownloadFileEventListener(listener: (dropzoneFile: DropzoneFile) => void): void {
        this.on(DropzoneEvents.DOWNLOAD_FILE, listener);
    }

    isElementFor(dropzoneFile: DropzoneFile): boolean {
        if (dropzoneFile === this.dropzoneFile) {
            return true;
        }
        if (dropzoneFile && this.dropzoneFile) {
            return this.dropzoneFile.id === dropzoneFile.id;
        }
        return false;
    }

    markAsDeleteInProgress(): void {
        this.outputElement.classList.add('m-dropzone-output-element--delete-in-progress');
    }

    private initHtml(): void {
        this.outputElement.innerHTML = `<div class="js-dropzone-output-element-start-download m-dropzone-output-element__file-icon dropzone-file"></div>
                        <a class="js-dropzone-output-element-start-download m-dropzone-output-element__file-name">${this.dropzoneFile.fileName}</a>
                        <div class="m-dropzone-output-element__bottom-container"><span class="m-dropzone-output-element__size">${this.convertSizeToReadableFormat()}</span>
                           <a class="js-dropzone-output-element-start-delete m-dropzone-output-element__delete-button dropzone-delete-file"></a>
                        </div>`;
        if (this.dropzoneFile.canBeDownloaded) {
            this.makeDownloadable();
        }
        if (this.dropzoneFile.canBeDeleted) {
            this.makeDeletable();
        }
    }

    private convertSizeToReadableFormat(): string {
        if (this.dropzoneFile.fileSizeInBytes) {
            if (this.dropzoneFile.fileSizeInBytes > 1000000) { /* Megabytes*/
                return (this.dropzoneFile.fileSizeInBytes / 1000000).toFixed(1) + ' MB';
            } else if (this.dropzoneFile.fileSizeInBytes > 1000) { /* Kilobytes*/
                return (this.dropzoneFile.fileSizeInBytes / 1000).toFixed(1) + ' kB';
            } else {
                return this.dropzoneFile.fileSizeInBytes + ' b';
            }
        } else {
            return '0 b';
        }
    }

    handleDeleteCompleted(): void {
        this.outputElement.classList.remove('m-dropzone-output-element--delete-in-progress');
        this.destroy();
    }

    handleUploadCompleted(): void { // todo input dropzone file
        this.initHtml();
        this.makeDownloadable();
    }

    private makeDownloadable() {
        this.outputElement.classList.add('m-dropzone-output-element--is-download-enabled');
        this.outputElement.querySelectorAll('.js-dropzone-output-element-start-download').forEach((element) => {
            element.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.emit(DropzoneEvents.DOWNLOAD_FILE, this.dropzoneFile);
            });
        });
    }

    private makeDeletable() {
        this.outputElement.classList.add('m-dropzone-output-element--is-deletable');
        this.unmarkDeleteInProgress();
        this.outputElement.querySelector('.js-dropzone-output-element-start-delete').addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.emit(DropzoneEvents.DELETE_FILE, this.dropzoneFile);
        });
    }

    handleUploadError(error: any): void {
        this.outputElement.innerHTML += '<span class="m-dropzone-output-element__type">upload error</span>'
    }

    handleDeleteError(error: any): void {
        this.unmarkDeleteInProgress();
    }

    private unmarkDeleteInProgress() {
        this.outputElement.classList.remove('m-dropzone-output-element--delete-in-progress');
    }

    getOutputElement(): HTMLDivElement {
        return this.outputElement;
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
