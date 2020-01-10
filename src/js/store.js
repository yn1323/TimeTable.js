import {writable, derived} from 'svelte/store'
import time from './time.js'

export const startTime = writable('09:00')
export const endTime = writable('18:00')
export const divTime = writable('09:00')
export const selection = writable([])
export const option = writable({})

export const over24 = derived(
  [startTime, endTime],
  ([$startTime, $endTime]) => {
    return time.getHour($startTime) > time.getHour($endTime)
  }
)
