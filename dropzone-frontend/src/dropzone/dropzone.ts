import { DropzoneFileElement } from './dropzone-file-element';
import { DropzoneFile } from './model/dropzone-file';
import EventsEmitter from './event-emitter';
import { DropzoneEvents } from './dropzone-events';
import { DefaultI18nResource, DropzoneI18nResource } from './model/dropzone-i18n';
import { DefaultDropzoneProps, DropzoneProps } from './model/dropzone-props';
import { DropzoneUtils } from './dropzone-utils';

export class Dropzone extends EventsEmitter {
  public static DROPZONE_FILE_ID: number = 1;

  protected dragoverListener = (e: DragEvent | any) => {
    e.preventDefault();
    e.stopPropagation();

    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files; // todo piv: on chrome these e.dataTransfer.files are empty? should be something els while dragovering.
    } else if (e.target) {
      files = e.target.files;
    }
    if (files) {
      if (this.filesAreAllFromCorrectType(files)) {
        this.element.classList.add('m-dropzone--drag-in-progress');
      } else {
        this.element.classList.add('m-dropzone--invalid-type');
      }
    }
  };

  protected dragleaveListener = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.element.classList.remove('m-dropzone--drag-in-progress');
  };

  protected dropListener = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.element.classList.remove('m-dropzone--drag-in-progress');
    this.triggerCallback(e);
  };

  protected browseButtonClickListener = () => {
    this.fileInput.value = null;
    this.fileInput.click();
  };

  private outputDiv: HTMLDivElement;
  private filesForOutput: DropzoneFileElement[] = [];
  private readonly: boolean = false;
  public acceptedFileTypeSpecifiers: string[] = [];

  private fileInput: HTMLInputElement;
  private dropzoneTextSpanElement: HTMLSpanElement;
  private dropzoneInvalidTypeTextSpanElement: HTMLSpanElement;

  constructor(
    protected element: HTMLElement,
    protected props: DropzoneProps = new DefaultDropzoneProps(),
    protected i18nResources: DropzoneI18nResource = new DefaultI18nResource(),
  ) {
    super();

    this.element.classList.add('m-dropzone');
    this.makeDroppable();
    this.addOutputContainer();
    this.setReadonly(this.props.readonly);
    this.setAcceptedFileTypeSpecifiers(this.props.acceptedFileTypeSpecifiers);
  }

  private removeDropListener() {
    this.element.removeEventListener('drop', this.dropListener);
  }

  public setReadonly(readonly: boolean): void {
    this.readonly = readonly;
    if (this.readonly) {
      this.applyReadonlyState();
    } else {
      this.applyWritableState();
    }
  }

  private setAcceptedFileTypeSpecifiers(acceptedFileTypeSpecifiers: string[]) {
    this.acceptedFileTypeSpecifiers = acceptedFileTypeSpecifiers;
    if (this.acceptedFileTypeSpecifiers && this.acceptedFileTypeSpecifiers.length) {
      this.fileInput.setAttribute('accept', this.acceptedFileTypeSpecifiers.join(','));
    } else {
      this.fileInput.removeAttribute('accept');
    }
  }

  public getReadonly(): boolean {
    return this.readonly;
  }

  private applyReadonlyState(): void {
    this.element.classList.add('m-dropzone--is-readonly');
    this.removeDragAndDropEventListeners();
  }

  private applyWritableState(): void {
    this.element.classList.remove('m-dropzone--is-readonly');
    this.addDragAndDropEventListeners();
  }

  public addOnFileDroppedEventListener(
    listener: (
      dropzoneFile: DropzoneFile,
      successCallback: (createdDropzoneFile: DropzoneFile) => any | void,
      errorCallback: (error?: any) => any,
      progressCallback: (uploadPercentage: number) => void,
    ) => void,
  ): void {
    this.on(DropzoneEvents.ON_FILE_DROPPED, listener);
  }

  public addDownloadFileEventListener(listener: (dropzoneFile: DropzoneFile) => void): void {
    this.on(DropzoneEvents.DOWNLOAD_FILE, listener);
  }

  public addOnDeleteFileEventListener(
    listener: (
      dropzoneFile: DropzoneFile,
      successCallback: (deletedFile?: any) => any,
      errorCallback: (error?: any) => any,
    ) => void,
  ): void {
    this.on(DropzoneEvents.DELETE_FILE, listener);
  }

  public destroy(): void {
    this.element.classList.remove('m-dropzone');
    this.element.removeChild(this.fileInput);
    this.element.removeChild(this.dropzoneTextSpanElement);
    this.element.removeChild(this.dropzoneInvalidTypeTextSpanElement);
    this.clearInnerHtml();
    this.element.removeChild(this.outputDiv);
    this.off(DropzoneEvents.ON_FILE_DROPPED);
    this.off(DropzoneEvents.DOWNLOAD_FILE);
    this.off(DropzoneEvents.DELETE_FILE);
  }

  private clearInnerHtml() {
    this.outputDiv.innerHTML = null;
  }

  protected makeDroppable(): void {
    this.fileInput = document.createElement('input');
    this.fileInput.setAttribute('type', 'file');
    this.fileInput.setAttribute('multiple', 'true');
    this.fileInput.style.display = 'none';
    this.fileInput.addEventListener('change', e => {
      this.triggerCallback(e);
    });

    this.element.appendChild(this.fileInput);

    this.dropzoneTextSpanElement = document.createElement('span');
    this.dropzoneTextSpanElement.classList.add('m-dropzone__text');
    this.dropzoneTextSpanElement.innerHTML = `<span class="m-dropzone__drop-icon"> </span> ${this.i18nResources.dropFilesLabel} <a class="js-dropzone-browse-button m-dropzone__anchor-browse"> ${this.i18nResources.browseLabel}</a>`;

    this.element.appendChild(this.dropzoneTextSpanElement);

    this.dropzoneInvalidTypeTextSpanElement = document.createElement('span');
    this.dropzoneInvalidTypeTextSpanElement.classList.add('m-dropzone__invalid-type-text');
    this.dropzoneInvalidTypeTextSpanElement.innerHTML = this.i18nResources.invalidTypeText;

    this.element.appendChild(this.dropzoneInvalidTypeTextSpanElement);

    this.addDragAndDropEventListeners();
  }

  private addDragAndDropEventListeners(): void {
    this.element.addEventListener('dragover', this.dragoverListener);
    this.element.addEventListener('dragleave', this.dragleaveListener);
    this.element.addEventListener('drop', this.dropListener);
    this.element.querySelector('.js-dropzone-browse-button').addEventListener('click', this.browseButtonClickListener);
  }

  protected removeDragAndDropEventListeners(): void {
    this.element.removeEventListener('dragover', this.dragoverListener);
    this.element.removeEventListener('dragleave', this.dragleaveListener);
    this.element.removeEventListener('drop', this.dropListener);
    this.element
      .querySelector('.js-dropzone-browse-button')
      .removeEventListener('click', this.browseButtonClickListener);
  }

  protected addOutputContainer(): void {
    this.outputDiv = document.createElement('div');
    this.outputDiv.classList.add('m-dropzone__output-container');
    this.element.appendChild(this.outputDiv);
  }

  public setDropzoneFiles(dropzoneFiles: DropzoneFile[]): void {
    this.removeAllDropzoneFileElementsFromOutputContainer();
    this.filesForOutput = [];
    if (dropzoneFiles) {
      dropzoneFiles.forEach((aDropzoneFile: DropzoneFile) => {
        this.appendDropzoneFile(aDropzoneFile);
      });
    }
  }

  public appendDropzoneFile(aDropzoneFile: DropzoneFile) {
    const fileToAppend: DropzoneFileElement = new DropzoneFileElement(aDropzoneFile, this.i18nResources);
    this.filesForOutput.push(fileToAppend);

    fileToAppend.addOnDownloadFileEventListener(dropzoneFile => {
      this.emit(DropzoneEvents.DOWNLOAD_FILE, dropzoneFile);
    });

    fileToAppend.addOnDeleteFileEventListener(dropzoneFile => {
      fileToAppend.markAsDeleteInProgress();
      this.emit(
        DropzoneEvents.DELETE_FILE,
        dropzoneFile,
        () => {
          this.handleDeleteCompleteForFile(dropzoneFile);
        },
        (error: any) => {
          this.handleDeleteErrorForFile(dropzoneFile, error);
        },
      );
    });
    this.outputDiv.appendChild(fileToAppend.getElement());
  }

  public getDropzoneFiles(): DropzoneFile[] {
    return this.filesForOutput
      .filter(aDropzoneFileElement => {
        return !aDropzoneFileElement.isInUploadErrorState;
      })
      .map(aDropzoneFileElement => {
        return aDropzoneFileElement.getDropzoneFile();
      });
  }

  public updateDropzoneFile(dropzoneFile: DropzoneFile): boolean {
    const dropzoneFileElement: DropzoneFileElement = this.getDropzoneFileElementForModel(dropzoneFile);
    if (dropzoneFileElement) {
      dropzoneFileElement.update(dropzoneFile);
      return true;
    }
    return false;
  }

  public removeDropzoneFile(dropzoneFile: DropzoneFile): boolean {
    const dropzoneFileElement: DropzoneFileElement = this.getDropzoneFileElementForModel(dropzoneFile);
    if (dropzoneFileElement) {
      this.removeDropzoneFileElementFromOutputContainer(dropzoneFileElement);
      this.removeDropzoneFileElementFromModelArray(dropzoneFileElement);
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

    if (files) {
      if (!this.filesAreAllFromCorrectType(files)) {
        this.element.classList.add('m-dropzone--invalid-type');

        setTimeout(() => {
          this.element.classList.remove('m-dropzone--invalid-type');
        }, 6000);
        return;
      }
    }

    for (const file of files) {
      const dropzoneFile: DropzoneFile = new DropzoneFile();
      dropzoneFile.file = file;
      dropzoneFile.fileName = file.name;
      dropzoneFile.fileType = file.type;
      dropzoneFile.id = '' + Dropzone.DROPZONE_FILE_ID++;
      dropzoneFile.fileSizeInBytes = file.size;

      const fileToAppend: DropzoneFileElement = new DropzoneFileElement(dropzoneFile, this.i18nResources);
      this.filesForOutput.push(fileToAppend);

      fileToAppend.addOnDownloadFileEventListener(fileToDownload => {
        this.emit(DropzoneEvents.DOWNLOAD_FILE, fileToDownload);
      });
      this.outputDiv.appendChild(fileToAppend.getElement());
      this.emit(
        DropzoneEvents.ON_FILE_DROPPED,
        dropzoneFile,
        (data: DropzoneFile) => {
          this.handleUploadCompleteForFile(data);
        },
        (error: any) => {
          this.handleUploadErrorForFile(dropzoneFile, error);
        },
        (uploadPecentage: number) => {
          this.handleProgress(dropzoneFile, uploadPecentage);
        },
      );

      fileToAppend.addOnDeleteFileEventListener(deletedDropzoneFile => {
        this.emit(
          DropzoneEvents.DELETE_FILE,
          deletedDropzoneFile,
          () => {
            this.handleDeleteCompleteForFile(deletedDropzoneFile);
          },
          (error: any) => {
            this.handleDeleteErrorForFile(deletedDropzoneFile, error);
          },
        );
      });

      fileToAppend.addOnRemoveDropzoneFileElementEventListener(() => {
        this.removeDropzoneFileElementFromModelArray(fileToAppend);
        this.removeDropzoneFileElementFromOutputContainer(fileToAppend);
      });
    }
  }

  private handleUploadCompleteForFile(dropzoneFile: DropzoneFile): void {
    const element: DropzoneFileElement = this.getDropzoneFileElementForModel(dropzoneFile);
    element.handleUploadCompleted(dropzoneFile);
  }

  private handleUploadErrorForFile(dropzoneFile: DropzoneFile, error: any): void {
    const element: DropzoneFileElement = this.getDropzoneFileElementForModel(dropzoneFile);
    element.handleUploadError(error);
  }

  private handleProgress(dropzoneFile: DropzoneFile, uploadPercentage: number): void {
    const element: DropzoneFileElement = this.getDropzoneFileElementForModel(dropzoneFile);
    element.handleUploadProgress(uploadPercentage);
  }

  private handleDeleteCompleteForFile(dropzoneFile: DropzoneFile): void {
    const element: DropzoneFileElement = this.getDropzoneFileElementForModel(dropzoneFile);
    element.handleDeleteCompleted();
    this.removeDropzoneFileElementFromModelArray(element);
    this.removeDropzoneFileElementFromOutputContainer(element);
  }

  private removeDropzoneFileElementFromModelArray(element: DropzoneFileElement) {
    this.filesForOutput.splice(this.filesForOutput.indexOf(element), 1);
  }

  private handleDeleteErrorForFile(dropzoneFile: DropzoneFile, error: any): void {
    const element: DropzoneFileElement = this.getDropzoneFileElementForModel(dropzoneFile);
    element.handleDeleteError(error);
  }

  private getDropzoneFileElementForModel(dropzoneFile: DropzoneFile): DropzoneFileElement {
    return this.filesForOutput.find(anElement => {
      return anElement.isElementFor(dropzoneFile);
    });
  }

  private removeAllDropzoneFileElementsFromOutputContainer(): void {
    this.filesForOutput.forEach(element => {
      this.removeDropzoneFileElementFromOutputContainer(element);
    });
  }

  private removeDropzoneFileElementFromOutputContainer(element: DropzoneFileElement) {
    this.outputDiv.removeChild(element.getElement());
    element.destroy();
  }

  private filesAreAllFromCorrectType(files: FileList) {
    if (this.acceptedFileTypeSpecifiers && this.acceptedFileTypeSpecifiers.length) {
      if (files && files.length) {
        for (let i: number = 0; i < files.length; i++) {
          const aFile = files[i];
          if (!DropzoneUtils.isFileOfAnAcceptedFileTypeSpecifier(aFile, this.acceptedFileTypeSpecifiers)) {
            return false;
          }
        }
      }
    }

    return true;
  }
}
