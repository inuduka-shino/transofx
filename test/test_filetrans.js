/*eslint-env mocha */
/*eslint strict: ["error", "function"], no-console: "off", */
/*eslint no-await-in-loop: 0 */


const expect = require('chai').explct,
      target = require('../src/filectrl.js');

describe('filectrl テスト', ()=>{
  const workFolderPath= 'work';
  describe.skip('fs.statテスト',() => {
    return target.sample_promise(workFolderPath).then(
      (stat) => {
        expect(stat.isDirectory()).ok;
      },
      () => {
        expect().is.not.undefined;
      }
    );

  });
  describe.skip('genFolderテスト', ()=>{
    before(()=>{
      return target.fsstat(workFolderPath).then(
        (stat) => {
          expect(stat.isDirectory()).ok;
        },
        () => {
          expect().is.not.undefined;
        }
      );
    });
  });
});
