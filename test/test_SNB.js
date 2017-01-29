/*eslint-env node, mocha */

const expect = require('chai').expect,
      co = require('co'),
      bankFile = require('../src/bankFileUtil'),
      streamUtil = require('../src/streamUtil');

describe('SNB SAMBLE', ()=>{
  const
        //workFolderPath = 'test/work',
        sampleFolderPath = 'test/work_sample';

  describe('CSV read', ()=>{
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
        const rStrm = bankFile.readCSV(snbSampleCSVPath, {
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

        console.log(rdata[0]); //eslint-disable-line no-console
        console.log(rdata[1]); //eslint-disable-line no-console

        rdata.forEach((data_elm)=>{
          field_list.forEach((field)=>{
            expect(data_elm).has.property(field);
          });
        });
      });
    });

  });

});
