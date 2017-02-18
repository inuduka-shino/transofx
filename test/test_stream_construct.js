/*eslint-env node, mocha */

const {expect} = require('chai'), //eslint-disable-line object-curly-newline
      co = require('co'),
      stream = require('stream'),
      streamUtil = require('../src/streamUtil');

// 構成objをObjectStream
// 構成objStream を non-object stream

const ofxObj = {
  'StrA': 'aaa',
  'NumB': 99,
  'ArrayC': ['A','B','C'],
  'objD': {
    'memA': 'aaa',
    'memB': ['aaa','ccc'],
    'memC': {
      'memCC': 'xxx',
      'memCD': 'yyy',
    },
  },
};

const trimLine = (()=>{
    const linePattern = /(\n|^)(\s*#)/g,
          firstLinePattern = /^\s*/,
          endLinePattern = /(\n|^)\s*$/;

    return (linesStr) => {
          const val = linesStr
                  .replace(firstLinePattern, '')
                  .replace(endLinePattern, '$1')
                  .replace(linePattern, '$1');

          return val;
        };

  })();

function *values(arry) {
  for (const elm of arry) {
    if (typeof elm === 'undefined') {
      yield 'undefined';
    }
    yield elm;
  }
}

function makeObjStream(itr) {

  return new stream.Readable({
    objectMode: true,
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

function tranObjStreamStream() {
  const transStrm = new stream.Transform({
    transform(chunk, encode, cb) {
      this.push(chunk);

      return cb();
    },
    flush: (cb) => {
      return cb();
    }
  });

  /*eslint-disable no-underscore-dangle*/
  transStrm._readableState.objectMode = false;
  transStrm._writableState.objectMode = true;

  /*eslint-enable no-underscore-dangle*/
  return transStrm;
}
describe('object stream stream', ()=>{
  it('test', () => {
    const retObjStrm = makeObjStream(values(['aaa','bbb\n'])),
          retStrm = tranObjStreamStream();

    retObjStrm.pipe(retStrm);

    return co(function *() {
      const rdata = yield streamUtil.readStreamPromise(retStrm);

      expect(rdata).is.equal(trimLine(`
        #aaabbb
      `));
    });
  });
});
