/*eslint-env mocha */

const expect = require('chai').expect,
      co = require('co'),
      fs = require('fs'),
      stream = require('stream'),
      iconv = require('iconv-lite'),
      csvparse = require('csv-parse'),
      streamUtil = require('../src/streamUtil');

function filterStream(fileterFunc) {
  let count = 0;

  return new stream.Transform({
      objectMode: true,
      transform(chunk, encode, cb) {
          try {
              if (fileterFunc(chunk ,count)) {
                this.push(chunk);
              }
              count += 1;

              return cb();
          } catch (err) {
              return cb(err);
          }
      },
      flush: (cb) => {
          cb();
      }
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
  strm = strm.pipe(filterStream((chunk, indx) => {
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

describe('SNB Imageテスト', ()=>{
  const
        //workFolderPath = 'test/work',
        sampleFolderPath = 'test/work_sample';

  describe('SNB CSV read テスト', ()=>{
    const snbSampleCSVPath = sampleFolderPath + '/snb.csv',
          field_list = [
            'date',
            'contents',
            'payment',
            'income',
            'balance',
            'memo',
          ],
          title_list = [
            '日付',
            '内容',
            '出金金額(円)',
            '入金金額(円)',
            '残高(円)',
            'メモ',
          ];


    it('SNB CSV read',()=> {
      return co(function *() {
        const rStrm = readCSV(snbSampleCSVPath, {
          decode: 'shift-jis',
          header: true,
          field_list,
          title_list,
          headerCB (header) {
              field_list.forEach((field, indx)=>{
                if (header[field] !== title_list[indx]) {
                  throw Error(`ヘッダ行フォーマットが違います。${header[field]}`);
                }
              });
          }
        });

        const rdata = yield streamUtil.readStreamPromise(
                      rStrm, {
                        objectMode: true,
                      });

        console.log(rdata[0]);
        console.log(rdata[1]);
        rdata.forEach((data_elm)=>{
          field_list.forEach((field)=>{
            expect(data_elm).has.property(field);
          });
        });
      });
    });

  });

});
