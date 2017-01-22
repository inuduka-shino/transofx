/*eslint-env mocha */
/*eslint strict: ["error", "function"], no-console: "off", */
/*eslint no-await-in-loop: 0 */


const expect = require('chai').expect,
      fsp = require('../src/fs-promise.js');

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

  describe('実行テスト',()=>{
    before(()=>{
      return fsp.statPromise(workFolderPath).then((stat) => {
        if (!stat.isDirectory()) {
          throw new Error(`${workFolderPath}ディレクトリがありません。`);
        }
      });
    });
    it('常にＯＫ', ()=>{
      expect().is.undefined;
    });
  });

});
