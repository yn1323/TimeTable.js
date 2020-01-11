<script>
  import {
    divTime,
    headerTimes,
    option,
    showTotal,
    minimumRows
  } from '../js/store'
  const rowInCell = 3
  const cellInHour = 60 / $divTime
</script>

{#each Array($minimumRows) as _}
  <div class="tt-row tt-data">

    <!-- First column -->
    <div class="tt-name">NAME1</div>

    <!-- Cell in each Hour -->
    {#each $headerTimes as cell}
      <div class="tt-cell">
        {#each Array(cellInHour) as _}
          <div>
            <!-- Hidden div in each cell -->
            {#each Array(rowInCell) as _}
              <div />
            {/each}
          </div>
        {/each}
      </div>
    {/each}

    <!-- Total Cell -->
    {#if $showTotal}
      <div class="tt-subtotal" />
    {/if}
    <div class="tt-time">for mobile</div>
  </div>
{/each}
