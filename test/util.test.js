import util from '../src/js/util'

describe('convVal', ()=>{
  test('number', () => {
    expect(util.convVal(0, 'number')).toBe(0)
    expect(util.convVal(-1, 'number')).toBe(-1)
    expect(util.convVal(500, 'number')).toBe(500)
    expect(util.convVal('500A', 'number')).toBeUndefined()
    // Exception pattern
    expect(util.convVal(true, 'number')).toBeNaN()
  })
  test('boolean', () => {
    expect(util.convVal(0, 'boolean')).toBeUndefined()
    expect(util.convVal(-1, 'boolean')).toBeUndefined()
    expect(util.convVal(500, 'boolean')).toBeUndefined()
    expect(util.convVal('500A', 'boolean')).toBeTruthy()
    expect(util.convVal(true, 'boolean')).toBeTruthy()
    expect(util.convVal(false, 'boolean')).toBeFalsy()
    expect(util.convVal('true', 'boolean')).toBeTruthy()
    expect(util.convVal('false', 'boolean')).toBeFalsy()
  })
})