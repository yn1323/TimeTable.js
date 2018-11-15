# TimeTable.js
![NOTE_ICON](img/note.png)  
  
![demo](https://raw.github.com/wiki/yn1323/TimeTable.js/TimeTable01.gif)


## About
JavaScript (ES6) library for creating time table.
It worked jQuery 1.4.1+. 

## Demo
[Introdoction](https://www.jqueryscript.net/time-clock/JSON-Canvas-Time-Table-Generator.html)  
[Demo](https://www.jqueryscript.net/demo/JSON-Canvas-Time-Table-Generator/)

## How to Use
   1. Load TimeTable.js, TimeTable.css, and jQuery in html.
      ```html
      <link rel="stylesheet" href="./TimeTable.css"/>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.1/jquery.min.js"></script>
      <script src="https://code.createjs.com/1.0.0/createjs.min.js"></script>
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
              },
              // Set true when using TimeTable inside of BootStrap class row
              useBootstrap: "false",
          }
      });
      ```

### Author
yn1323

### License
TimeTable.js is licensed under MIT