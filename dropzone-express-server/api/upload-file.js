const express = require('express');
const formidable = require('formidable');
const router = express.Router();
const fs = require('fs');

/* Post file upload. */
router.get('/', function (req, res, next) {
    console.log('get uploaded files');
    fs.readdir(__dirname + '/uploads/', (err, files) => {
        const readFiles = [];
        let randomBytes = 500;
        files.forEach(file => {
            readFiles.push({
                id: file,
                fileName: file,
                fileType: 'unknown',
                canBeDeleted: true,
                canBeDownloaded: true,
                fileSizeInBytes: randomBytes
            });
            randomBytes = randomBytes * 2;
        });
        console.log(readFiles);
        res.send(readFiles);
    });
});

router.get('/:name', function (req, res, next) {
    console.log('get uploaded files for name',  req.params.name, __dirname);

    const file = __dirname + '/uploads/' + req.params.name;
    res.download(file); // Set disposition and send it.

    /// res.send('get uploaded files for name');
});

/* Post file upload. */
router.post('/', function (req, res, next) {
    console.log('post it');
    new formidable.IncomingForm().parse(req)
        .on('fileBegin', (name, file) => {
            file.path = __dirname + '/uploads/' + file.name
            console.log('file path', file.path);
        })
        .on('field', (name, field) => {
            console.log('Field', name, field)
        })
        .on('file', (name, file) => {
            console.log('Uploaded file', name, file)
        })
        .on('aborted', () => {
            console.error('Request aborted by the user')
        })
        .on('error', (err) => {
            console.error('Error', err)
            throw err
        })
        .on('end', () => {
            res.end()
        })
});

module.exports = router;
