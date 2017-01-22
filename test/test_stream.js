/*eslint-env mocha */
/*eslint strict: ["error", "function"], no-console: "off", */
/*eslint no-await-in-loop: 0 */

const expect = require('chai').expect,
      co = require('co'),
      fs = require('fs'),
      fsp = require('../src/fs-promise'),
      fileutil = require('../src/fileutil'),
      streamUtil = require('../src/streamUtil');

describe('streamテスト', ()=>{
  const workFolderPath= 'test/work';
        //workFolder2Path= 'test/work2';

  describe('streamUtil baseテスト', ()=>{
    it('interfaceが取得できるか？',()=> {
      expect(streamUtil).is.a('Object');
    });
    it('readStreamPromiseがあるか？',()=> {
      expect(streamUtil).has.property('readStreamPromise');
    });
  });

  describe('readStreamテスト', ()=>{
    const testfilepath = workFolderPath + '/testfile2',
          testdata = `content ${testfilepath}`;

    before(() => {
      return co(function *() {
        yield fileutil.clearWorkFolder(workFolderPath);
        yield fileutil.touchPromise(workFolderPath + '/.gitkeep');
        yield fsp.writeFilePromise(testfilepath, testdata, {});
      });
    });

    it('readStreamPromiseでデータを読んでみる',()=> {
      return co(function *() {

        const rStrm = fs.createReadStream(testfilepath);
        expect(rStrm).is.not.undefined;
        expect(rStrm).is.an.instanceof(fs.ReadStream);

        const readdata = yield streamUtil.readStreamPromise(rStrm);
        expect(readdata).is.equal(testdata);
      });
    });
  });

});
