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

// Object to send to TimeTable method
let sample = {
  // Beginning Time[Necessary]
  startTime: '10:00',
  // Ending Time[Necessary]
  endTime: '15:00',
  // Time to divide(minute)[Necessary]
  divTime: '15',
  // Time Table Data[Necessary]
  shift: {
    '1': {
      'Sir Isaac Newton': {
        '1': '10:00-12:00',
        '2': '13:00-14:00'
      }
    },
    '2': {
      'Galileo Galilei': {
        '3': '11:00-12:45'
      }
    }
  },
  // Other options
  option: {
    // Default value: 'NAME'
    firstColumnCaption: 'Scholar',
    // Display Total Time
    worktime: true,
    // Bar Color
    // Able to apply till 10 colors
    // bgcolor: ['#00ffff', '#ff0000'],
    // Selectbox for Name Column[Necessary]
    // selectBox index and shift index should be same
    //{index :  name, : index: name,,..}
    // Give random if shift index was not in selectBox index
    selectBox: {
      '1': 'Sir Isaac Newton',
      '2': 'Galileo Galilei',
      '3': 'Mr.Smith'
    },
    // Set false if you want the rows to be static i.e. as defined in your shift object
    deleteRows: true
  }
}

TimeTable(document.getElementById('TimeTable'), sample)
