# TimeTable.js
![NOTE_ICON](img/note.png)  
  
![demo](https://raw.github.com/wiki/yn1323/TimeTable.js/TimeTable01.gif)


## About
JavaScript (ES2015) library for creating time table.  
Requires jQuery 1.9.1+, CreateJS 1.0.0.

## Supporting Browser
- Chrome

## Demo
[Introdoction](https://www.jqueryscript.net/time-clock/JSON-Canvas-Time-Table-Generator.html)  
[Demo](https://yn1323.github.io/TimeTable.js/)

## How to Use
   1. Load TimeTable.js, TimeTable.css, and jQuery in html.
      ```html
      <link rel="stylesheet" href="./TimeTable.css"/>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.1/jquery.min.js"></script>
      <script src="https://code.createjs.com/1.0.0/createjs.min.js"></script>
      <script src="./TimeTable.js"></script>
      ```
   2. Add division and class where you want to create Time Table.
      ```html
      <div id="timetable"></div>
      ```
   3. Create object to draw in TimeTable.js
      ```js
      var Object = new TimeTable({
          // Beginning Time[Necessary]
          startTime: "10:00",
          // Ending Time[Necessary]
          endTime: "15:00",
          // Time to divide(minute)[Necessary]
          divTime: "15",
          // Time Table Data[Necessary]
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
              // Default value: "NAME"
              firstColumnCaption: "Scholar"
              // Display Total Time
              worktime: true,
              // Bar Color
              // Able to apply till 10 colors
              bgcolor: ["#00ffff","#ff0000"],
              // Selectbox for Name Column[Necessary]
              // selectBox index and shift index should be same
              //{index :  name, : index: name,,..}
              // Give random if shift index was not in selectBox index
              selectBox: {
                  "1": "Sir Isaac Newton",
                  "2": "Galileo Galilei",
                  "3": "Mr.Smith"
              },
              // Set false if you want the rows to be static i.e. as defined in your shift object
              deleteRows: true,
              // Set true when using TimeTable inside of BootStrap class row
              useBootstrap: false,
          }
      });
      ```
   4. Create Instance
      ```js
      // Set Object as class parameter
      var instance = new TimeTable(Object);
      ```
   5. Start create TimeTable
      ```js
      // Parameter is the selector where Time Table append
      instance.init("#timetable");
      ```
   6. Please refer sample of index.html

## Author
yn1323

## License
TimeTable.js is licensed under MIT
