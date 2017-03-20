/*eslint-env node, mocha */

const {expect} = require('chai'), //eslint-disable-line object-curly-newline
      co = require('co'),
      stream = require('stream'),
      streamUtil = require('../src/streamUtil'),
      {
        orderedDictToStream,
        makeObjStream,
      } = require('../src/ofx_stream_construct');

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

describe('object stream stream', ()=>{
  it('test complex', () => {
    const retStrm = makeObjStream(new Map([
      ['num', 1234],
      ['str','val'],
      ['array',['val1', 'val2']],
      ['obj',new Map([
        ['mem1', 999],
        ['mem2', '999A'],
        ['mem3', ['mem3val1','mem3val2']],
      ])],
    ]));

    return co(function *() {
      const rdata = yield streamUtil.readStreamPromise(retStrm);

      expect(rdata).is.equal(trimLine(`
        #<OFX>
        #<num>1234
        #<str>val
        #<array>val1
        #<array>val2
        #<obj>
        #<mem1>999
        #<mem2>999A
        #<mem3>mem3val1
        #<mem3>mem3val2
        #</obj>
        #</OFX>
      `));
    });
  });

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
});
