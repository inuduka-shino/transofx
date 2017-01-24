/*eslint-env node */
/*eslint no-await-in-loop: 0 */
'use strict';

function readStreamPromise(strm, options={}) {
  return new Promise((resolve, reject) => {
    const chunk_list = [];

    strm.on('data', (chunk)=>{
        chunk_list.push(chunk);
    });
    strm.on('end', ()=>{
      if (options.objectMode) {
        resolve(chunk_list);
      } else {
        resolve(chunk_list.join(''));
      }
    });
    strm.on('error', (err)=>{
      reject(err);
    });
  });
}


module.exports = {
  readStreamPromise,
  //writeOfxFile
};
