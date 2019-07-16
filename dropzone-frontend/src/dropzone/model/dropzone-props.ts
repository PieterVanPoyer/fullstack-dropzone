export interface DropzoneProps {
  readonly?: boolean;
}

export class DefaultDropzoneProps implements DropzoneProps {
  public readonly: boolean = false;
}
