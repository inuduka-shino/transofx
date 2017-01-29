/*eslint-env node, mocha */

const {expect} = require('chai'), //eslint-disable-line object-curly-newline
      co = require('co'),
      stream = require('stream'),
      bankFile = require('../src/bankFileUtil'),
      streamUtil = require('../src/streamUtil');


function transText() {
  const transStrm = new stream.Transform({
      objectMode: true,
      transform(chunk, encode, cb) {
          try {
              this.push('test\n');

              return cb();
          } catch (err) {
              return cb(err);
          }
      },
      flush: (cb) => {
          cb();
      }
  });

  transStrm._readableState.objectMode = false;
  transStrm._writableState.objectMode = true;

  return transStrm;
}
describe('ofx', () => {
  const sampleFolderPath = 'test/work_sample';

  it('SNB CSV read',()=> {
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


        return co(function *() {
          const seriarizeStrm = transText();
          let rStrm = bankFile.readCSV(snbOption);

          rStrm = rStrm.pipe(seriarizeStrm);

          const rdata = yield streamUtil.readStreamPromise(
                        rStrm, {
                          objectMode: false,
                        });

          /* rdata.forEach((dataElm)=>{
            fieldList.forEach((field)=>{
              expect(dataElm).has.property(field);
            });
          }); */
          console.log(rdata);

        });
      });

});
