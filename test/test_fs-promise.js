/*eslint-env mocha */
/*eslint strict: ["error", "function"], no-console: "off", */
/*eslint no-await-in-loop: 0 */


const expect = require('chai').expect,
      fsp = require('../src/fs-promise.js');

function failTest() {
  expect().is.not.undefined;
}
describe('番外', ()=>{
  it('Promise.denodeifyはない', ()=>{
    expect(Promise.denodeify).is.undefined;
  });
});
describe('fs-promiseテスト', ()=>{
  const workFolderPath= 'test/work';
  it('module はあるか？', () => {
    expect(fsp).is.not.undefined;
  });
  it('stat はあるか？', () => {
    expect(fsp).has.property('stat');
  });
  it('stat は呼び出せるか？', () => {
    return fsp.stat(workFolderPath).then((stat) => {
      expect(stat.isDirectory()).to.be.true;
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
