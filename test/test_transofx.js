/*eslint-env node, mocha */

const {expect} = require('chai'), //eslint-disable-line object-curly-newline
      co = require('co'),
      fs = require('fs'),
      fsp = require('../src/fs-promise'),
      fileutil = require('../src/fileutil.js'),
      transofx = require('../src/transofx.js');

describe('transofxテスト', ()=>{
  const workFolderPath= 'test/work';
        //workFolder2Path= 'test/work2';

  beforeEach(() => {
    return co(function *() {
      yield fileutil.clearWorkFolder(workFolderPath);
      yield fileutil.touchPromise(workFolderPath + '/.gitkeep');
    });
  });

  describe('transofx baseテスト', ()=>{
    it('interfaceが取得できるか？',()=> {
      expect(transofx).is.a('Object');
    });
    it('getCsvFileReadStreamがあるか？',()=> {
      expect(transofx).has.property('getCsvFileReadStream');
    });
  });
  describe('getCsvFileReadStreamテスト', ()=>{

    describe('read test', ()=>{
      const testfilepath = workFolderPath + '/testfile',
            testdata = `content ${testfilepath}`;

      it.skip('getCsvFileReadStreamでデータを読んでみる',()=> {
        return co(function *() {
          yield fsp.writeFilePromise(testfilepath, testdata, {});

          const csvStream = transofx.getCsvFileReadStream(testfilepath);

          expect(csvStream).is.not.undefined; //eslint-disable-line no-unused-expressions
          expect(csvStream).is.an.instanceof(fs.ReadStream);

          //const readdata = yield readStreamPromise(csvStream);
          //expect(readdata).is.equal(testdata);
        });
      });
    });
  });

});
