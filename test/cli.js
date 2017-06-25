/*eslint-env node, mocha */


const expect = require('chai').expect,
      readline = require('readline');

const config = require('../config');
const transofx = require('../src/transofx');

describe('cli dummy', () =>{
  it('cli dummy', () => {
      const strm = transofx.getCsvFileReadStream(config.csvPath, config.csvPathEncoding);
      const rl = readline.createInterface({
        'input': strm,
        'output': {}
      });

      expect(strm).is.a('Object');
      rl.on('line', (line) =>{
        console.log(line);
      });

  });
});
