# TimeTable.js
![NOTE_ICON](img/note.png)
## About
JavaScript (ES6) library for creating time table.

## How to Use
   1. Load TimeTable.js in html.
      ```html
      <script src="./TimeTable.js"></script>
      ```
   1. Add division and class where you want to create Time Table.
      ```html
      <div class="timetable"></div>
      ```
   1. Create Instance of TimeTable.js
      ```js
      var test = new TimeTable({
          // Beginning Time
          startTime: '10:00',
          // Ending Time
          endTime: '23:00',
          // Time to divide(minute)
          divTime: '15',
          // Time Table
          shift: {
              'Sir Isaac Newton': '10:00-23:00',
              'Galileo Galilei' : '11:00-12:45'
          },
          // Other options
          option: {
              worktime: true,
              bgcolor: '#abc'
          }
      });
      ```

## Parameter & Options

### Author
YN1323

### License
TimeTable.js is licensed under MIT License.