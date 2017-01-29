/*eslint-env node */

const fs = require('fs'),
      iconv = require('iconv-lite'),
      csvparse = require('csv-parse'),
      streamUtil = require('../src/streamUtil');

module.exports = {
  readCSV(csvPath0, option = {}) {
    if (typeof csvPath0 === 'object') {
      option = csvPath0; //eslint-disable-line no-param-reassign
    } else {
      option.csvPath = csvPath0;
    }
    const {
      csvPath,
      encode,
      fieldList,
      titleList,
      header,
      headerCheck
    } = option;
    let strm = fs.createReadStream(csvPath);

    if (encode) {
      strm = strm.pipe(iconv.decodeStream(encode));
    }
    strm = strm.pipe(csvparse({
              columns: fieldList,
            }));
    strm = strm.pipe(streamUtil.filterStream((chunk, indx) => {
        chunk.lineIndex = indx;

        if (header && indx === 0) {
          if (headerCheck) {
            fieldList.forEach((field, indx)=>{
              if (chunk[field] !== titleList[indx]) {
                throw Error(`ヘッダ行フォーマットが違います。[${chunk[field]}]`);
              }
            });
          }

          return false;
        }

        return true;
    }));

    return strm;
  }

};
