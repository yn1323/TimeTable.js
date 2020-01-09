import msg from './msg.js'
import util from './util.js'
// Validation Methods
const validation = {
  // Param check of call TimeTable()
  initialParamCheck: (selector, obj) => {
    if (typeof selector !== 'object' || typeof obj !== 'object') return msg.PARAM_ERROR_TYPE
    if (!selector) return msg.PARAM_ERROR_NOTFOUND
    if (Object.keys(obj).length < 4) return msg.PARAM_ERROR_COUNT
  },
  // Check all parameters to draw table
  checkAll: obj => {
    const target = [
      () => validation.isTimeFormat(obj.startTime),
      () => validation.isTimeFormat(obj.endTime),
      () => validation.isDivTimeFormat(obj.divTime),
      () => validation.isSelectionFormat(obj.selection)
    ]
    try {
      target.forEach(check => {
        let result = check()
        if (result) throw result
      })
    } catch (e) {
      console.error(e)
      return false
    }
    return true
  },
  checkLength: (str, len) => str.length === len,
  // index starts from 0
  checkDelimeter: (str, index, delim) => str[index] === delim,
  isTimeFormat: str => {
    // OK: '09:00', NG: '9:00'
    if (!validation.checkLength(str, 5)) return msg.TIME_FORMAT
    // OK: '09:00', NG: '09-00'
    if (!validation.checkDelimeter(str, 2, ':')) return msg.TIME_DELIMETER
  },
  isTimeTermFormat: str => {},
  isDivTimeFormat: str => {
    let num = util.convVal(str, 'number')
    if (!Number.isInteger(60 / num)) return msg.TIME_DIV_RANGE
  },
  isSelectionFormat: arr => {
    if(!Array.isArray(arr)) return msg.DATA_TYPE(arr, 'Array')

    for(let i = 0, len = arr.length; i < len; i++){
      let obj = arr[i];
      if (!obj.index) return msg.NOT_FOUND('selection[n].index')
      if (!Number.isInteger(obj.index)) return msg.DATA_TYPE(obj.index, 'number')
      if (!obj.val) return msg.NOT_FOUND('selection[n].val')
      if (typeof obj.val !== 'string') return msg.DATA_TYPE(obj.val, 'string')
    }
    
  }
}

export default validation
