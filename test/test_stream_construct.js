/*eslint-env node, mocha */

const {expect} = require('chai'), //eslint-disable-line object-curly-newline
      co = require('co'),
      stream = require('stream'),
      streamUtil = require('../src/streamUtil'),
      {
        makeOrderedDict,
        OrderedDict,
      } = require('../src/commonUtility');
const $ = makeOrderedDict;

// 構成objをObjectStream
// 構成objStream を non-object stream

/*
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
*/

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
    yield elm;
  }
}

function joinItretor(mainItr, joinItr) {

}
function checkType(elm) {
  const typeofElm = typeof elm;

  if (typeofElm === 'string') {
    return 'string';
  }
  if (typeofElm === 'number') {
    return 'number';
  }
  if (Array.isArray(elm)) {
    return 'array';
  }
  if (elm instanceof OrderedDict) {
    return 'map';
  }
  throw new Error(`unkown Struct Elemnt Type:${typeofElm}`);
}


function orderedDictToStream(pKey, pelm) {
  const elmType = checkType(pelm),
        outStrm = streamUtil.passStream(false);

  if (elmType === 'string' || elmType === 'number') {
    outStrm.write(`<${pKey}>${pelm}\n`);
    outStrm.end();
  } else if (elmType === 'array') {
    for (const elm of pelm) {
      //printStream(outStrm, pKey, pelm)
    }

  } else {
    throw new Error('bad Object');
  }

  return outStrm;
}
function makeObjStream(ofxOrderedDict) {
  return orderedDictToStream('OFX', ofxOrderedDict);
}

describe('object stream stream', ()=>{
  it('array to iterator', () => {
    const arr = [3,1,4];
    const iArr = arr[Symbol.iterator]();

    expect(iArr.next().value).is.equal(3);
    expect(iArr.next().value).is.equal(1);
    expect(iArr.next().value).is.equal(4);
    expect(iArr.next().done).is.equal(true);
  });

  it('test one value stream pre', () => {
    const outStrm = streamUtil.passStream(false);

    outStrm.write('aaa\n');
    outStrm.end();

    return co(function *() {
      const rdata = yield streamUtil.readStreamPromise(outStrm);

      expect(rdata).is.equal(trimLine(`
        #aaa
      `));
    });
  });
  it('test one value stream', () => {
    const retStrm = orderedDictToStream('key','value');

    return co(function *() {
      const rdata = yield streamUtil.readStreamPromise(retStrm);

      expect(rdata).is.equal(trimLine(`
        #<key>value
      `));
    });
  });

  it('test one value', () => {
    const retStrm = makeObjStream('value');

    return co(function *() {
      const rdata = yield streamUtil.readStreamPromise(retStrm);

      expect(rdata).is.equal(trimLine(`
        #<OFX>value
      `));
    });
  });
  it('test array', () => {
    const retStrm = makeObjStream(['v1','v2']);

    return co(function *() {
      const rdata = yield streamUtil.readStreamPromise(retStrm);

      expect(rdata).is.equal(trimLine(`
        #aaabbb
      `));
    });
  });

  it.skip('test', () => {
    const retObjStrm = makeObjStream($([
            ['aaa', 'bbb'],
            ['ccc', 'ddd'],
          ])),
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
