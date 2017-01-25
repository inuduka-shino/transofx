/*eslint-env mocha */
/*eslint strict: ["error", "function"], no-console: "off", */
/*eslint no-await-in-loop: 0 */

const expect = require('chai').expect,
      co = require('co'),
      fs = require('fs'),
      iconv = require('iconv-lite'),
      sjisTrans = iconv.decodeStream('shift-jis'),
      csvparse = require('csv-parse'),
      fsp = require('../src/fs-promise'),
      fileutil = require('../src/fileutil'),
      streamUtil = require('../src/streamUtil');

describe('SNB Imageテスト', ()=>{
  const workFolderPath = 'test/work',
        sampleFolderPath = 'test/work_sample';
        //workFolder2Path= 'test/work2';

  describe('SNB CSV read テスト', ()=>{
    const snbSampleCSVPath = sampleFolderPath + '/snb.csv';
    it('SNB CSV read',()=> {
      return co(function *() {
        const rStrm = fs.createReadStream(snbSampleCSVPath)
                        .pipe(sjisTrans)
                        .pipe(csvparse({columns: true,}));

        const rdata = yield streamUtil.readStreamPromise(
                      rStrm, {objectMode: true});
        console.log(rdata);
      });
    });
  });
});
