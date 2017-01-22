/*eslint-env node */
/*eslint no-await-in-loop: 0 */
'use strict';
const co = require('co'),
      fs = require('fs'),
      fsp = require('./fs-promise.js');

function getCsvFileReadStream(path) {
  return fs.createReadStream(path);
}

/*function writeOfxFile(path) {
} */

module.exports = {
  getCsvFileReadStream,
  //writeOfxFile
};
