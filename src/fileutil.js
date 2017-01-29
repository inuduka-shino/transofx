/*eslint-env node */

const co = require('co'),
      fsp = require('./fs-promise.js');

function touchPromise(path) {
  return fsp.writeFilePromise(path, '');
}

function clearWorkFolder(path) {
  return co(function *() {
    const stat = yield fsp.statPromise(path);

    if (!stat.isDirectory()) {
      throw new Error(`${path}ディレクトリがありません。`);
    }
    yield fsp.extra.emptydirPromise(path);
  });
}

module.exports = {
  touchPromise,
  clearWorkFolder
};
