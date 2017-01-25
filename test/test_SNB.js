/*eslint-env mocha */

const expect = require('chai').expect,
      co = require('co'),
      fs = require('fs'),
      iconv = require('iconv-lite'),
      csvparse = require('csv-parse'),
      streamUtil = require('../src/streamUtil');


describe('SNB Imageテスト', ()=>{
  const
        //workFolderPath = 'test/work',
        sampleFolderPath = 'test/work_sample',
        title_flag = true,
        title_list = [
          '日付',
          '内容',
          '出金金額(円)',
          '入金金額(円)',
          '残高(円)',
          'メモ',
        ];

  function readCSV(csvPath, option = {}) {

    const inputStrm = fs.createReadStream(csvPath),
          outputStrm = csvparse({
                          columns: true,
                        });
    let decodedStrm = inputStrm;
    
    if (option.decode) {
      decodedStrm = inputStrm.pipe(iconv.decodeStream(option.decode));
    }
    decodedStrm.pipe(outputStrm);

    return outputStrm;
  }
  describe('SNB CSV read テスト', ()=>{
    const snbSampleCSVPath = sampleFolderPath + '/snb.csv';

    it('SNB CSV read',()=> {
      return co(function *() {
        const rStrm = readCSV(snbSampleCSVPath,{
          decode: 'shift-jis',
        });

        const rdata = yield streamUtil.readStreamPromise(
                      rStrm, {
                        objectMode: true
                      });
        console.log(rdata[0]);
        rdata.forEach((data_elm)=>{
          title_list.forEach((title)=>{
            expect(data_elm).has.property(title);
          });
        });
      });
    });

  });

});
