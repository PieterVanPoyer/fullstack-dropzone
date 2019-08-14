export interface DropzoneProps {
  readonly?: boolean;
  acceptedFileTypeSpecifiers?: string[];
}

export class DefaultDropzoneProps implements DropzoneProps {
  public readonly: boolean = false;
  public acceptedFileTypeSpecifiers: string[] = [];
}
