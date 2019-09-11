# dropzone-frontend
## How to build and publish the lib to npm

working directory must be dropzone-frontend

    npm run build-lib
    npm version patch
    npm publish
    cd..
    git add .
    git push

During the 'npm publish' the prettier runs and the tslint.
 
