/*eslint-env node */

const fs = require('fs'),
      iconv = require('iconv-lite');
const
      sjisTrans = iconv.decodeStream('shift_jis');
      // co = require('co'),
      // fsp = require('./fs-promise.js');

function getCsvFileReadStream(path, encoding) {

  fs.createReadStream(path, {
    flags: 'r',
    //encoding,
  }).pipe(sjisTrans);

  return sjisTrans;
}

/*function writeOfxFile(path) {
} */

module.exports = {
  getCsvFileReadStream,
  //writeOfxFile
};
