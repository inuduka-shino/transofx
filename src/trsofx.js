/*eslint-env node */
/*eslint no-console: 0 */
/* trsofx.js */

const fs = require('fs'),
      readline = require('readline'),
      iconv = require('iconv-lite'),
      config = require('../config.js');


const decodeStream = iconv.decodeStream('Shift_JIS');

function main() {

  const csvStream = fs.createReadStream(
      config.csvPath
    );

  const readlinesStream = readline.createInterface({
    input: csvStream.pipe(decodeStream)
  });

  readlinesStream.on('line',(line) => {
    console.log(`>> ${line}`);
  });
}

main();
