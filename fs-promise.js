/*eslint-env node */
/*eslint no-await-in-loop: 0 */

const fs = require('fs');

module.exports = {
  samplePromise(flag) {
    return new Promise((resolve, reject)=>{
      if (flag) {
        resolve('OK');
      } else {
        reject(new Error('ERROR'));
      }
    });
  },

  stat(path) {
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
  readdir(path, option) {
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
  genFolder(path) {
    return path;
  }
};
