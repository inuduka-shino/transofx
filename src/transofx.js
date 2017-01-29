/*eslint-env node */

const
      fs = require('fs');
      // co = require('co'),
      // fsp = require('./fs-promise.js');

function getCsvFileReadStream(path) {
  return fs.createReadStream(path);
}

/*function writeOfxFile(path) {
} */

module.exports = {
  getCsvFileReadStream,
  //writeOfxFile
};
