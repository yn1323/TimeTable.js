import valid from '../src/js/validation'
import msg from '../src/js/msg'

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
  `('$a => $expected', ({ a, expected }) => {
    expect(valid.isTimeFormat(a)).toBe(expected);
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