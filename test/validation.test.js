import valid from '../src/js/validation'
import msg from '../src/js/msg'

describe('initialParamCheck()', () => {
  test.each`
    a        | b        | expected
    ${'str'} | ${{}}    | ${msg.PARAM_ERROR_TYPE}
    ${{}}    | ${'str'} | ${msg.PARAM_ERROR_TYPE}
    ${null}  | ${{}}    | ${msg.PARAM_ERROR_NOTFOUND}
    ${{}}    | ${{}}    | ${msg.PARAM_ERROR_COUNT}
    ${{}}    | ${{ 'a': 1, 'b': 2, 'c': 3 }}            | ${msg.PARAM_ERROR_COUNT}
    ${{}}    | ${{ 'a': 1, 'b': 2, 'c': 3, 'd': 4 }}    | ${undefined}
  `('$a, $b => $expected', ({ a, b, expected }) => {
    expect(valid.initialParamCheck(a, b)).toBe(expected);
  });
});

describe('checkLength()', ()=>{
  test.each`
    a                | b     | expected
    ${'09:00'}       | ${5}  | ${true}
    ${'9:00'}        | ${5}  | ${false}
    ${'09:00-18:00'} | ${11} | ${true}
    ${'09:0018:00'}  | ${11} | ${false}
  `('$a, $b => $expected', ({ a, b, expected }) => {
    expect(valid.checkLength(a, b)).toBe(expected);
  });  
});

describe('checkDelimeter()', () => {
  test.each`
    a                | b    | c      | expected
    ${'09:00'}       | ${2} | ${':'} | ${true}
    ${'09-00'}       | ${2} | ${':'} | ${false}
    ${'09:00-18:00'} | ${5} | ${'-'} | ${true}
    ${'09:00=18:00'} | ${5} | ${'-'} | ${false}
  `('$a, $b, $c => $expected', ({ a, b, c, expected }) => {
    expect(valid.checkDelimeter(a, b, c)).toBe(expected);
  });
});

describe('isTimeFormat()', () => {
  test.each`
    a          | expected
    ${'09:00'} | ${undefined}
    ${'9:00'}  | ${msg.TIME_FORMAT}
    ${'09-00'} | ${msg.TIME_DELIMETER}
    ${'09:01'} | ${msg.TIME_MINUTE_EXACT('00')}
  `('$a => $expected', ({ a, expected }) => {
    expect(valid.isTimeFormat(a)).toBe(expected);
  });
});

describe('isMinuteDividable()', () => {
  test.each`
    a       | b     | expected
    ${'00'} | ${0}  | ${true}
    ${0}    | ${0}  | ${true}
    ${'30'} | ${15} | ${true}
    ${20}   | ${40} | ${false}
    ${51}   | ${3}  | ${true}
  `('$a, $b => $expected', ({ a, b, expected }) => {
    expect(valid.isMinuteDividable(a, b)).toBe(expected);
  });
});

describe('isDivTimeFormat()', () => {
  test.each`
    a       | expected
    ${'15'} | ${undefined}
    ${15}   | ${undefined}
    ${0}    | ${msg.TIME_DIV_RANGE}
    ${1}    | ${undefined}
    ${60}   | ${undefined}
    ${'11'} | ${msg.TIME_DIV_RANGE}
    ${11}   | ${msg.TIME_DIV_RANGE}
    ${true} | ${msg.TIME_DIV_RANGE}
    ${[11]} | ${msg.TIME_DIV_RANGE}
  `('$a => $expected', ({ a, expected }) => {
    expect(valid.isDivTimeFormat(a)).toBe(expected);
  });
});

describe('isSelectionFormat()', () => {
  test.each`
    a                                        | expected
    ${[{ index: 10, val: 'isaac Newton' }]}  | ${undefined}
    ${'str'}                                 | ${msg.DATA_TYPE('str', 'Array')}
    ${[{ index: 'a', val: 'isaac Newton' }]} | ${msg.DATA_TYPE('a', 'number')}
    ${[{ val: 'isaac Newton' }]}             | ${msg.NOT_FOUND('selection[n].index')}
    ${[{ index: 10, val: 500 }]}             | ${msg.DATA_TYPE(500, 'string')}
    ${[{ index: 10 }]}                       | ${msg.NOT_FOUND('selection[n].val')}
  `('$a => $expected', ({ a, expected }) => {
    expect(valid.isSelectionFormat(a)).toBe(expected);
  });
});