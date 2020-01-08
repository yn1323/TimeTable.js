import App from './svelte/App.svelte'
import './scss/main.scss'
import valid from './js/validation.js'

window.TimeTable = (selector, obj = {}) => {
  // Add default value
  if(!obj.keys){
    obj = {
      startTime: '09:00',
      endTime: '18:00',
      divTime: '15',
    }
  }
  let exec = () => new App({
    target: selector,
    props: {
      info: obj
    }
  })
  // Do nothing in Error
  return valid.checkAll(obj)? exec(): false
}
  
