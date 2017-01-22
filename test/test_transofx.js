/*eslint-env mocha */
/*eslint strict: ["error", "function"], no-console: "off", */
/*eslint no-await-in-loop: 0 */


const expect = require('chai').expect,
      co = require('co'),
      fs = require('fs'),
      fsp = require('../src/fs-promise'),
      fileutil = require('../src/fileutil.js'),
      transofx = require('../src/transofx.js');

describe('transofxテスト', ()=>{
  const workFolderPath= 'test/work';

  beforeEach(() => {
    return co(function *() {
      yield fileutil.clearWorkFolder(workFolderPath);
      yield fileutil.touchPromise(workFolderPath + '/.gitkeep');
    });
  });

  describe('transofx baseテスト', ()=>{
    it('interfaceが取得できるか？',()=> {
      expect(transofx).is.a('Object');
    });
    it('getCsvFileReadStreamがあるか？',()=> {
      expect(transofx).has.property('getCsvFileReadStream');
    });
  });
  describe('getCsvFileReadStreamテスト', ()=>{
    const testfilepath = workFolderPath + '/testfile',
          testdata = `content ${testfilepath}`;

    before(() =>{
      console.log('write fiel');

      return fsp.writeFilePromise(testfilepath, testdata).then(()=>{
        console.log('write fiel');
      });
    });
    describe('read test', ()=>{
      it('getCsvFileReadStreamでデータを読んでみる',()=> {
        const csvStream = transofx.getCsvFileReadStream(testfilepath);
        expect(csvStream).is.not.undefined;
        expect(csvStream).is.an.instanceof(fs.ReadStream);

        return new Promise((resolve, reject) => {
          const chunk_list = [];
          csvStream.on('data', (chunk)=>{
              chunk_list.add(chunk);
          });
          csvStream.on('end', ()=>{
            resolve(chunk_list.join(''));
          });
          csvStream.on('error', (err)=>{
            reject(err);
          });
        });
      });
    });
  });
});
