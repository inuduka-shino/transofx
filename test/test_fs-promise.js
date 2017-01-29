/*eslint-env node, mocha */

const expect = require('chai').expect,
      fsp = require('../src/fs-promise.js'),
      fileutil = require('../src/fileutil.js'),
      co = require('co');

function failTest() {
  return expect().is.not.undefined;
}
describe('fs-promiseテスト', ()=>{
  const workFolderPath= 'test/work';
  const workFolder2Path= 'test/work2';

  describe('baseテスト',()=>{
    it('module はあるか？', () => {
      return expect(fsp).is.not.undefined;
    });
    it('statPromise はあるか？', () => {
      expect(fsp).has.property('statPromise');
    });
    it('statPromise は呼び出せるか？', () => {
      return fsp.statPromise(workFolderPath).then((stat) => {
        expect(stat).is.a('Object');
      });
    });
    it('sample_promise をテスト', () => {
      return fsp.sample_promise(true).then(
        (ret)=>{
          return expect(ret).is.not.undefined;
        },
        failTest
      );
    });
    it('rejectするsample_promise をテスト', () => {
      return fsp.sample_promise(false).then(
        failTest,
        (err)=>{
          expect(err).is.a('Error');
        }
      );
    });
  });
  describe('extra-baseテスト',()=>{
    it('module はあるか？', () => {
      return expect(fsp.extra).is.not.undefined;
    });
    it('removePromise はあるか？', () => {
      expect(fsp.extra).has.property('removePromise');
    });
    it('removePromise は呼び出せるか？', () => {
      return fsp.extra.removePromise(workFolderPath + '/abcd')
        .then((return_val) => {
          return expect(return_val).is.undefined;
        });
    });
  });

  describe('実行テスト',()=>{
    before(() => {
      return co(function *() {
        yield fileutil.clearWorkFolder(workFolderPath);
        yield fileutil.touchPromise(workFolderPath + '/.gitkeep');
      });
    });

    describe('mkdirsPromise', () => {
      const genFolderPath = workFolderPath + '/aaa';

      it('mkdirsPromise確認', () =>{
        return co(function *() {
          yield fsp.extra.mkdirsPromise(genFolderPath);
          const stat = yield fsp.statPromise(genFolderPath);

          return expect(stat.isDirectory()).is.true;
        });
      });
    });
  });
  describe('writefilePromise', () => {
    const textfilePath = workFolder2Path + '/sample.txt';

    it('writeFilePromise確認', () =>{
      return co(function *() {
        yield fsp.writeFilePromise(textfilePath, 'data');
        const stat = yield fsp.statPromise(textfilePath);

        return expect(stat.isFile()).is.true;
      });
    });
  });

});
