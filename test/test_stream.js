/*eslint-env mocha */
/*eslint strict: ["error", "function"], no-console: "off", */
/*eslint no-await-in-loop: 0 */

const expect = require('chai').expect,
      co = require('co'),
      fs = require('fs'),
      csvparse = require('csv-parse'),
      fsp = require('../src/fs-promise'),
      fileutil = require('../src/fileutil'),
      streamUtil = require('../src/streamUtil');

describe('streamテスト', ()=>{
  const workFolderPath= 'test/work';
        //workFolder2Path= 'test/work2';

  describe('streamUtil baseテスト', ()=>{
    it('interfaceが取得できるか？',()=> {
      expect(streamUtil).is.a('Object');
    });
    it('readStreamPromiseがあるか？',()=> {
      expect(streamUtil).has.property('readStreamPromise');
    });
  });

  describe('readStreamテスト', ()=>{
    const testfilepath = workFolderPath + '/testfile2',
          testdata = `content ${testfilepath}`;

    before(() => {
      return co(function *() {
        yield fileutil.clearWorkFolder(workFolderPath);
        yield fileutil.touchPromise(workFolderPath + '/.gitkeep');
        yield fsp.writeFilePromise(testfilepath, testdata, {});
      });
    });

    it('readStreamPromiseでデータを読んでみる',()=> {
      return co(function *() {

        const rStrm = fs.createReadStream(testfilepath);
        expect(rStrm).is.not.undefined;
        expect(rStrm).is.an.instanceof(fs.ReadStream);

        const readdata = yield streamUtil.readStreamPromise(rStrm);
        expect(readdata).is.equal(testdata);
      });
    });

  });

  describe('csvparseテスト', ()=>{
    const testfilepath = workFolderPath + '/testfile.csv',
          testdata = [
            ['A','B','C','D'],
            ['a','b','c','d'],
          ];

    before(() => {
      const testdataStr = testdata.map((elms) =>{
        return elms.join(',');
      }).join('\n');

      return co(function *() {
        yield fileutil.clearWorkFolder(workFolderPath);
        yield fileutil.touchPromise(workFolderPath + '/.gitkeep');
        yield fsp.writeFilePromise(testfilepath, testdataStr, {});
      });
    });

    it('csvparseしてみる',()=> {
      return co(function *() {

        const rStrm = fs.createReadStream(testfilepath),
              csvTransStrm = csvparse(),
              csvStrm = rStrm.pipe(csvTransStrm);

        const readdata = yield streamUtil.readStreamPromise(
          csvStrm, {objectMode: true});
        expect(readdata).is.deep.equal(testdata);
      });
    });
    it('csvparseしてみる(header付き)',()=> {
      return co(function *() {

        const rStrm = fs.createReadStream(testfilepath),
              csvTransStrm = csvparse({
                columns: true,
                x: 0
              }),
              csvStrm = rStrm.pipe(csvTransStrm);

        const readdata = yield streamUtil.readStreamPromise(
          csvStrm, {objectMode: true});

        const header = testdata[0];

        readdata.forEach((readObj, objIndx) =>{
          header.forEach((key, keyIndx) => {
            expect(readObj).has.property(key, testdata[objIndx + 1][keyIndx]);
          });
        });
      });
    });

  });

  describe.skip('csvparseテスト', ()=>{
    const testfilepath = workFolderPath + '/testfile.csv',
          testdata = [
            ['A','B','C','D'],
            ['a','b','c','d'],
          ];

    before(() => {
      const testdataStr = testdata.map((elms) =>{
        return elms.join(',');
      }).join('\n');

      return co(function *() {
        yield fileutil.clearWorkFolder(workFolderPath);
        yield fileutil.touchPromise(workFolderPath + '/.gitkeep');
        yield fsp.writeFilePromise(testfilepath, testdataStr, {});
      });
    });

    it('csvparseしてみる',()=> {
      return co(function *() {

        const rStrm = fs.createReadStream(testfilepath),
              csvStrm = rStrm.pipe(csvparse());

        const readdata = yield streamUtil.readStreamPromise(
          csvStrm, {objectMode: true});
        expect(readdata).is.deep.equal(testdata);
      });
    });

  });

});
