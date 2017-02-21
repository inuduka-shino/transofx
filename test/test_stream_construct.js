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


function printStream(outStrm, pKey, pelm) {
  const elmType = checkType(pelm);
  console.log(elmType);
  console.log(pelm);
  if (elmType === 'string' || elmType === 'number') {
    outStrm.write(`<${pKey}>:$pelm`);
  } else if (elmType === 'array') {
    for(const elm of pelm) {
      printStream(outStrm, pKey, pelm)
    }

  } else {
    // pass
  }

}
function makeObjStream(ofxOrderedDict) {
  const retStrm = streamUtil.ObjToStrStream();
  printStream(retStrm, 'OFX', ofxOrderedDict);
  return retStrm;
}

describe('object stream stream', ()=>{
  it('test one value', () => {
    const retStrm = makeObjStream('value');

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
