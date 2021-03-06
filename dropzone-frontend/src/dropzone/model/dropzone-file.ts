export class DropzoneFile {
  public id: string;
  public fileName: string;
  public fileType: string;
  public file?: File;
  public canBeDownloaded: boolean;
  public canBeDeleted: boolean;
  public fileSizeInBytes: number;
  public thumbnailObjectURL: string;
  public thumbnailUrl: string;
  public isSaved: boolean;
}
