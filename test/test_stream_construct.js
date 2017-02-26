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
        outStrm = new stream.PassThrough();

  if (elmType === 'string' || elmType === 'number') {
    outStrm.write(`<${pKey}>${pelm}\n`);
    outStrm.end();
  } else if (elmType === 'array') {

    //outStrm.write(`---array:${pKey}\n`);
/*    for (const elm of pelm) {
      const elmStrm = orderedDictToStream(pKey, elm);

      elmStrm.pipe(outStrm, {
        end: false
      });
      outStrm.write('----elm:' + typeof elmStrm + '\n');
    }
    outStrm.write(`----array:${pKey}\n`);
    outStrm.end();*/
    const elmStrm = orderedDictToStream(pKey, pelm[0]);

    outStrm.write(`----array:${pKey}\n`);
    elmStrm.pipe(outStrm, {
      end: false
    });
    elmStrm.on('end', () =>{
      outStrm.write(`----array end:${pKey}\n`);
      outStrm.end();
    });

  } else {
    throw new Error('bad Object');
  }

  return outStrm;
}
function makeObjStream(ofxOrderedDict) {
  return orderedDictToStream('OFX', ofxOrderedDict);
}

describe('object stream stream', ()=>{
  it('test array', () => {
    const retStrm = makeObjStream(['v1','v2']);

    return co(function *() {
      const rdata = yield streamUtil.readStreamPromise(retStrm);

      expect(rdata).is.equal(trimLine(`
        #<OFX>v1
        #<OFX>v2
      `));
    });
  });

  it('array to iterator', () => {
    const arr = [3,1,4];
    const iArr = arr[Symbol.iterator]();

    expect(iArr.next().value).is.equal(3);
    expect(iArr.next().value).is.equal(1);
    expect(iArr.next().value).is.equal(4);
    expect(iArr.next().done).is.equal(true);
  });

  it('iterator reduce', () => {
    const arr = [3,1,4];


    const ixArr = {};

    ixArr[Symbol.iterator] = function () {
      return arr[Symbol.iterator]();
    };

    console.log([].map.call(ixArr,(a) => a*a));

    const v0 = arr.reduce((a,b) => a + b, 0),
          v1 = Array.prototype.reduce.call(ixArr, (a,b) => a +b, 0);

    expect(v1).is.equal(v0);

  });

  it('test one value stream pre', () => {
    const outStrm = new stream.PassThrough();

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


  it.skip('test', () => {
    const retObjStrm = makeObjStream($([
            ['aaa', 'bbb'],
            ['ccc', 'ddd'],
          ])),
          retStrm = null; // tranObjStreamStream();

    retObjStrm.pipe(retStrm);

    return co(function *() {
      const rdata = yield streamUtil.readStreamPromise(retStrm);

      expect(rdata).is.equal(trimLine(`
        #aaabbb
      `));
    });
  });
});
