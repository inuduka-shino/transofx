/*eslint-env mocha */
/*eslint strict: ["error", "function"], no-console: "off", */
/*eslint no-await-in-loop: 0 */


const expect = require('chai').expect,
      target = require('../src/filectrl.js');

describe('filectrl テスト', ()=>{
  const workFolderPath= 'work';
  it('module はあるか？', () => {
    expect(target).is.not.undefined;
  });
  it('fsstat はあるか？', () => {
    expect(target).has.property('fsstat');
  });
  it('fsstat は呼び出せるか？', () => {
    const stat_promise = target.fsstat(workFolderPath);
    expect(stat_promise).is.not.undefined;
  });
  it('sample_promise は呼び出せるか？', () => {
    const stat = target.sample_promise(true);
    expect(stat).is.not.undefined;
  });
  it('rejectするsample_promise は呼び出せるか？', () => {
    const stat = target.sample_promise(false);
    expect(stat).is.not.undefined;
  });

});
