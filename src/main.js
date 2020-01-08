import App from './svelte/App.svelte'
import './scss/main.scss'

window.TimeTable = obj =>
  new App({
    target: document.body,
    props: {
      name: obj
    }
  })
