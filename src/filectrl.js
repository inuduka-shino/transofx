/*eslint-env node */
/*eslint no-await-in-loop: 0 */
'use strict';
const fs = require('fs');

module.exports = {
  sample_promise(flag) {
    return new Promise((resolve, reject)=>{
      if (flag) {
        resolve('OK');
      } else {
        reject(new Error('ERROR'));
      }
    });
  },

  fsstat(path) {
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
