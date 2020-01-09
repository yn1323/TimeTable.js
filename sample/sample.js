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
  divTime: 15,
  // Value to bind to index[Necessary]
  selection: [
    { index: 1, val: 'Isaac Newton' },
    { index: 5, val: 'Galileo Galilei' }
  ],
  // Time Table Data of initially show[optional]
  timetable: [
    {
      // index number of row
      index: 1,
      time: [
        // color: color of bar
        // time: time to color
        { color: 1, time: '10:00-12:00' },
        { color: 2, time: '13:00-14:00' }
      ]
    },
    {
      index: 5,
      time: [
        { color: 3, time: '11:00-12:45' },
        { color: 2, time: '13:00-14:00' }
      ]
    }
  ],
  // Options[optional]
  option: {
    // First column header(Defaul is Name)
    firstColumnCaption: 'Name',
    // Show total time columns(Default is true)
    showTotal: true,
    // Enable to delete row(Default is true)
    deleteRows: true,
    // Minumum rows to show(Default is 3)
    minimumRows: 3,
  }
}

TimeTable(document.getElementById('TimeTable'), sample)
