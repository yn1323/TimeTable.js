<script>
  import {
    option,
    startTime,
    endTime,
    divTime,
    headerTimes,
    showTotal
  } from '../js/store'
  import util from '../js/util'
  import time from '../js/time'

  const firstColumnCaption = $option.firstColumnCaption || 'Name'
</script>

<div class="tt-row tt-header">
  <!-- First Column -->
  <div class="tt-name">{firstColumnCaption}</div>

  <!-- Time -->
  {#each $headerTimes as headerTime}
    <div>{headerTime}</div>
  {/each}

  <!-- Total -->
  {#if $showTotal}
    <div class="tt-subtotal">Total</div>
  {/if}
</div>
