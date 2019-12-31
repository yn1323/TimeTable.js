import '../scss/main.scss'

// Debug
if (process.env.NODE_ENV === 'development') {
  const DEBUGS = document.querySelectorAll('[id^=debug]')
  const METHODS = {
    debug1: () => console.log('debug1'),
    debug2: () => console.log('debug2')
  }
  DEBUGS.forEach(elem => {
    elem.addEventListener('click', () => {
      METHODS[elem.id]()
    })
  })
}
