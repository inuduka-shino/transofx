/*eslint-env mocha */

const expect = require('chai').expect,
      co = require('co'),
      fs = require('fs'),
      iconv = require('iconv-lite'),
      csvparse = require('csv-parse'),
      streamUtil = require('../src/streamUtil');

function skipHeader(objStrm) {
  return objStrm;
}
function readCSV(csvPath, option = {}) {

  let strm = fs.createReadStream(csvPath);

  if (option.decode) {
    strm = strm.pipe(iconv.decodeStream(option.decode));
  }
  strm = strm.pipe(csvparse({
            columns: option.field_list,
          }));
  if (option.header) {
    strm = skipHeader(strm);
  }

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
          ];


    it('SNB CSV read',()=> {
      return co(function *() {
        const rStrm = readCSV(snbSampleCSVPath,{
          decode: 'shift-jis',
          header: true,
          field_list,
          title_list: [
            '日付',
            '内容',
            '出金金額(円)',
            '入金金額(円)',
            '残高(円)',
            'メモ',
          ],
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
