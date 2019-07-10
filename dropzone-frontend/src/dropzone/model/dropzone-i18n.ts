
export interface DropzoneI18nResource {
    dropFilesLabel: string;
    browseLabel: string;
    uploadCompleteLabel: string;
    uploadErrorLabel: string;
    uploadProgressLabel: string;
}

export class DefaultI18nResource implements DropzoneI18nResource {

    dropFilesLabel = 'Drop files to attach, or';
    browseLabel = 'browse.';
    uploadCompleteLabel = 'upload complete!';
    uploadErrorLabel = 'upload error';
    uploadProgressLabel = 'upload progress';

}