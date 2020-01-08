import valid from '../src/js/validation'
import msg from '../src/js/msg'

describe('/src/js/validation', ()=>{
  test('checkLength()', ()=>{
    const plan = [
      { p1: '09:00', p2: 5, e: true },
      { p1: '9:00', p2: 5, e: false },
      { p1: '09:00-18:00', p2: 11, e: true },
      { p1: '09:0018:00', p2: 11, e: false },
    ]
    plan.forEach(t => expect(valid.checkLength(t.p1, t.p2)).toBe(t.e))
  });
  test('checkDelimeter()', () => {
    const plan = [
      { p1: '09:00', p2: 2, p3: ':', e: true },
      { p1: '09-00', p2: 2, p3: ':', e: false },
      { p1: '09:00-18:00', p2: 5, p3: '-', e: true },
      { p1: '09:00=18:00', p2: 5, p3: '-', e: false },
    ]
    plan.forEach(t => expect(valid.checkDelimeter(t.p1, t.p2,t.p3)).toBe(t.e))
  });
})