/*eslint-env node */
/*eslint no-await-in-loop: 0 */
'use strict';

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
};
