const { src, dest } = require('gulp');
const del = require('del');

function clearLibFolder() {
    return del(['lib/**', '!lib']);
}

function copyScssToLibFolder() {
    return src(['src/styles/**/**.*', '!src/styles/styles.scss'])
        .pipe(dest('lib/styles'));
}

exports.clearLibFolder = clearLibFolder;
exports.copyScssToLibFolder = copyScssToLibFolder;
