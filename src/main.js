import App from './svelte/App.svelte'
import './scss/main.scss'
import valid from './js/validation.js'

window.TimeTable = (selector, obj = {}) => {
  // check necessary parameter
  try {
    let e = valid.initialParamCheck(selector, obj)
    if (e) throw e
  } catch (e) {
    console.error(e)
    // intial object when obj is not proper
    obj = {
      startTime: '09:00',
      endTime: '18:00',
      divTime: '15',
      selection: [
        {index: 1, val: 'Isaac Newton'},
        {index: 5, val: 'Galileo Galilei'}
      ]
    }
  }

  let exec = () =>
    new App({
      target: selector,
      props: {
        data: obj
      }
    })
  // Do nothing in Error
  return valid.checkAll(obj) ? exec() : false
}
