/*eslint-env mocha */
/*eslint strict: ["error", "function"], no-console: "off", */
/*eslint no-await-in-loop: 0 */


const expect = require('chai').expect,
      co = require('co'),
      fsp = require('../src/fs-promise.js'),
      fileutil = require('../src/fileutil.js');

describe('transofxテスト', ()=>{
  const workFolderPath= 'test/work';

  beforeEach(() => {
    return co(function *() {
      console.log('clearWorkFolder');
      yield fileutil.clearWorkFolder(workFolderPath);
      yield fileutil.touchPromise(workFolderPath + '/.gitkeep');
    });
  });

  describe('read file test', ()=>{
    it('常にＯＫ',()=> {
      expect().is.undefined;
    });
  });
});
