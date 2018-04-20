"use strict";
// Main class for TimeTable.js
class TimeTable{    // eslint-disable-line no-unused-vars
    constructor(data){
        // Flag for when this instance got error
        this.errFlg = true;
        this.v = new Validation(data);
        this.c = new Calculation();
        this.u = new Utils();
        // End if necessary parameter was missing
        if(!this.v.checkExistance())return false;
        this.startTime  = data["startTime"]; // Beginning Time
        this.endTime    = data["endTime"];   // Endint Time
        this.divTime    = data["divTime"];   // Unit to Divide time(minutes)
        this.shiftTime  = data["shift"];     // Time Table Data
        this.option     = data["option"];     // Other option
        // For final check of values
        let arr = [
            this.startTime,
            this.endTime,
            this.divTime,
            this.shiftTime,
            this.option
        ];
        // End if there was error in any parameter
        if(!this.v.checkUndefinedArray(arr)){
            // Error Flag for when this NEW has been failed.
            this.errFlg = false;
            return false;
        }
    }
    get startTime() {return this.START_TIME;}
    set startTime(x){if(this.v.checkStartTime(x)) this.START_TIME = this.v.checkStartTime(x);}
    get endTime  () {return this.END_TIME;  }
    set endTime  (x){if(this.v.checkEndTime  (x)) this.END_TIME   = this.v.checkEndTime(x);  }
    get divTime  () {return this.DIV_TIME;  }
    set divTime  (x){if(this.v.checkDivTime  (x)) this.DIV_TIME   = this.v.checkDivTime(x);  }
    get shiftTime() {return this.SHIFT;     }
    set shiftTime(x){if(this.v.checkShiftTime(x)) this.SHIFT      = this.v.checkShiftTime(x);}
    get option   () {return this.OPTION;    }
    set option   (x){if(this.v.checkOption   (x)) this.OPTION     = this.v.checkOption(x);   }
    get selector () {return this.SELECTOR;  }
    set selector (x){this.SELECTOR = x;    }
    get coordinate () {return this.COORDINATE;  }
    set coordinate (x){this.COORDINATE = x;    }
    get table () {return this.TABLE;  }
    set table (x){this.TABLE = x;    }
    get selectbox () {return this.SELECTBOX;  }
    set selectbox (x){this.SELECTBOX = x;    }
    /*
    To generate TimeTable where class name is "TimeTable"
    @param  {selector} id : Selector has to be ID
    @return {boolean}  true  : No Error.
    false : Has Error.
    */
    init(sel){
        // Not to proceed process when there was error
        if(!this.errFlg)return false;
        // Set as Constructor
        this.selector = sel;
        // Set Table
        this.createTable();
        // Set Coordinate for plotting bar
        this.debug(this.table);
        //this.setCoordinate();
        // Set Time to table
        this.appendTime();

        // Set options
        if(this.option["workTime"])this.setWorkTimeColumn();
    }
    /*
    Create Table for append document.
    */
    createTable(){
        let base = $("<table>",{class: "TimeTable",id: "TimeTable"});
        // Create Header
        base = this.createTableHeader(base);
        // Create Data
        base = this.createTableData(base);
        // Set 1st column(name)
        base = this.addFirstColumn(base);
        // Set canvas in table tag
        //let canvas = $("<canvas>",{class: "barCanvas", id: "barCanvas"});
        //base.prepend(canvas);
        this.table = base;
    }
    /*
    Create Table header for append document.
    @param   {dom} base : Only Table tag is included
    @reaturm {dom} base : Table tag and header tags are included
    */
    createTableHeader(base){
        let tr = $("<tr></tr>", {class: "theader", id: "theader"});
        // Always Header will be --:00.
        let colspan = 60 / this.divTime;
        // Column of Time(Name column is not included)
        const COLUMNS = this.c.countColumns(this.startTime, this.endTime, this.divTime);
        let startTime = this.startTime;
        // Create Table Header
        for(let i = 0; i < COLUMNS; i++){
            // Convert time
            let thTime = this.c.int2Time(startTime + i * this.divTime);
            // Skip if time is NOT --:00
            if((startTime + i * this.divTime) % 60 != 0){continue;}
            tr.append($(`<th colspan = ${colspan}>${thTime}</th>`));
        }
        base = base.append(tr);
        return base;
    }
    /*
    Create Table header for append document.
    @param {dom} base : Table tag include header
    @return {dom} base : Table tag include header and data
    */
    createTableData(base){
        const COLUMNS = this.c.countColumns(this.startTime, this.endTime, this.divTime);
        const NUMSHIFT = this.c.getNames(this.shiftTime).length;
        // Add as id
        const INDEX = this.c.getIndex(this.shiftTime);
        // Loop for number of shift(rows)
        for(let i = 0; i < NUMSHIFT; i++){
            // Loop for time cells(columns)
            let tr = $("<tr></tr>", {id: `name-${INDEX[i]}`, class: "js-tdata"});
            for(let j = 0; j < COLUMNS; j++){
                let timeAttr =  this.startTime + this.divTime * j;
                let td = $("<td></td>");
                // Set id for getting coordinate
                td.attr("id", `${i}-${j}`);
                td.attr("time", timeAttr);
                tr.append(td);
            }
            base.append(tr);
        }
        return base;
    }
    /*
    Add First Column
    @param {dom} base : Table tag include header and data
    @return {dom} base : Table tag include name column
    */
    addFirstColumn(base){
        const NAMES = this.c.getNames(this.shiftTime);
        // id for find
        const INDEX = this.c.getIndex(this.shiftTime);
        // Column of Header
        base.find("#theader").prepend("<th>NAME</th>");
        // Column of Data
        for(let i = 0; i < NAMES.length; i ++){
            let td = base.find(`#name-${INDEX[i]}`);
            let element = "";
            // Different whether select box option exist
            if(this.option["selectBox"]){
                // Required to create selecttag as string (Why?)
                let select = this.createSelectBox(INDEX[i],NAMES[i]);
                element = (`<td>${select}</td>`);
                //console.log(toString(this.selectbox));
            }else{
                element = (`<td>${NAMES[i]}</td>`);
            }
            td.prepend($(element));
        }
        return base;
    }
    /*
    Function to set coordinate of each td
    setCoordinate(){
        const COLUMNS = this.c.countColumns(this.startTime, this.endTime, this.divTime);
        const ROWS   = this.c.getNames(this.shiftTime).length;
        let coordinate = {};
        for(let i = 0; i < ROWS; i++){
            for(let j = 0; j < COLUMNS; j++){
                // Create ID
                let tdIndex = `${i}-${j}`;
                let tdCoordinate = $(`#${tdIndex}`).offset();
                coordinate[tdIndex] = tdCoordinate;
            }
        }
        this.coordinate = coordinate;
    }
    */
    /*
    Function to append time bar to created table
    */
    appendTime(){
        const canvas = new Canvas(this.option.bgcolor);
        let timeData = this.c.getIndexAndTime(this.shiftTime);
        let gen = this.u.colorTimeGenerator(timeData);
        for(;;){
            // Analyze object
            let [index,color,s,e] = gen.next().value;
            // End of generator
            if(!index)break;
            // Get id of dom which will plot start time and end time
            let [sId,eId] = this.u.searchNearestDom(index,s,e);
            // If there is no next element, the coordinate may be not proper.
            let over = false;
            if(!$(`#${eId}`).next().length){
                over = this.u.checkOver(e,eId);
            }
            // Draw Line
            canvas.drawLine(sId,eId,color,over);
        }
    }
    /**
     * setWorkTimeColumn - description
     */
    setWorkTimeColumn(){
        $("#theader").append("<th>合計時間</th>");
        $(".js-tdata").each((i,elem)=>{
            let time = this.c.getTotalShiftTime($(elem).attr("id"),this.shiftTime);
            $(elem).append(`<td>${time}</td>`);
        });
    }
    /**
     * createSelectBox -- Had to create as string to append select box
     * Give randome if shift index was not in selectBox index
     * TODO: Create Select box as dom
     * @return {str}  select box tags;
     */
    createSelectBox(index,name){
        let selectTag = "<select class=\"timeTableSelectbox\">";
        let str = "";
        let obj = this.option["selectBox"];
        let matchFlg = false;
        for(let i in obj){
            if(i !== index){
                str += `<option value="${i}">${obj[i]}</option>`;
            }else{
                // Even shift name and selectBox name did not match,
                // set shift name
                str += `<option value="${i}" selected>${name}</option>`;
                matchFlg = true;
            }
        }
        // Shift index did not match with selectBox index
        if(!matchFlg){
            str += `<option value="${index}" selected>${name}</option>`;
        }
        selectTag = selectTag + str + "</select>";
        return selectTag;
    }
    debug(str){
        $("#debug").append(str);
    }
}

// Class to manage messages
class Message{
    constructor(){
        // Messages for Error
        this.ermsg = {};
        this.setErrorMessage();
    }
    /*
    To set Error Message
    */
    setErrorMessage(){
        // About Time
        this.ermsg["TIME_LENGTH"]        = "[TIME] TIME LENGTH IS NOT 5. FORMAT HAS TO BE 'HH:MM'";
        this.ermsg["TIME_DELIMETER"]     = "[TIME] DELIMETER SHOULD BE ':' IN 3RD CHARACTER";
        this.ermsg["TIME_HOUR_RANGE"]    = "[TIME] HOUR HAS TO BE BETWEEN 00 to 23";
        this.ermsg["TIME_MINUTE_RANGE"]  = "[TIME] MINUTS HAS TO BE BETWEEN 00 to 59";
        this.ermsg["DIVTIME_RANGE"]      = "[TIME] DIV TIME HAS TO BE BETWEEN 1 to 60";
        this.ermsg["DIVTIME_RANGE2"]     = "[TIME] divTime HAS TO BE  1,2,3,5,6,10,12,15,20,30, or 60";
        // About Shift
        this.ermsg["SHIFT_LENGTH"]       = "[SHIFT] TIME LENGTH IS NOT 11. FORMAT HAS TO BE 'HH:MM-HH:MM'";
        this.ermsg["SHIFT_DELIMETER"]    = "[SHIFT] DELIMETER SHOULD BE '-' IN 6TH CHARACTER";
        this.ermsg["SHIFT_TIME"]         = "[SHIFT] TIME";
        this.ermsg["SHIFT_COLOR_LENGTH"] = "[TIME] TIME LENGTH IS NOT 1.";
        this.ermsg["SHIFT_COLOR_RANGE"]  = "[SHIFT] COLOR HAS TO BE BETWEEN 0 to 9";
        // About Data Type
        this.ermsg["STRING_DATA_TYPE"]  = "[DATA] HAS TO BE STRING";
        this.ermsg["NOT_NUMBER"]        = "[DATA] HAS TO BE NUMBER";
        this.ermsg["NOT_BOOLEAN"]       = "[DATA] HAS TO BE TRUE OR FALSE OF BOOLEAN";
        this.ermsg["NOT_COLOR_CODE"]    = "[DATA] COLOR CODE HAS TO BE # AND 0-F IN 3 OR 6 DIGITS";
        // Existance Error
        this.ermsg["NO_STARTTIME"]      = "[NO_DATE] startTime WAS NOT SET TO PARAMETER";
        this.ermsg["NO_ENDTIME"]        = "[NO_DATE] endTime WAS NOT SET TO PARAMETER";
        this.ermsg["NO_DIVTIME"]        = "[NO_DATE] divTime WAS NOT SET TO PARAMETER";
    }
}

// Class to check validations
class Validation extends Message{
    constructor(data){
        super();
        this.data = data;
        this.calc = new Calculation();
        this.START_TIME = 0;
        this.END_TIME   = 0;
        this.DIV_TIME   = 0;
    }
    /*
    Check Data Existance
    @return {boolean} true  : No Error.
    false : Has Error.
    */
    checkExistance(){
        // flag to detect error(true: No error, false: Has error)
        let flg = true;
        try{
            // Check existance of startTime
            if(this.data["startTime"] == null)throw new Error(this.ermsg["NO_STARTTIME"]);
            // Check existance of endTime
            if(this.data["endTime"] == null)  throw new Error(this.ermsg["NO_ENDTIME"]);
            // Check existance of endTime
            if(this.data["divTime"] == null)  throw new Error(this.ermsg["NO_DIVTIME"]);
        }catch(e){
            console.error(e);
            flg = false;
        }
        return flg;
    }
    /*
    Check starting time
    @param  {string} time :
    @return {number}      : Number converted into minutes
    */
    checkStartTime(time){
        // Validation
        if(!this.timeValidation(time))return 0;
        let intTime = this.calc.time2Int(time);
        // Only when required 24 hours time schedule
        if(this.data["startTime"] === this.data["endTime"]){
            intTime = 0;
        }
        this.START_TIME = intTime;
        return intTime;
    }
    /*
    Check ending time
    @param  {string} time :
    @return {number}      : Number converted into minute
    */
    checkEndTime(time){
        if(!this.timeValidation(time))return 0;
        let intTime = this.calc.time2Int(time);
        // Only when required 24 hours time schedule
        if(this.data["startTime"] === this.data["endTime"]){
            intTime = 0;
        }
        // When schedule needs to set after 00:00.
        if(this.START_TIME > intTime){
            // Add 24 hours converted as minute
            intTime += 1440;
        }
        this.END_TIME = intTime;
        return intTime;
    }
    /*
    Validation of DivTime
    @param  {string} divTime : Unit to create Time Table(Minute)
    @return {number} num     : Unit to create Time Table(Minute)
    */
    checkDivTime(divTime){
        if(!this.divTimeValidation(divTime))return 0;
        const intDivTime = parseInt(divTime,10);
        this.DIV_TIME = intDivTime;
        return intDivTime;
    }
    /*
    Validation of Shift
    @param  {obj} shift : shift object ({"name1":"12:00-18:00",...})
    @return {obj} shift : Unit to create Time Table(Minute)
    */
    checkShiftTime(shift){
        if(!this.shiftValidation(shift)    )return null;
        return shift;
    }
    /*
    Check Option
    @param  {obj} option : Option of instance parameter
    @return {obj} option : Add Default Value if there is no key
    */
    checkOption(option={}){
        // Set default value if there is no workTime option
        if(!option["workTime"])option["workTime"]   = false;
        // Set default value if there is no bgcolor option
        if(!option["selectBox"])option["selectBox"] = null;
        // Check each values;
        if(!this.optionValidation(option)    )return null;
        return option;
    }
    /*
    Check undefined in object
    @param  {array} arr     : All constructor in instance of class TimeTable.
    @return {boolean} true  : No Error.
    false : Has Error.
    */
    checkUndefinedArray(arr){
        let flg = true;
        const LEN = arr.length;
        for(let i = 0; i < LEN; i++){
            if(!arr[i]){
                flg = false;
                break;
            }
        }
        return flg;
    }
    /*
    Check format of time
    @param  {string}   time : Time (HH:MM)
    @return {boolean} true  : No Error.
    false : Has Error.
    */
    timeValidation(time){
        // flag to detect error(true: No error, false: Has error)
        let flg = true;
        try{
            // Data type check
            if(typeof(time) !== "string")throw new Error(this.ermsg["STRING_DATA_TYPE"]);
            // Lack or too much length
            if(time.length !== 5)throw new Error(this.ermsg["TIME_LENGTH"]);
            // Delimiter check
            if(time.substring(2,3) !== ":")throw new Error(this.ermsg["TIME_DELIMETER"]);
            const hour   = time.substring(0,2);
            const minute = time.substring(3,5);
            // Check whether hour and minute are number
            if(isNaN(hour)||isNaN(minute))throw new Error(this.ermsg["NOT_NUMBER"]);
            const intHour   = parseInt(hour,10);
            const intMinute = parseInt(minute,10);
            // Check Range of hour
            if(!(intHour >= 0 && intHour < 24))throw new Error(this.ermsg["TIME_HOUR_RANGE"]);
            // Check Range of minute
            if(!(intMinute >= 0 && intMinute < 60))throw new Error(this.ermsg["TIME_MINUTE_RANGE"]);
        }catch(e){
            console.error(e + " => " + time);
            flg = false;
        }
        return flg;
    }
    /*
    Check format of divTime
    @param  {string} divTime : Unit to create Time Table(Minute)
    @return {boolean} true  : No Error.
    false : Has Error.
    */
    divTimeValidation(divTime){
        let flg = true;
        try{
            // Data type check
            if(typeof(divTime) !== "string")throw new Error(this.ermsg["STRING_DATA_TYPE"]);
            // Check whether hour and minute are number
            if(isNaN(divTime))throw new Error(this.ermsg["NOT_NUMBER"]);
            // Check Range of minute
            const intDivTime = parseInt(divTime,10);
            if(!(intDivTime > 0 && intDivTime <= 60))throw new Error(this.ermsg["DIVTIME_RANGE"]);
            // divTime should be 1,2,3,5,6,10,12,15,20,30,60
            if(60 % divTime != 0)throw new Error(this.ermsg["DIVTIME_RANGE2"]);
        }catch(e){
            console.error(e + " => " + divTime);
            flg = false;
        }
        return flg;
    }
    /*
    Check JSON structure of shift
    @param  {obj}   shift   : Json format
    @return {boolean} true  : No Error.
    false : Has Error.
    */
    shiftValidation(shift){
        // flag to detect error(true: No error, false: Has error)
        let flg = true;
        // Declare here to display errored message in catch(e)
        let shiftColor = "";
        let shiftTime = "";
        try{
            // Check value in Jason
            // Access to Object rooted to Index Key
            for(let key in shift){
                let indexObj = shift[key];
                // Access to Object rooted to Name Key
                for(let name in indexObj){
                    let nameObj = indexObj[name];
                    // Access to Object rooted to Color Key
                    for(let i in nameObj){
                        let obj = nameObj[i];
                        // To fetch as String, made another loop
                        for(let color in obj){
                            let time = obj[color];
                            if(!this.shiftColorKeyValidation(color))throw new Error();
                            if(!this.shiftTimeValidation(time))     throw new Error();
                        }
                    }
                }
            }
        }catch(e){
            console.error(e + " => " + shiftColor + ":" + shiftTime);
            flg = false;
        }
        return flg;
    }
    /*
    Check JSON structure of color key in shift
    @param  {string}   color: Shoud be Number as String ("2")
    @return {boolean} true  : No Error.
    false : Has Error.
    */
    shiftColorKeyValidation(color){
        // flag to detect error(true: No error, false: Has error)
        let flg = true;
        // Declare here to display errored message in catch(e)
        try{
            // Data type check
            if(typeof(color) !== "string")throw new Error(this.ermsg["STRING_DATA_TYPE"]);
            // Lack or too much length
            if(color.length !== 1)throw new Error(this.ermsg["SHIFT_COLOR_LENGTH"]);
            // Check whether hour and minute are number
            if(isNaN(color))throw new Error(this.ermsg["NOT_NUMBER"]);
            // Check range
            const INTCOLOR = parseInt(color,10);
            if(!(INTCOLOR >= 0 && INTCOLOR <= 9)) throw new Error(this.ermsg["SHIFT_COLOR_RANGE"]);
        }catch(e){
            console.error(e + " => " + color);
            flg = false;
        }
        return flg;
    }
    /*
    Check format of shift
    @param  {string}  shift : Time (HH:MM-HH:MM)
    @return {boolean} true  : No Error.
    false : Has Error.
    */
    shiftTimeValidation(shift){
        // flag to detect error(true: No error, false: Has error)
        let flg = true;
        try{
            // Data type check
            if(typeof(shift) !== "string")throw new Error(this.ermsg["STRING_DATA_TYPE"]);
            // Lack or too much length
            if(shift.length !== 11)throw new Error(this.ermsg["SHIFT_LENGTH"]);
            // Delimiter check
            if(shift.substring(5,6) !== "-")throw new Error(this.ermsg["SHIFT_DELIMETER"]);
            // Check beginning & ending time format
            if(!this.timeValidation(shift.substring(0,5))) throw new Error(this.ermsg["SHIFT_TIME"]);
            if(!this.timeValidation(shift.substring(6,11)))throw new Error(this.ermsg["SHIFT_TIME"]);
        }catch(e){
            console.error(e + " => " + shift);
            flg = false;
        }
        return flg;
    }
    /*
    Check Option
    @param  {obj}  option : option of instance parameter
    @return {boolean} true  : No Error.
    false : Has Error.
    */
    optionValidation(option){
        // flag to detect error(true: No error, false: Has error)
        let flg = true;
        // This variable will be reused in order to display in error messsage
        let target;
        try{
            // Check workTime
            target = option["workTime"];
            if(typeof(target) !== "boolean")throw new Error(this.ermsg["NOT_BOOLEAN"]);
            // Check bgColor
            target = option["bgcolor"];
            for(let i in target){
                let color = target[i];
                if(typeof(color) !== "string")throw new Error(this.ermsg["STRING_DATA_TYPE"]);
                // Color code reg
                var regex = new RegExp(/^#([\da-fA-F]{6}|[\da-fA-F]{3})$/);
                if(!regex.test(color))throw new Error(this.ermsg["NOT_COLOR_CODE"]);
            }
            // Check selectBox
            const obj = option["selectBox"];
            // Access to Key & Value
            for(let key in obj){
                target = key;
                if(typeof(target) !== "string")throw new Error(this.ermsg["STRING_DATA_TYPE"]);
                target = obj[key];
                if(typeof(target) !== "string")throw new Error(this.ermsg["STRING_DATA_TYPE"]);
            }
        }catch(e){
            console.error(e + " => " + target);
            flg = false;
        }
        return flg;
    }
}

// Class for calculation
class Calculation{
    /*
    Convert time working time into minutes
    If ending time passes 00:00, add 1440(24H) to returning minutes.
    @param  {string} time : Format should be "HH:MM-HH:MM".
    @example : let [s,e] = twoTime2Int('10:00-23:00')
    @return  {int} startTime : Starting time converted as minutes
    {int} endTime   : Ending time converted as minutes
    */
    twoTime2Int(time){
        // Starting Time
        let sTime = this.time2Int(time.substring(0,5));
        // Ending Time
        let eTime = this.time2Int(time.substring(6,11));
        // Process for Ending Time exceeds 00:00
        if(sTime > eTime){
            // Minute of 24 hours * 60 minute
            eTime += 1440;
        }
        return [sTime, eTime];
    }
    /*
    convert time into integer
    @param  {string} time : Format should be "HH:MM".
    @example : time2Int('23:45')
    @return  {int}        : Time converted as minutes
    @example : 1425
    */
    time2Int(time){
        // Hour
        const h = time.substring(0,2);
        // Minute
        const m = time.substring(3,5);
        return (parseInt(h,10) * 60 + parseInt(m,10));
    }
    /*
    convert time into integer
    @param  {int}   time : Time converted as minutes
    @example : int2Time(1425)
    @return  {string} returnTime : Format should be "HH:MM".
    @example : 23:45
    */
    int2Time(time){
        // Hour
        let h = Math.floor(time / 60);
        if(h >= 24)h -= 24;
        // Minute
        let m = time % 60;
        // Add 0 when only 1 digit
        return (this.toDoubleDigits(h) + ":" +  this.toDoubleDigits(m));
    }
    /*
    Add 0 to number if it is only 1 digit
    @param  {int}    num : Number.
    @return {string} num : Number with 0.
    */
    toDoubleDigits(num) {
        num += "";
        if (num.length === 1) {
            num = "0" + num;
        }
        return num;
    }
    /*
    Count cells
    @param  {int} s   : startTime in parameter
    {int} e   : endTime in parameter
    {int} d   : divTime in parameter
    @return {int} columns   : columns of Table
    */
    countColumns(s,e,d){
        const columns = (e - s) / d;
        return columns;
    }
    /*
    Get index in shift object
    @param  {obj}   shift : shift object
    @return {array} index : Array of index
    */
    getIndex(shift){
        return Object.keys(shift);
    }
    /*
    Get names in shift object
    @param  {obj}   shift : shift object
    @return {array} names : Array of names
    */
    getNames(shift){
        let names = [];
        // Access to Object rooted to Index Key
        for(let key in shift){
            let indexObj = shift[key];
            // Access to Object rooted to Name Key
            for(let name in indexObj){
                let nameStr = name;
                names.push(nameStr);
            }
        }
        return names;
    }
    /*
    Get Index and Time
    @param  {obj}  shift : shift object
    @return {obj}  obj : {1:[{color:1,startTime:600,endTime:1200},{color:..}], 2:{...}}
    */
    getIndexAndTime(shift){
        let obj = {};
        // Access to Object rooted to Index Key
        for(let key in shift){
            let indexObj = shift[key];
            // Access to Object rooted to Name Key
            for(let name in indexObj){
                let colorObj = indexObj[name];
                // tempArray to store data of 1 person
                let tempArray = [];
                // Access to Object rooted to Color Key
                for(let i in colorObj){
                    let obj = colorObj[i];
                    // To fetch as String, made another loop
                    for(let color in obj){
                        let tempObj = {};
                        let [start,end] = this.twoTime2Int(obj[color]);
                        tempObj["color"] = color;
                        tempObj["startTime"] = start;
                        tempObj["endTime"] = end;
                        tempArray.push(tempObj);
                    }
                }
                obj[`${key}`] = tempArray;
            }
        }
        return obj;
    }
    /**
     * getTotalShiftTime
     *
     * @param  {str} id
     * @param  {object} shift
     * @return {str} time : Format will be HH:MM
     */
    getTotalShiftTime(id,shift){
        let index = id.replace( "name-" , "" );
        let timeArray = this.getShiftTimeFromIndex(index,shift);
        let totalTime = 0;
        for(let i = 0; i < timeArray.length; i++){
            let [s,e] = this.twoTime2Int(timeArray[i]);
            totalTime += (e - s);
        }
        return this.int2Time(totalTime);
    }
    /**
     * getShiftTimeFromIndex
     *
     * @param  {str}   index
     * @return {array} time  : Array of Shift Time
     */
    getShiftTimeFromIndex(index,shift){
        let timeArray = [];
        let names = shift[index];
        for(let i in names){
            let array = names[i];
            for(let j in array){
                // Convert Array to String
                timeArray.push((Object.values(array[j]))[0]);
            }
        }
        return timeArray;
    }
}

class Utils{
    /*
    Generator to return color, startTime, endTime as variable
    @param {obj} obj : color and time Object
    @example :{1:[{color:1,startTime:600,endTime:1200},{color:..}], 2:{...}}
    @return {int} index : index
    {int} color : color
    {int} s : startTime
    {int} e : endTime
    */
    *colorTimeGenerator(obj){
        let indexArray = Object.keys(obj);
        while(true){
            // Loop for index
            for(let i = 0; i < indexArray.length; i++){
                let colorTimeArray = obj[indexArray[i]];
                // Loop for time in 1 person
                for(let j = 0; j < colorTimeArray.length; j++){
                    let colorTime = colorTimeArray[j];
                    yield [
                        indexArray[i],
                        colorTime["color"],
                        colorTime["startTime"],
                        colorTime["endTime"]
                    ];
                }
            }
            yield [false,false,false,false];
        }
    }
    /**
    * searchNearestDom - description
    *
    * @param  {str} index : index number of shift
    * @param  {int} s     : Start time of shift
    * @param  {int} e     : End time of shift
    * @return {str} startId: Nearest element id of start time;
    * @return {str} endId: Nearest element id of end time;
    */
    searchNearestDom(index,s,e){
        let [time,id] = this.getOneRowArrtibure(index);
        // Stores nearest id
        let startId = "";
        let endId = "";
        // Stores nearest time
        let st=5000;
        let et=5000;
        for(let i in time){
            let attrTime = parseInt(time[i],10);
            if(Math.abs(attrTime - s) <= Math.abs(st - s)){
                st = attrTime;
                startId = id[i];
            }
            if(Math.abs(attrTime - e) <= Math.abs(et - e)){
                et = attrTime;
                endId = id[i];
            }
        }
        return [startId,endId];
    }
    /**
    * To get Attribute of 1 row of Table
    *
    * @param  {str} index :Index number of shift
    * @return {array} time : Array of Time Attribute
    * @return {array} id   : Array of id Attribute
    */
    getOneRowArrtibure(index){
        let time = [];
        let id = [];
        $(`#name-${index} td`).each((i,elem)=>{
            // Skip Header Row
            if(i){
                let el = $(elem);
                time.push(el.attr("time"));
                id.push(el.attr("id"));
            }
        });
        return [time,id];
    }
    /**
     * checkOver - Check whether the bar passes or reaches to last cell
     *
     * @param  {int} e  : time
     * @param  {str} eId : ID Number in str
     * @return {boolean}
     */
    checkOver(e,eId){
        let bool = false;
        let cell = $(`#${eId}`);
        let cellTime = parseInt(cell.attr("time"),10);
        let prevCellTime = parseInt(cell.prev().attr("time"),10);
        // Next Time is not in DOM. Its temporary value.
        let nextTime = cellTime + cellTime - prevCellTime;
        // The end time is closer to next time.
        if(Math.abs(cellTime - e) >= Math.abs(nextTime - e)){
            bool = true;
        }
        return bool;
    }
}

class Canvas{
    constructor(color){
        this.color = [
            "#ff7f7f",
            "#7f7fff",
            "#7fff7f",
            "#ffff7f",
            "#818181",
            "#bf7fff",
            "#7fbfff",
            "#bfff7f",
            "#ffbf7f",
            "#ff7fff"
        ];
        // Set option Color
        if(color){
            for(let i in color){
                this.color[i] = color[i];
            }
        }
        // To store canvas tag beginning position and size
        this.canvasTag = {};
        // To store cell size
        this.cell = {};
        this.measureCellSize();
        // Create canvas tag in clickable area
        this.setCanvasTag();
    }
    /**
    * Measure cell size and set to constructor
    */
    measureCellSize(){
        let target = $(".TimeTable td:eq(1)");
        // +1 is padding of rightmost cell
        this.cell.width = target.outerWidth() + 1;
        this.cell.height = target.outerHeight();
    }
    /**
    * setCanvasTag - Append to Dom and set to constructor
    */
    setCanvasTag(){
        let firstCell = this.getCoordinate(".TimeTable td:eq(1)");
        let lastCell  = this.getCoordinate(".TimeTable td:last");
        // Absolute coordinate & Add Tab tags coordinate
        this.canvasTag.x = firstCell.x;
        this.canvasTag.y = firstCell.y;
        // Add cell size
        this.canvasTag.width = lastCell.x - firstCell.x + this.cell.width;
        this.canvasTag.height = lastCell.y - firstCell.y + this.cell.height;
        let canvas = $("<canvas>",{class:"TimeBar"});
        canvas.css({
            position: "absolute",
            top: this.canvasTag.y,
            left: this.canvasTag.x,
        });
        canvas.attr({
            height: this.canvasTag.height,
            width: this.canvasTag.width,
        });
        $(".TimeTable").prepend(canvas);
    }
    /**
    * drawLine - To draw canvas line from sId to eId
    *
    * @param  {str} sId   : id to start draw line
    * @param  {str} eId   : id to end drawing line
    * @param  {str} color : decide color to use
    * @param  {boolean} over : Whether line reach to rightmost column or more than it.
    *                          Not able to reach last cell because of
    *                          no coordinate in end of cell.
    * @return {boolearn}  :
    */
    drawLine(sId,eId,color,over){
        // Coordinate of start and end
        let sc = this.getCoordinate(`#${sId}`);
        let ec  = this.getCoordinate(`#${eId}`);
        // Convert to use for coordinate in canvas
        sc = this.a2R(sc);
        ec = this.a2R(ec);
        // Set Y coordinate middle of cell
        let middle = this.cell.height / 2;
        sc.y += middle;
        ec.y += middle;
        // When over or reach to last cell.
        if(over){ec.x += this.cell.width + 1;}
        // Init canvas
        let canvas = $(".TimeBar").get(0);
        var ctx = canvas.getContext("2d") ;
        ctx.beginPath();
        // Start
        ctx.moveTo(sc.x, sc.y);
        // End
        ctx.lineTo(ec.x, ec.y);
        // Color
        ctx.strokeStyle = this.color[parseInt(color,10)];
        // Line width
        ctx.lineWidth = 10;
        // Plot!!
        ctx.stroke() ;
    }
    /**
     * a2R - Convert absolut coordinate to relative coordiante(Use in Canvas)
     *
     * @param  {obj} coordinate : Must have format of {x: x, y: y}
     * @return {obj} obj        : Converted object
     */
    a2R(coordinate){
        let obj = {};
        obj.x = coordinate.x - this.canvasTag.x;
        obj.y = coordinate.y - this.canvasTag.y;
        return obj;
    }
    /**
    * getCoordinate - Get aboslute coordinate of Element
    *
    * @param  {dom} selector
    * @return {obj} obj : Object contains coordinate of cell
    */
    getCoordinate(selector){
        let obj = {};
        let element = $(selector).get(0);
        let rect = element.getBoundingClientRect();
        obj.x = rect.left + window.pageXOffset;
        obj.y = rect.top + window.pageYOffset;
        return obj;
    }
    debugDot(x,y){
        let canvas = $("<canvas>",{id: "debugdot"});
        canvas.css({
            position: "absolute",
            top: y,
            left: x,
        });
        canvas.attr({
            height: 20,
            width: 20,
        });
        $("body").prepend(canvas);
        let element = $("#debugdot").get(0);
        var ctx = element.getContext("2d");
        // パスをリセット
        ctx.beginPath () ;
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, 2, 2);
        ctx.stroke();
    }
}
