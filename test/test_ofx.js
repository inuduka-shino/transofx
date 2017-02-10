/*eslint-env node, mocha */

const {expect} = require('chai'), //eslint-disable-line object-curly-newline
      co = require('co'),
      fs = require('fs'),
      ofxUtil = require('../src/ofxUtil'),
      //bankFile = require('../src/bankFileUtil'),
      //stream = require('stream'),
      streamUtil = require('../src/streamUtil');

const ofxInfo = require('../src/ofxInfo');

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

describe('ofx', () => {
  const sampleFolderPath = 'test/work_sample/';

  /*
  const snbSampleCSVPath = sampleFolderPath + '/snb.csv',
        fieldList = [
          'date',
          'contents',
          'payment',
          'income',
          'balance',
          'memo',
        ]
        */
    it('compare sample.ofx',()=> {
      return co(function *() {
        const ofxPath = sampleFolderPath + 'sample.ofx';
        const ofxStrm = ofxUtil.makeOfxStream({
            header: ofxInfo.header,
            body: new Map([])
          });

        const retData = yield streamUtil.readStreamPromise(ofxStrm);
        const sampleData = yield streamUtil.readStreamPromise(fs.createReadStream(ofxPath));

        console.log(retData); //eslint-disable-line no-console

        expect(retData).is.equal(trimLine2(sampleData));

      });
    });

    it('construct OFX',()=> {
          return co(function *() {
            const ofxItr = ofxUtil.makeOfxItr({
              header: new Map([
                ['testHeader0', 'testheader'],
                ['testHeader1', 'xxxxx'],
              ]),
              body: new Map([
                ['str', 'aaa'],
                ['num', 55],
                ['dict', new Map([
                  ['m', 'v'],
                  ['n', 'u'],
                ])],
                ['arr', ['a', 'b']],
                ['dict-ad', new Map([
                  ['arr', ['a']],
                  ['dict', new Map([
                      ['X', 'x']
                  ])],
                ])],
                ['arr-dict', [
                  new Map([
                      ['X', 'x'],
                  ]),
                  new Map([
                      ['Y', 'y'],
                  ]),
                ]],
              ])
            });


            const rdata = yield streamUtil.readStreamPromise(
                          streamUtil.itrToRStrm(ofxItr), {
                            objectMode: false,
                          });

            // console.log(rdata); //eslint-disable-line no-console
            expect(rdata).is.equal(trimLine(`
                #TESTHEADER0:testheader
                #TESTHEADER1:xxxxx
                #
                #<ROOT>
                #<STR>aaa
                #<NUM>55
                #<DICT>
                #<M>v
                #<N>u
                #</DICT>
                #<ARR>a
                #<ARR>b
                #<DICT-AD>
                #<ARR>a
                #<DICT>
                #<X>x
                #</DICT>
                #</DICT-AD>
                #<ARR-DICT>
                #<X>x
                #</ARR-DICT>
                #<ARR-DICT>
                #<Y>y
                #</ARR-DICT>
                #</ROOT>
              `));

        });
    });

});
