import util from '../src/js/util'

describe('convVal()', () => {
  test.each`
    a          | b            | expected
    ${0}       | ${'number'}  | ${0}
    ${-1}      | ${'number'}  | ${-1}
    ${500}     | ${'number'}  | ${500}
    ${'500A'}  | ${'number'}  | ${undefined}
    ${true}    | ${'number'}  | ${NaN}
    ${0}       | ${'boolean'} | ${undefined}
    ${-1}      | ${'boolean'} | ${undefined}
    ${500}     | ${'boolean'} | ${undefined}
    ${'500A'}  | ${'boolean'} | ${true}
    ${true}    | ${'boolean'} | ${true}
    ${false}   | ${'boolean'} | ${false}
    ${'true'}  | ${'boolean'} | ${true}
    ${'false'} | ${'boolean'} | ${false}
  `('$a, $b => $expected', ({ a, b, expected }) => {
    expect(util.convVal(a,b)).toBe(expected);
  });
});

describe('toDoubleDigit()', () => {
  test.each`
    a      | expected
    ${0}   | ${'00'}
    ${5}   | ${'05'}
    ${10}  | ${'10'}
    ${123} | ${'123'}
  `('$a => $expected', ({ a, expected }) => {
    expect(util.toDoubleDigit(a)).toBe(expected);
  });
});