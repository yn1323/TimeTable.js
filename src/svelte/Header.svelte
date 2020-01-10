<script>
  import {option, startTime, endTime, divTime, over24} from '../js/store.js'
  import util from '../js/util.js'
  import time from '../js/time.js'

  const firstColumnCaption = $option.firstColumnCaption || 'Name'

  let [start, end] = [
    time.getHour($startTime),
    $over24 ? time.getHour($endTime) + 24 : time.getHour($endTime)
  ]
  // Header array
  let headerTimes = Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx)
  // To String and set it to Double digit
  if ($over24) {
    headerTimes = headerTimes.map(x => util.toDoubleDigit(x < 24 ? x : x - 24))
  }
  // Add minute
  headerTimes = headerTimes.map(x => `${x}:00`)

  const showTotal = $option.showTotal || true
</script>

<div class="tt-row tt-header">
  <!-- First Column -->
  <div class="tt-name">{firstColumnCaption}</div>

  <!-- Time -->
  {#each headerTimes as headerTime}
    <div>{headerTime}</div>
  {/each}

  <!-- Total -->
  {#if showTotal}
    <div class="tt-subtotal">Total</div>
  {/if}
</div>
