/*eslint-env node, mocha */

const {expect} = require('chai'), //eslint-disable-line object-curly-newline
      commonUtility = require('../src/commonUtility');

describe('arrayで初期化',() => {
  const $ = commonUtility.makeOrderedDict;

  it('基本', () => {
    const val = $(
      ['A', 'a'],
      ['B', 'b'],
      ['C', 99]
    );

    expect(val).is.instanceof(commonUtility.OrderedDict);
    expect(val.A).is.equal('a');
    expect(val.B).is.equal('b');
    expect(val.C).is.equal(99);
  });

  it('メンバ名不正', () => {
    expect($.bind(null,
      ['A.A', 'a']
    )).throw(Error, /bad property name:/);

  });

  it('再帰', () => {
    const val = $(
        ['Arr', [1, 2, 3]],
        ['Obj', {
          m: 'M'
        }],
        ['ODict', $(
          ['r', 'R']
        )]
      );

    expect(val).is.a('Object');
    expect(val.Arr).is.deep.equal([1,2,3]);
    expect(val.ODict.r).is.equal('R');
  });

  it('set', () => {
    const inst = $(
        ['a', 'A'],
        ['b', $(
          ['bb', 'B']
        )]
      );

    inst.a = 'AA';
    inst.b.bb = 'BB';
    expect(inst).is.a('Object');
    expect(inst.a).is.equal('AA');
    expect(inst.b.bb).is.equal('BB');
  });

  it('loop', () => {
    const sampleData = [
              ['a', 'A'],
              ['b', 'B'],
              ['c', 'C']
            ],
            inst = $(
              ['a', 'A'],
              ['b', 'B'],
              ['c', 'C']
            );
    let count = 0;

    for (const key of Object.keys(inst)) {
      expect(inst[key]).is.equal(sampleData[count][1]);
      count += 1;
    }
    expect(count).is.equal(3);
  });

  it('loop of', () => {
    const sampleData = [
              ['a', 'A'],
              ['b', 'B'],
              ['c', 'C']
            ],
            inst = $(
              ['a', 'A'],
              ['b', 'B'],
              ['c', 'C']
            );
    let count = 0;

    for (const tuple of inst) {
      expect(tuple).is.deep.equal(sampleData[count]);
      count += 1;
    }
    expect(count).is.equal(3);
  });

});
