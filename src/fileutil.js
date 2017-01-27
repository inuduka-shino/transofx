/*eslint-env node */
/*eslint no-await-in-loop: 0 */
'use strict';
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

function readCSV(csvPath, option = {}) {

  let strm = fs.createReadStream(csvPath);

  if (option.decode) {
    strm = strm.pipe(iconv.decodeStream(option.decode));
  }
  strm = strm.pipe(csvparse({
            columns: option.field_list,
          }));
  strm = strm.pipe(streamUtil.filterStream((chunk, indx) => {
      chunk.lineIndex = indx;

      if (option.header && indx === 0) {
        if (option.headerCB) {
          option.headerCB(chunk);
        }

        return false;
      }

      return true;
  }));

  return strm;
}

module.exports = {
  touchPromise,
  clearWorkFolder
};
