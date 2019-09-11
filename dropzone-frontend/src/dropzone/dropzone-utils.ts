
export class DropzoneUtils {

    public static isFileOfAnAcceptedFileTypeSpecifier(file: File, acceptedFileTypeSpecifiers: string[]):boolean {
        const extension = file.name.split('.').pop().toLowerCase();

        const mimeType = file.type;
        const baseMimeType = mimeType.replace(/\/.*$/, "");

        const acceptedFileTypeSpecification = acceptedFileTypeSpecifiers.find((anAcceptedFileType) => {
            if (anAcceptedFileType.indexOf('.') !== -1) { // indexOf . => check the extension
                if (anAcceptedFileType === '.' + extension) {
                    return true;
                }
                return false;
            }
            if (anAcceptedFileType === 'video/*') { // it is */video
                if (file.type.indexOf('video/') !== -1) {
                    return true;
                }
                return false;
            }
            if (anAcceptedFileType === 'audio/*') { // it is */video
                if (file.type.indexOf('audio/') !== -1) {
                    return true;
                }
                return false;
            }
            if (anAcceptedFileType === 'image/*') { // it is */video
                if (file.type.indexOf('image/') !== -1) {
                    return true;
                }
                return false;
            }

            if (/\/\*$/.test(anAcceptedFileType)) {
                // This is something like a image/* mime type
                if (baseMimeType === anAcceptedFileType.replace(/\/.*$/, "")) {
                    return true;
                }
            } else {
                if (mimeType === anAcceptedFileType) {
                    return true;
                }
            }

            return false;
        });

        return !!acceptedFileTypeSpecification;
    }

}
