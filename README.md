# fullstack-dropzone
Dropzone, full stack poc

POC for building a browser dropzone that can upload any file.
For testing purposes an simple backend is added.

## What to do

- Build Express backend to upload any filetype
- Build Web UI for dropzone
-- Technology can be determined later: React, Angular, Plain old JS, TS.
(-- Provide Postman files for testing backend.)
-- Write steps to run project.

## Install express backend
change directory:
   > cd dropzone-express-server

install dependencies:
   > npm install

## Run express backend
run the app:
   
   > npm start


The debug doesn't seem to work anymore.
   > SET DEBUG=dropzone-express-server:* & npm start 

## Install the dropzone-frontend

change directory:
    > cd dropzone-frontend

install dependencies:
    > npm install

## Run with reload the dropzone-frontend

    > npm run start

_Start your browser in insecure mode (to bypass cors issues)._

Go to `http://localhost:8080/`

> Make your changes, more info about building and publishing the lib can be found in [HOW_TO_BUILD_AND_PUBLISH_LIB](./dropzone-frontend/HOW_TO_BUILD_AND_PUBLISH_LIB.md).

## After a new version

### Install the dropzone-frontend-test-app

change directory:
> cd dropzone-frontend-test-app

install dependencies:
> npm install
> 
> npm upd dropzone-frontend

### Run and test the new version

> npm run start
