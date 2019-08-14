export interface DropzoneI18nResource {
    dropFilesLabel: string;
    browseLabel: string;
    uploadCompleteLabel: string;
    uploadErrorLabel: string;
    uploadProgressLabel: string;
    invalidTypeText?: string;
}

export class DefaultI18nResource implements DropzoneI18nResource {
    public dropFilesLabel = 'Drop files to attach, or';
    public browseLabel = 'browse.';
    public uploadCompleteLabel = 'upload complete!';
    public uploadErrorLabel = 'upload error';
    public uploadProgressLabel = 'upload progress';
    public invalidTypeText = 'This filetype is not supported.';
}
