/*eslint-env mocha */
/*eslint strict: ["error", "function"], no-console: "off", */
/*eslint no-await-in-loop: 0 */


const expect = require('chai').expect,
      fsp = require('../src/fs-promise.js'),
      fileutil = require('../src/fileutil.js');

function checkWorkFolder(workFolderPath) {
  return fsp.stat(workFolderPath).then(
    (stat) => {
      if (!stat.isDirectory()) {
        throw new Error(`not directory for ${workFolderPath}`);
      }
    }
  );
}

describe('fileutil テスト', ()=>{
  const workFolderPath= 'test/work';
  describe('genFolderテスト', ()=>{
    before(checkWorkFolder.bind(null,workFolderPath));
    before(() => {
      //TODO: clear workdir
    });
    it('よんでみる',()=> {
      const targetpath = workFolderPath + '/aaaa',
            return_val = fsp.genFolder(targetpath);
      expect(return_val).is.a('Promise');
    });
  });
});
