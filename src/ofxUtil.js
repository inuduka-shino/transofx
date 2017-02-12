/*eslint-env node */

const streamUtil = require('./streamUtil');

function *makeHeaderItr(headerMap) {

  for (const [key, val] of headerMap) {
    yield key.toUpperCase() + ':' + val + '\n';
  }
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
if (elm instanceof Map) {
  return 'map';
}
throw new Error(`unkown Struct Elemnt Type:${typeofElm}`);
}

function *makeBodyItr(keyname, elm) {
const elmType = checkType(elm),
      pKey = keyname.toUpperCase();

  if (elmType === 'map') {
    yield `<${pKey}>\n`;
    for (const [key, val] of elm) {
      yield* makeBodyItr(key, val);
    }
    yield `</${pKey}>\n`;
  } else if (elmType === 'array') {
    for (const val of elm) {
      yield* makeBodyItr(pKey, val);
    }
  } else if (elmType === 'string' || elmType === 'number') {
    yield `<${pKey}>`;
    yield `${elm}\n`;
  }

}

function *makeOfxItr(ofxInfo) {

  yield* makeHeaderItr(ofxInfo.header);
  if (ofxInfo.separater) {
    yield ofxInfo.separater;
  }
  yield* makeBodyItr('OFX', ofxInfo.body);

}

function makeOfxStream(ofxInfo) {
  return streamUtil.itrToRStrm(makeOfxItr(ofxInfo));
}

module.exports = {
  makeOfxItr,
  makeOfxStream,
};
