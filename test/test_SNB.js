/*eslint-env mocha */
/*eslint strict: ["error", "function"], no-console: "off", */
/*eslint no-await-in-loop: 0 */

const expect = require('chai').expect,
      co = require('co'),
      fs = require('fs'),
      iconv = require('iconv-lite'),
      csvparse = require('csv-parse'),
      streamUtil = require('../src/streamUtil');

const sjisTrans = iconv.decodeStream('shift-jis');

describe('SNB Imageテスト', ()=>{
  const
        //workFolderPath = 'test/work',
        sampleFolderPath = 'test/work_sample',
        title_list = [
          '日付',
          '内容',
        ];
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
        rdata.forEach((data_elm)=>{
          title_list.forEach((title)=>{
            expect(data_elm).has.property(title);
          });
        });
      });
    });

  });

});
