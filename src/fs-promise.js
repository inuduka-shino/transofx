/*eslint-env node */

const fs = require('fs'),
      fsExtra = require('fs-extra'),
      promisify = require('es6-promisify');

const ifObj = {};

//fs method promisify
((ifObj) => {
  const newIfObj = ifObj;

  [
    'stat',
    'readdir',
    'writeFile',
  ].forEach((name)=>{
    const newName = name + 'Promise';

    newIfObj[newName] = promisify(fs[name]);
  });
})(ifObj);

//fs-extra method promisify
((ifObj) => {
  const newIfObj = {};

  ifObj.extra = newIfObj;
  [
    'remove',
    'emptydir',
    'mkdirs',
  ].forEach((name)=>{
    const newName = name + 'Promise';

    newIfObj[newName] = promisify(fsExtra[name]);
  });
})(ifObj);

ifObj.samplePromise = function (flag) {
    return new Promise((resolve, reject)=>{
      if (flag) {
        resolve('OK');
      } else {
        reject(new Error('ERROR'));
      }
    });
  };

module.exports = ifObj;

/*resove comma-dangle
stat_x(path) {
  return new Promise((resolve, reject)=>{
      fs.stat(path, (err, stat)=>{
        if (err) {
          reject(err);
        } else {
          resolve(stat);
        }
      });
    });
},
readdir_x(path, option) {
  return new Promise((resolve, reject)=>{
      fs.readdir(path, option, (err, files)=>{
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
},
{
  statPromise: promisify(fs.stat),
  readdirPromise: promisify(fs.readdir),
};
*/
