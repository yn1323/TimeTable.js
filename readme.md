# TimeTable.js
![NOTE_ICON](img/note.png)
## About
JavaScript (ES6) library for creating time table.
It worked jQuery 1.4.1+. 

## How to Use
   1. Load TimeTable.js, TimeTable.css, and jQuery in html.
      ```html
      <link rel="stylesheet" href="./TimeTable.css"/>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.1/jquery.min.js"></script>
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
          startTime: "10:00",
          // Ending Time
          endTime: "23:00",
          // Time to divide(minute)
          divTime: "15",
          // Time Table
          shift: {
              "1" : {
                "Sir Isaac Newton": {
                    "1" : "10:00-12:00",
                    "2" : "13:00-14:00"
                }
              },
              "2" : {
                  "Galileo Galilei": {
                      "3" : "11:00-12:45"
                  }
              }
          },
          // Other options
          option: {
              worktime: "true",
              bgcolor: "#abc",
              selectBox: {
                  "1": "Sir Isaac Newton",
                  "2": "Galileo Galilei",
                  "3": "Mr.Smith"
              }
          }
      });
      ```

## Parameter & Options

### Author
YN1323

### License
TimeTable.js is licensed under MIT