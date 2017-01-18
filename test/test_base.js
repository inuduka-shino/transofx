/*eslint-env mocha */
/*eslint strict: ["error", "function"], no-console: "off", */
/*eslint no-await-in-loop: 0 */


const expect = require('chai').expect,
      target = require('../src/filectrl.js');

function failTest() {
  expect().is.not.undefined;
}
describe('モジュール基本テスト', ()=>{
  const workFolderPath= 'test/work';
  it('module はあるか？', () => {
    expect(target).is.not.undefined;
  });
  it('stat はあるか？', () => {
    expect(target).has.property('stat');
  });
  it('stat は呼び出せるか？', () => {
    return target.stat(workFolderPath).then((stat) => {
      expect(stat.isDirectory()).to.be.true;
    });
  });
  it('sample_promise をテスト', () => {
    return target.sample_promise(true).then(
      (ret)=>{
        expect(ret).is.not.undefined;
      },
      failTest
    );
  });
  it('rejectするsample_promise をテスト', () => {
    return target.sample_promise(false).then(
      failTest,
      (err)=>{
        expect(err).is.a('Error');
      }
    );
  });

});
