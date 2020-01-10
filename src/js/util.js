// Utility Methods
const util = {
  // convert and returns the value as intended data type
  // return undefined if the data is not correct
  convVal: (val, type) => {
    if (typeof val === type) return val
    const convert = {
      number: val => (isNaN(val) ? undefined : parseInt(val)),
      boolean: val => (val.toLowerCase() === 'false' ? false : !!val)
    }

    try {
      return convert[type](val)
    } catch {
      return undefined
    }
  },
  toDoubleDigit: num => {
    let str = num.toString()
    return str.length === 1 ? `0${str}` : str
  }
}

export default util
