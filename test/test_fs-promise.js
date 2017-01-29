/*eslint-env node, mocha */

const {expect} = require('chai'), //eslint-disable-line object-curly-newline
      fsp = require('../src/fs-promise.js'),
      fileutil = require('../src/fileutil.js'),
      co = require('co');

function failTest(message = 'bad path') {
  return (val) => {
    throw new Error(`${message}:[${val}]`);
  };
}

describe('fs-promiseテスト', ()=>{
  const workFolderPath= 'test/work';
  const workFolder2Path= 'test/work2';

  describe('baseテスト',()=>{
    it('module はあるか？', () => {
      expect(fsp).is.not.undefined; //eslint-disable-line no-unused-expressions
    });
    it('statPromise はあるか？', () => {
      expect(fsp).has.property('statPromise');
    });
    it('statPromise は呼び出せるか？', () => {
      return co(function *() {
        const stat = yield fsp.statPromise(workFolderPath);

        expect(stat).is.a('Object');
      });
    });
    it('sample_promise をテスト', () => {
      return co(function *() {
        const ret = yield fsp.samplePromise(true).catch(failTest('想定外のreject'));

        expect(ret).is.not.undefined; //eslint-disable-line no-unused-expressions
      });
    });
    it('rejectするsample_promise をテスト', () => {
      return co(function *() {
        const err = yield fsp.samplePromise(false).then(failTest('想定外のresolve'), (err) => err);

        expect(err).is.a('Error');
      });
    });
  });
  describe('extra-baseテスト',()=>{
    it('module はあるか？', () => {
      expect(fsp.extra).is.not.undefined; //eslint-disable-line no-unused-expressions
    });
    it('removePromise はあるか？', () => {
      expect(fsp.extra).has.property('removePromise');
    });
    it('removePromise は呼び出せるか？', () => {
      return co(function *() {
        const returnVal = yield fsp.extra.removePromise(workFolderPath + '/abcd');

        expect(returnVal).is.undefined; //eslint-disable-line no-unused-expressions
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
