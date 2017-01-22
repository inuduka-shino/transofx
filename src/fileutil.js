/*eslint-env node */
/*eslint no-await-in-loop: 0 */
'use strict';
const fsp = require('./fs-promise.js');

function touchPromise(path) {
  return fsp.writeFilePromise(path, '');
}

module.exports = {touchPromise};
