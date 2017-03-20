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

//eslint-disable-next-line max-statements
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
  if (elm instanceof Map) {
    return 'map';
  }
  if (elm instanceof stream.Readable) {
    return 'stream';
  }
  throw new Error(`unkown Struct Elemnt Type:${typeofElm}:${elm}`);
}

//eslint-disable-next-line max-params
function odsObjStrm(pKey, objStrm, outStrm, orderedDictToStream) {
  let objStrmEnd = false;

  // 最後のデータは以下の順のイベントが起きる
  // (1) ObjStrm:data
  // (2) ObjStrm:end
  // (3) cStrm:end
  objStrm.on('end', () =>{
    objStrmEnd = true;
  });
  objStrm.on('data', (elm) =>{
    const cStrm = orderedDictToStream(pKey, elm);

    objStrm.pause();
    cStrm.pipe(outStrm, {end:false}); //eslint-disable-line object-curly-newline
    cStrm.on('end', () => {
      objStrm.resume();
      if (objStrmEnd) {
        outStrm.end();
      }
    });
  });

}
//eslint-disable-next-line max-params
function odsMap(pKey, pelm, outStrm, orderedDictToStream) {
  outStrm.write(`<${pKey}>\n`);
  let waitClose = Promise.resolve();

  for (const elm of pelm) {
    const cStrm = orderedDictToStream(elm[0], elm[1]);

    waitClose.then(() =>{
      cStrm.pipe(outStrm, {
        end: false
      });
    });
    waitClose = new Promise((resolve) => {
      cStrm.on('end', () => {
        resolve();
      });
    });
  }
  waitClose.then(()=>{
      outStrm.write(`</${pKey}>\n`);
      outStrm.end();
  });
}
//eslint-disable-next-line max-params
function odsArray(pKey, pelm, outStrm, orderedDictToStream) {
  pelm.reduce((prevPromise, elm) => {
    const cStrm = orderedDictToStream(pKey, elm);

    prevPromise.then(() =>{
      cStrm.pipe(outStrm, {
        end: false
      });
    });

    return new Promise((resolve, reject)=>{
      cStrm.on('end', ()=>{
        resolve();
      });
      cStrm.on('error', (err)=>{
        reject(err);
      });
    });
  },Promise.resolve()).then(()=>{
      outStrm.end();
  });
}

//eslint-disable-next-line max-statements
function orderedDictToStream(pKey, pelm) {
  const elmType = checkType(pelm),
        outStrm = new stream.PassThrough();

  if (elmType === 'string' || elmType === 'number') {
    outStrm.write(`<${pKey}>${pelm}\n`);
    outStrm.end();
  } else if (elmType === 'array') {
    odsArray(pKey, pelm, outStrm, orderedDictToStream);
  } else if (elmType === 'map') {
    odsMap(pKey, pelm, outStrm, orderedDictToStream);
  } else if (elmType === 'stream') {
    odsObjStrm(pKey, pelm, outStrm, orderedDictToStream);
} else {
  throw new Error('bad Object');
}

  return outStrm;
}
function makeObjStream(ofxOrderedDict) {
  return orderedDictToStream('OFX', ofxOrderedDict);
}

describe('object stream stream', ()=>{
  it('test dict', () => {
    const retStrm = makeObjStream(new Map([['key','val'],['key2','val2']]));

    return co(function *() {
      const rdata = yield streamUtil.readStreamPromise(retStrm);

      expect(rdata).is.equal(trimLine(`
        #<OFX>
        #<key>val
        #<key2>val2
        #</OFX>
      `));
    });
  });

  it('test object stream', () => {
    const vals = [1,'v2','v3'].reverse();
    let idx = vals.length;

    const testStream = new stream.Readable({
              objectMode: true,
              read () {
                if (idx === 0) {
                  this.push(null);
                } else {
                  idx -= 1;
                  this.push(vals[idx]);
                }
              }
            });

      const retStrm = makeObjStream(testStream);

      return co(function *() {
        const rdata = yield streamUtil.readStreamPromise(retStrm);

        expect(rdata).is.equal(trimLine(`
          #<OFX>1
          #<OFX>v2
          #<OFX>v3
        `));
      });
  });

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
