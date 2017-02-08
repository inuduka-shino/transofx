/*eslint-env node */

const streamUtil = require('./streamUtil');

function *makeHeaderItr(headerObj) {
const ofxHeaders = [
  //'OFXHEADER',
  // 'DATA', 'VERSION', 'SECURITY', 'ENCODING', 'CHARSET',
  //'COMPRESSION', 'OLDFILEUID', 'NEWFILEUID'
  'testHeader0', 'testHeader1',
];

for (const name of ofxHeaders) {
  yield name.toUpperCase() + ':' + headerObj[name] + '\n';
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
if (typeofElm === 'object') {
  return 'object';
}
throw new Error(`unkown Struct Elemnt Type:${typeofElm}`);
}

function *makeBodyItr(pKey, elm) {
const elmType = checkType(elm);

  if (elmType === 'object') {
    yield `<${pKey}>\n`;
    for (const key of Reflect.ownKeys(elm)) {
      yield* makeBodyItr(key, elm[key]);
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
  yield '\n';
  yield* makeBodyItr('root', ofxInfo.body);

}

function makeOfxStream(ofxInfo) {
  return streamUtil.itrToRStrm(makeOfxItr(ofxInfo));
}

module.exports = {
  makeOfxItr,
  makeOfxStream,
};
