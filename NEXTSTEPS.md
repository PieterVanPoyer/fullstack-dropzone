# First release

- ~~add thumbnail behaviour (backend, frontend, output)~~
- ~~add disabled/readonly feature~~
- ~~multilanguage support? i18n, just a json in the code?~~
- ~~build lib?~~
- write documentation (jsDoc, tsDoc, readme? for the lib)
- ~~publish on npm~~
- ~~other icon (see design!)~~
- ~~scss 2 modules and variables~~

# Next steps?

- Start with the dropzone from:

    > ~~https://bitwiser.in/2015/08/08/creating-dropzone-for-drag-drop-file.html~~
    
- Write down features

    - ~~Upload on drop~~
        - ~~implement the callbacks in main.ts.~~
        - ~~react on it in the dropzone~~
        - ~~refactor out the outputElement~~
        - ~~refactor the callbacks out, no callbacks in constructor, but real event listener?~~
        - ~~add attachment icon, same for all types.~~
        - ~~show bytes in kB, MB, ...~~
        - ~~make css dragable real BEM -  modifiers~~
    - ~~Open file on click~~
    - ~~use consts strings or enums for the events.~~
    - ~~setDropzoneFiles(dropzoneFiles: DropzoneFile[]): void -> work it out good, 
        cleanup previous elements~~
    - ~~updateDropzoneFile(dropzoneFile: DropzoneFile): void -> work it out good~~
    - ~~removeDropzoneFile(dropzoneFile: DropzoneFile): void -> work it out good
            cleanup previous elements~~
    - ~~Remove eventHandlers when deletable changes from true to false to true.~~
    - ~~Remove eventHandlers when downloadable changes from true to false to true.~~
    - ~~Add thrashcan icon if deletable.~~
        - ~~Make them removable in backend~~
        - ~~Make them removable in front end~~ 
        - ~~Keep delete button disabled during delete.~~
    - ~~handleUploadCompleted => input dropzoneFile~~
    - ~~main.ts handle error~~ 
    - backend:
        - catch error in api en send error back.
        - add thumbnail behaviour (backend, frontend, output)
    - ~~Configure the removables, per item.~~
    - ~~implement destroy for dropzone, for dropzoneFileElement?~~
    - ~~multi upload?~~
    - ~~Populate with read data~~
        - ~~Determine data model format~~
        - ~~read from backend~~
    - ~~Styling: keep the name of the output file element inside the output container.~~  
    - ~~what to do on click.~~
        - ~~show image other tab,~~
    - show uploading indication as a line
        - ~~add  progress callback~~
        - ~~use XmlHttpRequest for the progress in the main.ts.~~
    - show files in JIRA style?  ![alt jira example](./images/JIRA-style.JPG)
        - ~~First, without thumbs~~
        - ~~Second , with thumbs (thumbs are generated in backend? )~~
    - Configure max upload size in frontend? of backend?
    - configure dropppable, uploadable types?
    - Upload on client command
    - add CTRL-PASTE behaviour
    - enable Edge, IE11, Firefox? Safari?
    - build preview library (next lib!)
    - ~~refactor scss to use two models and variables.~~
    - appendDropzoneFile(dropzoneFile: DropzoneFile): void of prepend of insertDropzoneFileAt(dzfile, index)? 
    - getNumberOfDropzoneFiles():number
    - cors.
    - build angular integration
    
    - IE - bugs
        - The top off the dropzone is not droppable, make it droppable in IE11.
        - fallback for IE10
