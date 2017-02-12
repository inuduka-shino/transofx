/*eslint-env node */

function checkMemberName(name) {
  return name.indexOf('.') < 0;
}

class OrderedDict {
  //pass
}

function makeOrderedDict(...initList) {
  const m = new Map(initList),
        inst = new OrderedDict();

  inst[Symbol.iterator] = function() {
    return m[Symbol.iterator]();
  };
  for (const [key] of initList) {
    if (!checkMemberName(key)) {
      throw new Error(`bad property name:[${key}]`);
    }
    Reflect.defineProperty(inst, key, {
       get () {
         return m.get(key);
       },
       set (val) {
         m.set(key, val);
       },
       enumerable: true
    });
  }

  return inst;
}
module.exports = {
                  makeOrderedDict,
                  OrderedDict
                };
