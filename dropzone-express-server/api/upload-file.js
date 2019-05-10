var express = require('express');
const formidable = require('formidable');
var router = express.Router();

/* Post file upload. */
router.get('/', function (req, res, next) {
    console.log('get uploaded files');
    res.send('get uploaded files');
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
