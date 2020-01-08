import msg from './msg.js'
import util from './util.js'
// Validation Methods
const validation = {
  // Check all parameters
  checkAll: obj => {
    const target = [
      () => validation.isTimeFormat(obj.startTime),
      () => validation.isTimeFormat(obj.endTime),
      () => validation.isDivTimeFormat(obj.divTime),
    ];
    try{
      target.forEach(check => {
        let result = check()
        if(result) throw result;
      });
    }catch(e){
      console.error(e)
      return false;
    }
    return true;
  },
  checkLength: (str, len) => str.length === len,
  // index starts from 0
  checkDelimeter: (str, index, delim) => str[index] === delim,
  isTimeFormat: str => {
    // OK: '09:00', NG: '9:00'
    if (!validation.checkLength(str, 5))return msg.TIME_FORMAT;
    // OK: '09:00', NG: '09-00'
    if (!validation.checkDelimeter(str, 2, ':')) return msg.TIME_DELIMETER;
  },
  isTimeTermFormat: str => {},
  isDivTimeFormat: str => {
    let num = util.convVal(str, 'number');
    if (!Number.isInteger(60 / num)) return msg.TIME_DIV_RANGE;
  }
}

export default validation
