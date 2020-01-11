<script>
  export let data
  import {startTime, endTime, divTime, selection, option} from '../js/store'
  import Header from './Header'
  import Body from './Body'
  // Set initial store
  startTime.set(data.startTime)
  endTime.set(data.endTime)
  divTime.set(data.divTime)
  selection.set(data.selection)
  option.set(data.option)
</script>

<div class="timetable">
  <Header />
  <Body />
</div>
