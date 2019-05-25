import { DropzoneFileElement } from './dropzone-file-element';
import { DropzoneFile } from './model/dropzone-file';
import EventsEmitter from './event-emitter';
import { DropzoneEvents } from './dropzone-events';

export class Dropzone extends EventsEmitter {

    static DROPZON_FILE_ID: number = 1;

    private outputDiv: HTMLDivElement;
    private filesForOutput: DropzoneFileElement[] = [];

    constructor(private element: HTMLElement) {
        super();
        this.makeDroppable();
        this.addOutputContainer();
    }

    addOnFileDroppedEventListener(listener: (dropzoneFile: DropzoneFile, successCallback: (createdDropzoneFile: DropzoneFile) => any | void, errorCallback: Function) => void): void {
        this.on(DropzoneEvents.ON_FILE_DROPPED, listener);
    }

    addDownloadFileEventListener(listener: (dropzoneFile: DropzoneFile) => void): void {
        this.on(DropzoneEvents.DOWNLOAD_FILE, listener);
    }

    addOnDeleteFileEventListener(listener: (dropzoneFile: DropzoneFile, successCallback: Function, errorCallback: Function) => void): void {
        this.on(DropzoneEvents.DELETE_FILE, listener);
    }

    protected makeDroppable(): void {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('multiple', 'true');
        input.style.display = 'none';
        input.addEventListener('change', (e) => {
            this.triggerCallback(e);
        });

        this.element.appendChild(input);
        this.element.innerHTML += '<span class="m-dropzone__text"><span class="m-dropzone__drop-icon"> </span> Drop files to attach, or <a class="js-dropzone-browse-button m-dropzone__anchor-browse"> browse.</a></span>'

        this.element.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.element.classList.add('m-dropzone--drag-in-progress');
        });

        this.element.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.element.classList.remove('m-dropzone--drag-in-progress');
        });

        this.element.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.element.classList.remove('m-dropzone--drag-in-progress');
            this.triggerCallback(e);
        });

        this.element.querySelector('.js-dropzone-browse-button').addEventListener('click', () => {
            input.value = null;
            input.click();
        });
    }

    protected addOutputContainer(): void {
        this.outputDiv = document.createElement('div');
        this.outputDiv.classList.add('m-dropzone__output-container');
        this.element.appendChild(this.outputDiv);
    }

    setDropzoneFiles(dropzoneFiles: DropzoneFile[]): void {
        this.removeAllDropzoneFileElements();
        this.filesForOutput = [];
        if (dropzoneFiles) {
            dropzoneFiles.forEach((aDropzoneFile: DropzoneFile) => {
                const fileToAppend: DropzoneFileElement = new DropzoneFileElement(aDropzoneFile);
                this.filesForOutput.push(fileToAppend);
                //if (files[i].type.indexOf('image/') === 0) {
                //    outputElement.innerHTML += '<img width="200" src="' + URL.createObjectURL(files[i]) + '" />';
                //} else {

                //}
                fileToAppend.addOnDownloadFileEventListener((dropzoneFile => {
                    this.emit(DropzoneEvents.DOWNLOAD_FILE, dropzoneFile);
                }));

                fileToAppend.addOnDeleteFileEventListener((dropzoneFile => {
                    fileToAppend.markAsDeleteInProgress();
                    this.emit(DropzoneEvents.DELETE_FILE, dropzoneFile, () => {
                        this.handleDeleteCompleteForFile(dropzoneFile);
                    }, (error: any) => {
                        this.handleDeleteErrorForFile(dropzoneFile, error);
                    });
                }));
                this.outputDiv.appendChild(fileToAppend.getOutputElement());
            });
        }
    }

    updateDropzoneFile(dropzoneFile: DropzoneFile): boolean {
        const dropzoneFileElement: DropzoneFileElement = this.getDropzoneFileElementForModel(dropzoneFile);
        if (dropzoneFileElement) {
            dropzoneFileElement.update(dropzoneFile);
            return true;
        }
        return false;
    }

    removeDropzoneFile(dropzoneFile: DropzoneFile): boolean {
        const dropzoneFileElement: DropzoneFileElement = this.getDropzoneFileElementForModel(dropzoneFile);
        if (dropzoneFileElement) {
            this.removeDropzoneFileElement(dropzoneFileElement);
            return true;
        }
        return false;
    }

    private triggerCallback(e: any) {
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        for (let i = 0; i < files.length; i++) {
            const dropzoneFile: DropzoneFile = new DropzoneFile();
            const file: File = files[i]
            dropzoneFile.file = file;
            dropzoneFile.fileName = file.name;
            dropzoneFile.fileType = file.type;
            dropzoneFile.id = '' + Dropzone.DROPZON_FILE_ID++;
            dropzoneFile.fileSizeInBytes = file.size;

            const fileToAppend: DropzoneFileElement = new DropzoneFileElement(dropzoneFile);
            this.filesForOutput.push(fileToAppend);

            //if (files[i].type.indexOf('image/') === 0) {
            //    outputElement.innerHTML += '<img width="200" src="' + URL.createObjectURL(files[i]) + '" />';
            //} else {

            //}
            fileToAppend.addOnDownloadFileEventListener((dropzoneFile => {
                this.emit(DropzoneEvents.DOWNLOAD_FILE, dropzoneFile);
            }));
            this.outputDiv.appendChild(fileToAppend.getOutputElement());
            this.emit(DropzoneEvents.ON_FILE_DROPPED, dropzoneFile, (data: any) => {
                this.handleUploadCompleteForFile(dropzoneFile);
            }, (error: any) => {
                this.handleUploadErrorForFile(dropzoneFile, error);
            });

            fileToAppend.addOnDeleteFileEventListener((dropzoneFile => {
                console.log('On Delete clicked.')
                this.emit(DropzoneEvents.DELETE_FILE, dropzoneFile, () => {
                    this.handleDeleteCompleteForFile(dropzoneFile);
                }, (error: any) => {
                    this.handleDeleteErrorForFile(dropzoneFile, error);
                });
            }));
        }
    }

    private handleUploadCompleteForFile(dropzoneFile: DropzoneFile): void {
        const element: DropzoneFileElement = this.getDropzoneFileElementForModel(dropzoneFile);
        element.handleUploadCompleted();
    }

    private handleUploadErrorForFile(dropzoneFile: DropzoneFile, error: any): void {
        const element: DropzoneFileElement = this.getDropzoneFileElementForModel(dropzoneFile);
        element.handleUploadError(error);
    }

    private handleDeleteCompleteForFile(dropzoneFile: DropzoneFile): void {
        const element: DropzoneFileElement = this.getDropzoneFileElementForModel(dropzoneFile);
        element.handleDeleteCompleted();
        this.outputDiv.removeChild(element.getOutputElement());
    }

    private handleDeleteErrorForFile(dropzoneFile: DropzoneFile, error: any): void {
        const element: DropzoneFileElement = this.getDropzoneFileElementForModel(dropzoneFile);
        element.handleDeleteError(error);
    }

    private getDropzoneFileElementForModel(dropzoneFile: DropzoneFile): DropzoneFileElement {
        return this.filesForOutput.find((anElement) => {
            return anElement.isElementFor(dropzoneFile);
        });
    }

    private removeAllDropzoneFileElements(): void {
        this.filesForOutput.forEach((element) => {
            this.removeDropzoneFileElement(element);
        });
    }

    private removeDropzoneFileElement(element: DropzoneFileElement) {
        this.outputDiv.removeChild(element.getOutputElement());
        element.destroy();
    }
}
