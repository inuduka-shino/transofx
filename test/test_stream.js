/*eslint-env node, mocha */

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

        expect(rStrm).is.not.undefined; //eslint-disable-line no-unused-expressions
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
            ['aa','bb','cc','dd'],
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

        const readdata = yield streamUtil.readStreamPromise(csvStrm, {
          objectMode: true
        });

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

        const readdata = yield streamUtil.readStreamPromise(csvStrm, {
            objectMode: true
          });

        const header = testdata[0];

        readdata.forEach((readObj, objIndx) =>{
          header.forEach((key, keyIndx) => {
            expect(readObj).has.property(key, testdata[objIndx + 1][keyIndx]);
          });
        });
      });
    });

  });

  describe('streamUtil joinStrmテスト', ()=>{
    it('interfaceが取得できるか？',()=> {
      expect(streamUtil.joinStream).is.a('Function');
    });

    it('teset join strm test',()=> {
      const rStrmA = streamUtil.itrToRStrm(['AAA']),
            rStrmB = streamUtil.itrToRStrm(['BBB']),
            joinedStrm = streamUtil.joinStream([rStrmA, rStrmB]);

      return co(function *() {
          const val = yield streamUtil.readStreamPromise(joinedStrm);

          expect(val).is.equal('AAABBB');
      });

    });

    it('teset join strm test one stream',()=> {
      const rStrmA = streamUtil.itrToRStrm([
                      'aaaa',
                      'bbbbb',
                      'ccccc',
                    ]),
             joinedStrm = streamUtil.joinStream([rStrmA]);

      return co(function *() {
        const val = yield streamUtil.readStreamPromise(joinedStrm);

        expect(val).is.equal('aaaabbbbbccccc');
      });

    });

    it('teset join strm test no stream',()=> {
      const joinedStrm = streamUtil.joinStream([]);

      return streamUtil.readStreamPromise(joinedStrm).then((val) => {
        // console.log(val);
        expect(val).is.equal('');
      }, (err)=>{
        console.log(err); //eslint-disable-line no-console
        expect().is.equal(true, 'bad pass');
      });

    });
  });

});
