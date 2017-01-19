/*eslint-env node */
/*eslint no-await-in-loop: 0, consistent-this: 0, no-invalid-this:0 */
/*eslint func-names: 0 */

//ref : https://www.promisejs.org/api/
module.exports = {
  denodeify(fn, argumentCount0) {
    const argumentCount = argumentCount0 || Infinity;

    return function () {
      const self = this;
      const args = Array.prototype.slice.call(arguments);

      return new Promise((resolve, reject) => {
        while (args.length && args.length > argumentCount) {
          args.pop();
        }
        args.push((err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });

        const res = fn.apply(self, args);
        if (res &&
          (
            typeof res === 'object' ||
            typeof res === 'function'
          ) &&
          typeof res.then === 'function'
        ) {
          resolve(res);
        }
      });
    };
  }
};
