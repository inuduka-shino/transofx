/*eslint-env node */
/*eslint no-await-in-loop: 0 */

const stream = require('stream');

function readStreamPromise(strm, options={}) {
  return new Promise((resolve, reject) => {
    const chunkList = [];

    strm.on('data', (chunk)=>{
        chunkList.push(chunk);
    });
    strm.on('end', ()=>{
      if (options.objectMode) {
        resolve(chunkList);
      } else {
        resolve(chunkList.join(''));
      }
    });
    strm.on('error', (err)=>{
      reject(err);
    });
  });
}

function filterStream(fileterFunc , initialValue) {
  let count = 0,
      previousValue = null;

  if (initialValue) {
    previousValue = initialValue;
  }

  return new stream.Transform({
      objectMode: true,
      transform(chunk, encode, cb) {
          try {
              if (fileterFunc(chunk ,count, previousValue)) {
                this.push(chunk);
              }
              count += 1;

              return cb();
          } catch (err) {
              return cb(err);
          }
      },
      flush: (cb) => {
          cb();
      }
  });
}

module.exports = {
  readStreamPromise,
  filterStream,
};
