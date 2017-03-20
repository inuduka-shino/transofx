/*eslint-env node, mocha */

const {expect} = require('chai'), //eslint-disable-line object-curly-newline
      co = require('co'),
      fs = require('fs'),
      streamUtil = require('../src/streamUtil');

const ofxInfo = require('../src/ofxInfo'),
      {
        makeHeaderStream,
        orderedDictToStream,
        makeObjStream,
      } = require('../src/ofx_stream_construct');


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

  const trimLine2 = (()=>{
    const linePattern = /^\s*(.*)\s*$/;

    return (linesStr) => {
          const lines = linesStr.split('\n');

          return lines.map((line) => {
            return line.replace(linePattern, '$1');
          }).filter((line) => {
            if (line ==='<!-- Not used -->') {
              return false;
            }

            return true;
          })
          .join('\n');
        };

  })();

/*
function transText(options) {
  let counter = 0;
  const transStrm = new stream.Transform({
      objectMode: true,
      transform(chunk, encode, cb) {
          try {
              if (counter === 0) {
                for (const chunk of headerStrIter) {
                  this.push(chunk);
                }
              }
              if (counter < 2) {
                this.push(xmakeTransactionRecode(chunk));
              }
              counter += 1;

              return cb();
          } catch (err) {
              return cb(err);
          }
      },
      flush: (cb) => {
          cb();
      }
  });
  transStrm._readableState.objectMode = false; //eslint-disable-line no-underscore-dangle
  transStrm._writableState.objectMode = true; //eslint-disable-line no-underscore-dangle

  return transStrm;
}
*/

describe('test ofx info body', () => {
  const sampleFolderPath = 'test/work2/';

  it('ofx info head test', () => {
    const testStream = makeHeaderStream(ofxInfo.header);

    return co(function *() {
      const rdata = yield streamUtil.readStreamPromise(testStream);

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

  it('ofx info body test', () => {
    const testStream = makeObjStream(ofxInfo.body);

    return co(function *() {
      const rdata = yield streamUtil.readStreamPromise(testStream);

      expect(rdata).is.equal(trimLine(`
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
        #</BANKTRANLIST>
        #</STMTRS>
        #<Dummy>0
        #</STMTTRNRS>
        #</BANKMSGSRSV1>
        #</OFX>
      `));
    });
  });

    it.skip('compare sample.ofx',()=> {
      //console.log(ofxInfo.body);
      //console.log(ofxInfo.body.SIGNONMSGSRSV1);
      ofxInfo.body.SIGNONMSGSRSV1.SONRS.DTSERVER = '20170212091105[+9:JST]';
      ofxInfo.body.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.DTSTART = '20170101000000[+9:JST]';
      ofxInfo.body.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.DTEND = '20170212235959[+9:JST]';

      return co(function *() {
        const ofxPath = sampleFolderPath + 'sample.ofx';


        const ofxStrm = ofxUtil.makeOfxStream({
            header: ofxInfo.header,
            body: ofxInfo.body
          });

        const retData = yield streamUtil.readStreamPromise(ofxStrm);
        const sampleData = yield streamUtil.readStreamPromise(fs.createReadStream(ofxPath));

        //console.log(retData); //eslint-disable-line no-console

        expect(retData).is.equal(trimLine2(sampleData));

      });
    });

    it.skip('construct OFX with  stream Object',()=> {
          return co(function *() {
            const ofxItr = ofxUtil.makeOfxItr({
              header: $(
                ['testHeader1', 'testheader']
              ),
              body: $(
                ['xx', 'aaa'],
                ['str', 'aaa']
              )
            });

            const rdata = yield streamUtil.readStreamPromise(
                          streamUtil.itrToRStrm(ofxItr), {
                            objectMode: false,
                          });

            // console.log(rdata); //eslint-disable-line no-console
            expect(rdata).is.equal(trimLine(`
                #testHeader1:testheader
                #<OFX>
                #<str>aaa
                #</OFX>
                `));

          });
        });

    it.skip('construct OFX',()=> {
          return co(function *() {
            const ofxItr = ofxUtil.makeOfxItr({
              header: $(
                ['testHeader0', 'testheader'],
                ['testHeader1', 'xxxxx']
              ),
              separater: '\n',
              body: $(
                ['str', 'aaa'],
                ['num', 55],
                ['dict', $(
                  ['m', 'v'],
                  ['n', 'u']
                )],
                ['arr', ['a', 'b']],
                ['dict-ad', $(
                  ['arr', ['a']],
                  ['dict', $(
                      ['x', 'x']
                  )]
                )],
                ['arr-dict', [
                  $(['x', 'x']),
                  $(['y', 'y']),
                ]]
              )
            });

            const rdata = yield streamUtil.readStreamPromise(
                          streamUtil.itrToRStrm(ofxItr), {
                            objectMode: false,
                          });

            // console.log(rdata); //eslint-disable-line no-console
            expect(rdata).is.equal(trimLine(`
                #testHeader0:testheader
                #testHeader1:xxxxx
                #
                #<OFX>
                #<str>aaa
                #<num>55
                #<dict>
                #<m>v
                #<n>u
                #</dict>
                #<arr>a
                #<arr>b
                #<dict-ad>
                #<arr>a
                #<dict>
                #<x>x
                #</dict>
                #</dict-ad>
                #<arr-dict>
                #<x>x
                #</arr-dict>
                #<arr-dict>
                #<y>y
                #</arr-dict>
                #</OFX>
              `));

        });
    });

});
