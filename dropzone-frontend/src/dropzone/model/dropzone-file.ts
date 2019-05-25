export class DropzoneFile {

    id: string;
    fileName: string;
    fileType: string;
    file?: File;
    canBeDownloaded: boolean;
    canBeDeleted: boolean;
    fileSizeInBytes: number;

}
