# dropzone-frontend
## How to build and publish the lib to npm

working directory must be dropzone-frontend

    npm run build-lib
    npm version patch
    npm login
    npm publish
    git add .
    git commit -m "add a comment!"
    git push

During the 'npm publish' the prettier runs and the tslint.
 
