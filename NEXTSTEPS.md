# First release

- ~~add thumbnail behaviour (backend, frontend, output)~~
- ~~add disabled/readonly feature~~
- ~~multilanguage support? i18n, just a json in the code?~~
- ~~build lib?~~
- ~~write documentation (jsDoc, tsDoc, readme? for the lib)~~
- ~~publish on npm~~
- ~~other icon (see design!)~~
- ~~scss 2 modules and variables~~

# Second release
- configure dropppable, uploadable types?
- Upload on client command
- provide a template way for adding the fileitem?
- ~~promote i18n feature in readme~~ 
    - ~~change: upload is compleet => De upload is voltooid.~~
    
# Third release
- add CTRL-PASTE behaviour
- appendDropzoneFile(dropzoneFile: DropzoneFile): void of prepend of insertDropzoneFileAt(dzfile, index)? 
- getNumberOfDropzoneFiles():number
- cors.
- build angular integration
- Document next steps in issue tracker
- npm version patch? remove git add?

# Next steps?

- Start with the dropzone from:

    > ~~https://bitwiser.in/2015/08/08/creating-dropzone-for-drag-drop-file.html~~
    
- Write down features 
    - backend:
        - catch error in api en send error back.
        - add thumbnail behaviour (backend, frontend, output)
    - show uploading indication as a line
        - ~~add  progress callback~~
        - ~~use XmlHttpRequest for the progress in the main.ts.~~
    - show files in JIRA style?  ![alt jira example](./images/JIRA-style.JPG)
        - ~~First, without thumbs~~
        - ~~Second , with thumbs (thumbs are generated in backend? )~~
    - Configure max upload size in frontend? of backend?
    - enable Edge, IE11, Firefox? Safari?
        - document enabled browsers in readme.
    - build preview library (next lib!)
    - ~~refactor scss to use two models and variables.~~
    
    - IE - bugs
        - The top off the dropzone is not droppable, make it droppable in IE11.
        - fallback for IE10
    - write tests.
    - travis, ci?
