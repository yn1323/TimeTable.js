import time from '../src/js/time'

describe('getHour()', () => {
  test.each`
    a          | expected
    ${'00:00'} | ${0}
    ${'09:00'} | ${9}
    ${'23:00'} | ${23}
  `('$a => $expected', ({ a, expected }) => {
    expect(time.getHour(a)).toBe(expected);
  });
});