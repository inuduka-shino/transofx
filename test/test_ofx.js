/*eslint-env node, mocha */

const {expect} = require('chai'), //eslint-disable-line object-curly-newline
      co = require('co'),
      stream = require('stream'),
      bankFile = require('../src/bankFileUtil'),
      streamUtil = require('../src/streamUtil');


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

function makeOfxStrm(ofxInfo, transactionStrm) {

  const ofxHeaderStrm = streamUtil.itrToRStrm(makeHeaderStrItr(ofxInfo.header));

  /* const ofxBody = {
          body: transactionStrm
        };
        */
  //const ofxHeaderItr;

  //return streamUtil.joinStream([ofxHeaderStrm, newLine, bodyStrm]);
  return streamUtil.joinStream([ofxHeaderStrm]);
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
            const rStrm = makeOfxStrm({
              header: {
                testHeader0: 'testheader',
                testHeader1: 'xxxxx',
              }
            }, []);
            const rdata = yield streamUtil.readStreamPromise(
                          rStrm, {
                            objectMode: false,
                          });

            console.log(rdata); //eslint-disable-line no-console
            expect(rdata).is.equal(`
TESTHEADER0:testheader
TESTHEADER1:xxxxx
              `.trim() + '\n');

        });
    });

});
