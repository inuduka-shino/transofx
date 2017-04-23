/*eslint-env node, mocha */

const expect = require('chai').expect,
      co = require('co'),
      bankFile = require('../src/bankFileUtil'),
      streamUtil = require('../src/streamUtil'),
      {
      //  orderedDictToStream,
        makeHeaderStream,
        makeOfxObjStream,
      } = require('../src/ofx_stream_construct'),
      ofxInfo = require('../src/ofxInfo');


describe('SNB SAMBLE', ()=>{
  const
        //workFolderPath = 'test/work',
        sampleFolderPath = 'test/work_sample';

  describe('sample CSV read ', ()=>{
    const sampleCSVPath = sampleFolderPath + '/nyushukinmeisai_20170423_SBI.csv',
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
      sbiCSVOption = {
        csvPath: sampleCSVPath,
        encode: 'shift-jis',
        header: true,
        headerCheck: true,
        fieldList,
        titleList
      };

    it('SBI csv',() => {
      return co(function *() {
        const rStrm = bankFile.readCSV(sbiCSVOption),
              headerStrm = makeHeaderStream(ofxInfo.header);
        //makeOfxObjStream

        const rdata = yield streamUtil.readStreamPromise(
          headerStrm
        );

        expect(rdata).is.equal('aaaa');
      });
    });
  });
});
