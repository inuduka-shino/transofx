/*eslint-env node, mocha */

const {expect} = require('chai'), //eslint-disable-line object-curly-newline
      co = require('co'),
      stream = require('stream'),
      bankFile = require('../src/bankFileUtil'),
      streamUtil = require('../src/streamUtil');

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

function *makeHeaderStrItr(headerObj) {
  const ofxHeaders = [
    //'OFXHEADER',
    // 'DATA', 'VERSION', 'SECURITY', 'ENCODING', 'CHARSET',
    //'COMPRESSION', 'OLDFILEUID', 'NEWFILEUID'
    'testHeader0', 'testHeader1',
  ];

  for (const name of ofxHeaders) {
    yield name.toUpperCase() + ':' + headerObj[name] + '\n';
  }
}

function makeTransactionRecode() {
  return 'transaceion\n';
}

function transText(options) {
  let counter = 0;
  const headerStrIter = makeHeaderStrItr(options);
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
                this.push(makeTransactionRecode(chunk));
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

function *makeOfxItr(ofxInfo, transactionStrm) {

  yield* makeHeaderStrItr(ofxInfo.header);
  yield '\n';

  /* const ofxBody = {
          body: transactionStrm
        };
        */
  //const ofxHeaderItr;

  //return streamUtil.joinStream([ofxHeaderStrm, newLine, bodyStrm]);
  //return streamUtil.joinStream([ofxHeaderStrm, newLineStrm]);
}

describe('ofx', () => {
  const sampleFolderPath = 'test/work_sample';
  const snbSampleCSVPath = sampleFolderPath + '/snb.csv',
        fieldList = [
          'date',
          'contents',
          'payment',
          'income',
          'balance',
          'memo',
        ];

    it('construct OFX',()=> {
          return co(function *() {
            const ofxItr = makeOfxItr({
              header: {
                testHeader0: 'testheader',
                testHeader1: 'xxxxx',
              }
            }, []);
            const rdata = yield streamUtil.readStreamPromise(
                          streamUtil.itrToRStrm(ofxItr), {
                            objectMode: false,
                          });

            console.log(rdata); //eslint-disable-line no-console
            expect(rdata).is.equal(trimLine(`
                #TESTHEADER0:testheader
                #TESTHEADER1:xxxxx
                #
              `));

        });
    });

});
