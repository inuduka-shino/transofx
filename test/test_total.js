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

const trimLine = (()=>{
    const linePattern = /(\n|^)(\s*#)/g,
          firstLinePattern = /^\s*/,
          endLinePattern = /(\n|^)\s*$/;

    return (linesStr) => {
          const val = linesStr
                  .replace(firstLinePattern, '')
                  .replace(endLinePattern, '$1')
                  .replace(linePattern, '$1');

          return val;
        };

  })();

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
              headerStrm = makeHeaderStream(ofxInfo.header),
              bodyStrm = makeOfxObjStream(ofxInfo.body);

        const rdata = yield streamUtil.readStreamPromise(headerStrm),
              bdata = yield streamUtil.readStreamPromise(bodyStrm);

        /*rStrm.on('data', (data) => {
          console.log(data);
        });*/
        expect(bdata).is.equal(trimLine(`
          #<OFX>
          #<SIGNONMSGSRSV1>
          #<SONRS>
          #<STATUS>
          #<CODE>0
          #<SEVERITY>INFO
          #</STATUS>
          #<DTSERVER>YYYYMMDDhhmmss[+9:JST]
          #<LANGUAGE>JPN
          #<FI>
          #<ORG>Smoke Beacon Bank
          #</FI>
          #</SONRS>
          #</SIGNONMSGSRSV1>
          #<BANKMSGSRSV1>
          #<STMTTRNRS>
          #<TRNUID>0
          #<STATUS>
          #<CODE>0
          #<SEVERITY>INFO
          #</STATUS>
          #<STMTRS>
          #<CURDEF>JPY
          #<BANKACCTFROM>
          #<BANKID>9901
          #<BRANCHID>0101
          #<ACCTID>04400091
          #<ACCTTYPE>SAVINGS
          #</BANKACCTFROM>
          #<BANKTRANLIST>
          #<DTSTART>YYYYMMDDhhmmss[+9:JST]
          #<DTEND>YYYYMMDDhhmmss[+9:JST]
          #<STMTTRN>
          #<TRNTYPE>DEBIT
          #<DTPOSTED>YYYYMMDDhhmmss[+9:JST]
          #<TRNAMT>-3384
          #<FITID>29010400000001
          #<NAME>ﾄｳｷﾖｳｶﾞｽ
          #</STMTTRN>
          #<STMTTRN>
          #<TRNTYPE>DEP
          #<DTPOSTED>YYYYMMDDhhmmss[+9:JST]
          #<TRNAMT>100
          #<FITID>29010400000002
          #<NAME>収入
          #</STMTTRN>
          #</BANKTRANLIST>
          #</STMTRS>
          #</STMTTRNRS>
          #</BANKMSGSRSV1>
          #</OFX>
        `));
        expect(rdata).is.equal(trimLine(`
          #OFXHEADER:100
          #DATA:OFXSGML
          #VERSION:102
          #SECURITY:NONE
          #ENCODING:UTF-8
          #CHARSET:CSUNICODE
          #COMPRESSION:NONE
          #OLDFILEUID:NONE
          #NEWFILEUID:NONE
        `));
      });
    });
  });
});
