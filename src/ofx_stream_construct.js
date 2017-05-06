/*eslint-env node, mocha */

const stream = require('stream');

function makeHeaderStream(headerMap) {
  const itr = headerMap[Symbol.iterator]();

  return new stream.Readable({
    read () {
      const data = itr.next();

      if (data.done) {
        this.push(null);
      } else {
        this.push(`${data.value[0]}:${data.value[1]}\n`);
      }
    }
  });

}


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

module.exports = {
  makeHeaderStream,
  orderedDictToStream,
  makeOfxObjStream(ofxOrderedDict) {
   return orderedDictToStream('OFX', ofxOrderedDict);
 }
};
