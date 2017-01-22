/*eslint-env mocha */
/*eslint strict: ["error", "function"], no-console: "off", */
/*eslint no-await-in-loop: 0 */

const expect = require('chai').expect,
      fsp = require('../src/fs-promise.js'),
      co = require('co');

function failTest() {
  expect().is.not.undefined;
}
describe('fs-promiseテスト', ()=>{
  const workFolderPath= 'test/work';

  describe('baseテスト',()=>{
    it('module はあるか？', () => {
      expect(fsp).is.not.undefined;
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
          expect(ret).is.not.undefined;
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
      expect(fsp.extra).is.not.undefined;
    });
    it('removePromise はあるか？', () => {
      expect(fsp.extra).has.property('removePromise');
    });
    it('removePromise は呼び出せるか？', () => {
      return fsp.extra.removePromise(workFolderPath + '/abcd')
        .then((return_val) => {
          expect(return_val).is.undefined;
        });
    });
  });

  describe('実行テスト',()=>{
    before(() => {
      return co(function *() {
        const stat = yield fsp.statPromise(workFolderPath);
        if (!stat.isDirectory()) {
          throw new Error(`${workFolderPath}ディレクトリがありません。`);
        }
        yield fsp.extra.emptydirPromise(workFolderPath);
      });
    });

    describe('mkdirsPromise', () => {
      const genFolderPath = workFolderPath + '/aaa';
      it('mkdirsPromise確認', () =>{
        return co(function *() {
          yield fsp.extra.mkdirsPromise(genFolderPath);
          const stat = yield fsp.statPromise(genFolderPath);
          expect(stat.isDirectory()).is.true;
        });
      });
    });
  });

});
