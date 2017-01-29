/*eslint-env node, mocha */

const expect = require('chai').expect,
      co = require('co'),
      bankFile = require('../src/bankFileUtil'),
      streamUtil = require('../src/streamUtil');

function failTest(message = 'bad path') {
  return (val) => {
    throw new Error(`${message}:[${val}]`);
  };
}


describe('SNB SAMBLE', ()=>{
  const
        //workFolderPath = 'test/work',
        sampleFolderPath = 'test/work_sample';

  describe('CSV read', ()=>{
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
          ],
          snbOption = {
            csvPath: snbSampleCSVPath,
            encode: 'shift-jis',
            header: true,
            headerCheck: true,
            fieldList,
            titleList,
          };


    it('SNB CSV read',()=> {
      return co(function *() {
        const rStrm = bankFile.readCSV(snbOption);

        const rdata = yield streamUtil.readStreamPromise(
                      rStrm, {
                        objectMode: true,
                      });

        console.log(rdata[0]); //eslint-disable-line no-console
        console.log(rdata[1]); //eslint-disable-line no-console

        rdata.forEach((dataElm)=>{
          fieldList.forEach((field)=>{
            expect(dataElm).has.property(field);
          });
        });
      });
    });

    it('SNB CSV read badHeader',()=> {
      const badSnbOption = {
        csvPath: snbSampleCSVPath,
        encode: 'shift-jis',
        header: true,
        headerCheck: true,
        fieldList,
        titleList: [
          '日付',
          '内容',
          '*-出金金額(円)',
          '入金金額(円)',
          '残高(円)',
          'メモ',
        ]
      };

      return co(function *() {
        const rStrm = bankFile.readCSV(badSnbOption);

        const err = yield streamUtil.readStreamPromise(
                      rStrm, {
                        objectMode: true,
                      }).then(failTest(),(err) => err);

        expect(err).is.a('Error');
      });
    });

  });

});
