/*eslint-env node */
/*eslint no-await-in-loop: 0 */
'use strict';

function readStreamPromise(strm) {
  return new Promise((resolve, reject) => {
    const chunk_list = [],
          options = {};
    strm.on('data', (chunk)=>{
        chunk_list.push(chunk);
    });
    strm.on('end', ()=>{
      if (typeof options.xxxx === 'undefined') {
        resolve(chunk_list.join(''));
      } else {
        resolve(chunk_list);
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
