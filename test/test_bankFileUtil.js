/*eslint-env node, mocha */

const expect = require('chai').expect,
      co = require('co'),
      bankFile = require('../src/bankFileUtil'),
      streamUtil = require('../src/streamUtil');

describe('bankFileUtil', ()=>{
  const
        //workFolderPath = 'test/work',
        sampleFolderPath = 'test/work_sample';

        const snbSampleCSVPath = sampleFolderPath + '/snb.csv',
              fieldList = [
                'date',
                'contents',
                'payment',
                'income',
                'balance',
                'memo',
              ],
              titleList = [
                '日付',
                '内容',
                '出金金額(円)',
                '入金金額(円)',
                '残高(円)',
                'メモ',
              ];


  it('SNB CSV read 0',()=> {
    return co(function *() {
      const rStrm = bankFile.readCSV(snbSampleCSVPath, {
        decode: 'shift-jis',
        header: false,
        fieldList,
        titleList,
        headerCB (header) {
            fieldList.forEach((field, indx)=>{
              if (header[field] !== titleList[indx]) {
                throw Error(`ヘッダ行フォーマットが違います。${header[field]}`);
              }
            });
        }
      });

      const rdata = yield streamUtil.readStreamPromise(
                    rStrm, {
                      objectMode: true,
                    });

      // console.log(rdata[0]); //eslint-disable-line no-console
      // console.log(rdata[1]); //eslint-disable-line no-console

      rdata.forEach((dataElm)=>{
        fieldList.forEach((field)=>{
          expect(dataElm).has.property(field);
        });
      });
    });
  });

  it('SNB CSV read',()=> {
    return co(function *() {
      const rStrm = bankFile.readCSV({
        csvPath: snbSampleCSVPath,
        encode: 'shift-jis',
        header: false,
        fieldList,
        titleList,
        checkHeader: true
      });

      const rdata = yield streamUtil.readStreamPromise(
                    rStrm, {
                      objectMode: true,
                    });

      // console.log(rdata[0]); //eslint-disable-line no-console
      // console.log(rdata[1]); //eslint-disable-line no-console

      rdata.forEach((dataElm)=>{
        fieldList.forEach((field)=>{
          expect(dataElm).has.property(field);
        });
      });
    });
  });


});
