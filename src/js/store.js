import {writable, derived} from 'svelte/store'
import time from './time.js'

const defaultVal = {
  startTime: '09:00',
  endTime: '18:00',
  divTime: 15,
  selection: [
    {index: 1, val: 'Isaac Newton'},
    {index: 5, val: 'Galileo Galilei'}
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
    minimumRows: 3
  }
}

export const startTime = writable(defaultVal.startTime)
export const endTime = writable(defaultVal.endTime)
export const divTime = writable(defaultVal.divTime)
export const selection = writable(defaultVal.selection)
export const option = writable(defaultVal.option)

export const showTotal = derived(option, $option => {
  return $option.showTotal === false ? false : defaultVal.option.showTotal
})

export const minimumRows = derived(
  option,
  $option => $option.minimumRows || defaultVal.option.minumumRows
)

// Time passes 00:00
export const over24 = derived(
  [startTime, endTime],
  ([$startTime, $endTime]) => {
    return time.getHour($startTime) > time.getHour($endTime)
  }
)

// Time to show in header
export const headerTimes = derived(
  [startTime, endTime, over24],
  ([$startTime, $endTime, $over24]) => {
    let [start, end] = [
      time.getHour($startTime),
      $over24 ? time.getHour($endTime) + 24 : time.getHour($endTime)
    ]
    // Header array
    let timeArray = Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx)
    // To String and set it to Double digit
    if ($over24) {
      timeArray = timeArray.map(x => util.toDoubleDigit(x < 24 ? x : x - 24))
    }
    // Add minute
    timeArray = timeArray.map(x => `${x}:00`)

    return timeArray
  }
)
