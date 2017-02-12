/*eslint-env node, mocha */

const {expect} = require('chai'); //eslint-disable-line object-curly-newline

function checkMemberName(name) {
  return name.indexof('.') < 0;
}

function makeOrderdDict(init_list) {
  const m = new Map(init_list);
  return {
    get A () {
      return m.get('A');
    },
    get B () {
      return m.get('B');
    }
  }
}
describe('arrayで初期化',() => {
  it('基本', () => {
    const val = makeOrderedDict([
      ['A', 'a'],
      ['B', 'b'],
    ]);
    expect(val.A).is.equal('a');
    expect(val.B).is.equal('b');
  });

})
