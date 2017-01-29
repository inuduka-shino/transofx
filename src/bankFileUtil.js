/*eslint-env node */

const fs = require('fs'),
      iconv = require('iconv-lite'),
      csvparse = require('csv-parse'),
      streamUtil = require('../src/streamUtil');

module.exports = {
  readCSV(csvPath, option = {}) {

    let strm = fs.createReadStream(csvPath);

    if (option.decode) {
      strm = strm.pipe(iconv.decodeStream(option.decode));
    }
    strm = strm.pipe(csvparse({
              columns: option.fieldList,
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

};
