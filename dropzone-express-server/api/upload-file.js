const express = require('express');
const formidable = require('formidable');
const router = express.Router();
const fs = require('fs');
const mime = require('mime-types')

/* Post file upload. */
router.get('/', function (req, res, next) {
    console.log('get uploaded files');
    fs.readdir(__dirname + '/uploads/', (err, files) => {
        const readFiles = [];
        let randomBytes = 500;
        files.forEach(file => {
            const mimeType = mime.lookup(__dirname + '/uploads/' + file);
            console.log('mimeType for file', file, mimeType);

            let thumbnail = '';
            if('image/png' === mimeType) {
                thumbnail = file;
            }

            readFiles.push({
                id: file,
                fileName: file,
                fileType: 'unknown',
                canBeDeleted: true,
                canBeDownloaded: true,
                fileSizeInBytes: randomBytes,
                thumbnail: thumbnail
            });
            randomBytes = randomBytes * 2;
        });
        console.log(readFiles);
        res.send(readFiles);
    });
});

router.get('/:id', function (req, res, next) {
    console.log('get uploaded files for name',  req.params.id, __dirname);

    const file = __dirname + '/uploads/' + req.params.id;
    res.download(file); // Set disposition and send it.

    /// res.send('get uploaded files for name');
});

router.delete('/:id', function (req, res, next) {
    console.log('delete uploaded files for id',  req.params.id, __dirname);

    const file = __dirname + '/uploads/' + req.params.id;

    fs.unlink(file, (err) => {
        if (err) {
            console.error(err);
            next(err);
            return
        }

        //file removed
        res.send();
    })
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
