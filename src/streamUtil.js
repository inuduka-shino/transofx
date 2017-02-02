/*eslint-env node */
/*eslint no-await-in-loop: 0 */

const stream = require('stream');

function joinStream (streams) {
  const joinedStrm = new stream.Transform({
          transform(chunk, encode, cb) {
            this.push(chunk);
            cb();
          },
          flush: (cb) => {
              cb();
          }
        }),
        lastIndex = streams.length - 1;

  if (lastIndex < 0) {
    joinedStrm.end();

    return joinedStrm;
  }
  streams.reduce((prevStrm, currentStrm, indx) => {
    let endFlag = false;

    if (indx === lastIndex) {
      endFlag = true;
    }

    if (indx === 0) {
      currentStrm.pipe(joinedStrm, {
                    end: endFlag
                  });
    } else {
      prevStrm.on('end', () =>{
        currentStrm.pipe(joinedStrm, {
                      end: endFlag
                    });
      });
    }

    return currentStrm;
  }, null);

  return joinedStrm;

}

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

function itrToRStrm(itr) {
  // iterator -> readableStream
  return new stream.Readable({
    objectMode: false,
    read() {
      const result = itr.next();

      if (result.done) {
        this.push(null);
      } else {
        this.push(result.value);
      }
    }

  });
}

module.exports = {
  readStreamPromise,
  filterStream,
  joinStream,
  itrToRStrm,
};
