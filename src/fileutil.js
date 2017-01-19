/*eslint-env node */
/*eslint no-await-in-loop: 0 */
'use strict';
const fsp = require('./fs-promise.js');

module.exports = {
  genFolder(path) {
    fsp.gendir(path);

return path;
  }
};
