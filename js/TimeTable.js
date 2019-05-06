"use strict";
let gVal = {};
gVal.START_TIME = null;
gVal.END_TIME = null;
gVal.DIV_TIME = null;
gVal.SHIFT = null;
gVal.OPTION = null;
gVal.SELECTOR = null;
// Class for calculation
class CalculationT{
    /**
    * Convert time working time into minutes
    * If ending time passes 00:00, add 1440(24H) to returning minutes.
    * @param  {string} time : Format should be "HH:MM-HH:MM".
    * @example let [o,c] = twoTime2Int('10:00-23:00')
    * @return  {int} oTime : Opening time converted as minutes
    * {int} cTime   : Closing time converted as minutes
    */
    twoTime2Int(time){
        // Starting Time
        let oTime = this.time2Int(time.substring(0,5));
        // Ending Time
        let cTime = this.time2Int(time.substring(6,11));
        // Process for Ending Time exceeds 00:00
        if(oTime > cTime){
            // Minute of 24 hours * 60 minute
            cTime += 1440;
        }
        return [oTime, cTime];
    }
    /**
    * Convert time into integer
    * @param  {string} time : Format should be "HH:MM".
    * @example : time2Int("23:45")
    * @return  {int}        : Time converted as minutes
    * @example : 1425
    */
    time2Int(time){
        // Hour
        const h = time.substring(0,2);
        // Minute
        const m = time.substring(3,5);
        return (parseInt(h,10) * 60 + parseInt(m,10));
    }
    /**
    * convert time into integer
    * @param  {int}   time : Time converted as minutes
    * @example : int2Time(1425)
    * @return  {string} returnTime : Format should be "HH:MM".
    * @example : 23:45
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
    /**
    * Add 0 to number if it is only 1 digit
    * @param  {int}    num : Number.
    * @return {string} num : Number with 0.
    */
    toDoubleDigits(num) {
        num += "";
        if (num.length === 1) {
            num = "0" + num;
        }
        return num;
    }
    /**
    * Count cells
    * @param  {int} s   : openTime in parameter
    * {int} e   : closeTime in parameter
    * {int} d   : divTime in parameter
    * @return {int} columns   : columns(cells) of Table
    */
    countColumns(s,e,d){
        return Math.ceil((e - s) / d);
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
    /**
    * getTotalShiftTime
    *
    * @param  {str} id
    * @param  {object} shift
    * @return {str} time : Format will be HH:MM
    */
    getTotalShiftTime(index,shift){
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
    * getIndexFromStartId - To configure id from coordinate of Bar starting dom.
    *
    * @param{str} sId
    * @return {str}  index
    */
    getIndexFromStartId(sId){
        let index = "";
        let row = $(`#${sId}`).siblings();
        let dom = $(row).find(".timeTableSelectbox option:selected");
        // Check whether select boxs option is on
        if(dom.length==0){
            let id = $(row).parents().attr("id");
            index = this.removeNamefromId(id);
        }else{
            index = $(dom).attr("value");
        }
        return index;
    }
    /**
     * getNameFromId
     * @param  {int} Id
     * @return {str}  name
     */
    getNameFromId(Id){
        let shift = this.v.shiftTime;
        let name = "";
        // Search Also Select Box
        if(shift[Id]){
            name = Object.keys(shift[Id]).join("");
        }else{
            let selectBoxNames = this.v.option["selectBox"];
            name =  selectBoxNames[Id];
        }
        return name;
    }
}
// Class to manage messages
class MessageT{
    constructor(){
        // Messages for Error
        this.ermsg = {};
        this.setErrorMessage();
    }
    /**
    * Set Error Message to costructor object
    * @return {object} ermsg Object of error messages
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
        return this.ermsg;
    }
}
// Setter & Getter of Global Variables
class ValidationT extends MessageT{
    constructor(){
        super();
        this.calc = new CalculationT();
    }
    get startTime() {return gVal.START_TIME;}
    set startTime(x){if(this.checkStartTime(x)) gVal.START_TIME = this.checkStartTime(x);}
    get endTime  () {return gVal.END_TIME;}
    set endTime  (x){if(this.checkEndTime  (x)) gVal.END_TIME   = this.checkEndTime(x);}
    get divTime  () {return gVal.DIV_TIME;}
    set divTime  (x){if(this.checkDivTime  (x)) gVal.DIV_TIME   = this.checkDivTime(x);}
    get shiftTime() {return gVal.SHIFT;}
    set shiftTime(x){if(this.checkShiftTime(x)) gVal.SHIFT      = this.checkShiftTime(x);}
    get option   () {return gVal.OPTION;}
    set option   (x){if(this.checkOption   (x)) gVal.OPTION     = this.checkOption(x);}
    get selector () {return gVal.SELECTOR;}
    set selector (x){gVal.SELECTOR = x;}
    get coordinate () {return gVal.COORDINATE;}
    set coordinate (x){gVal.COORDINATE = x;}
    get table () {return gVal.TABLE;}
    set table (x){gVal.TABLE = x;}
    get selectbox () {return gVal.SELECTBOX;}
    set selectbox (x){gVal.SELECTBOX = x;}
    get useBootstrap () {return gVal.USEBOOTSTRAP;}
    set useBootstrap (x){gVal.USEBOOTSTRAP = x;}
    /**
    * Check Existance of starttime, endtime, divtime
    * @param  {String} sTime Starting Time
    * @param  {String} eTime Ending Time
    * @param  {String} dTime Dividing Time
    * @return {boolean}
    */
    checkExistance(sTime,eTime,dTime){
        // flag to detect error(true: No error, false: Has error)
        let flg = true;
        try{
            // Check existance of startTime
            if(sTime == null)throw new Error(this.ermsg["NO_STARTTIME"]);
            // Check existance of endTime
            if(eTime == null)  throw new Error(this.ermsg["NO_ENDTIME"]);
            // Check existance of endTime
            if(dTime == null)  throw new Error(this.ermsg["NO_DIVTIME"]);
        }catch(e){
            console.error(e);
            flg = false;
        }
        return flg;
    }
    /**
    * Convert Opening Time into int
    * @param  {String} time Starting Time (ex."10:00")
    * @return {int} intTime Time in int
    */
    checkStartTime(time){
        // Validation
        if(!this.timeValidation(time))return 0;
        let intTime = this.calc.time2Int(time);
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
        // When ending Time is after 00:00
        if(this.startTime > intTime){
            // Add 24 hours converted as minute
            intTime += 1440;
        }
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
        return intDivTime;
    }
    /*
    Validation of Shift
    @param  {obj} shift : shift object ({"name1":"12:00-18:00",...})
    @return {obj} shift : Unit to create Time Table(Minute)
    */
    checkShiftTime(shift){
        if(!this.shiftValidation(shift)    )return null;
        if(!shift)shift={};
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
        // Set default value if there is no Bootstrap option
        if(!option["useBootstrap"])option["useBootstrap"] = false;
        // Check each values;
        if(!this.optionValidation(option))return null;
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
            // Check Bootstrap
            target = option["useBootstrap"];
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
// Util functions to measure coordinate
class UtilT extends CalculationT{
    constructor(){
        super();
        this.v = new ValidationT();
    }
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
    * Compare actual time and data-time in table and find nearest data-time
    *
    * @param  {str} index : index number of shift
    * @param  {int} s     : Start time of shift
    * @param  {int} e     : End time of shift
    * @return {str} startId: Nearest element id of start time;
    * @return {str} endId: Nearest element id of end time;
    */
    searchNearestDom(index,s,e){
        // id is not required but uses below method
        let [time,id] = this.getOneRowArrtibure(index);    // eslint-disable-line no-unused-vars
        // Stores nearest id
        // Stores nearest time
        // Set initila value far from actual nearest place
        let st = 9999;
        let et = 9999;
        for(let i in time){
            let attrTime = parseInt(time[i],10);
            if(Math.abs(attrTime - s) <= Math.abs(st - s)){
                st = attrTime;
            }
            if(Math.abs(attrTime - e) <= Math.abs(et - e)){
                et = attrTime;
            }
        }
        return [st,et];
    }
    /**
    * To get Attribute of 1 row of Table
    *
    * @param  {str} index :name #id of shift
    * @return {array} time : Array of Time Attribute
    * @return {array} id   : Array of id Attribute
    */
    getOneRowArrtibure(index){
        let time = [];
        let id = [];
        $(`#${index} td`).each((i,elem)=>{
            // Skip Header Row
            if(i){
                let el = $(elem);
                time.push(el.attr("data-time"));
                id.push(el.attr("data-nameid"));
            }
        });
        return [time,id];
    }
    /**
    * checkOver - Check whether the bar passes or reaches to last cell
    * Bar will be shift and layout be slightly different
    *
    * @param  {int} e  : time
    * @param  {str} eId : ID Number in str
    * @return {boolean}
    */
    checkOver(actualTime,nearestTime){
        let isOver = false;
        let endTableTime = this.v.endTime;
        let divTime = this.v.divTime;
        // Find Bar reached to last cell
        let cond1 = (nearestTime === endTableTime - divTime);
        // Has chance to over the last cell
        let cond2 = (actualTime >= endTableTime);
        if(cond1 && cond2){
            isOver = true;
        }
        return isOver;
    }
    /**
    * getCoordinate - Get absolute coordinate of Selector
    *
    * @param  {dom} selector
    * @return {obj} obj : Object contains absolute coordinate of cell
    */
    getCoordinateFromSelector(selector){
        let obj = {};
        let element = $(selector).get(0);
        let rect = element.getBoundingClientRect();
        obj.x = rect.left + window.pageXOffset;
        obj.y = rect.top + window.pageYOffset;
        return obj;
    }
    /**
    * getCoordinate - Get aboslute coordinate of data-nameid & data-time
    *
    * @param  {str} id
    * {str} time
    * @return {obj} obj : Object contains absolute coordinate of cell
    */
    getCoordinateFromCustomAttribute(id,time){
        let obj = {};
        let row = $(`.TimeTable #${id}`).children();
        const LEN = row.length;
        let element = "";
        for(let i = 0; i < LEN; i++){
            if(parseInt($(row[i]).attr("data-time"),10) === time){
                element = $(row[i]).get(0);
                break;
            }
        }
        // TODO: Temporary fix
        if(!element)return;
        let rect = element.getBoundingClientRect();
        obj.x = rect.left + window.pageXOffset;
        obj.y = rect.top + window.pageYOffset;
        return obj;
    }
    /**
    * Get absolute coordinate
    * @param {event} event
    * @return {obj} obj : contais aboslute coordinate
    */
    getCoordinateByClick(event){
        let obj = {};
        obj.x = event.clientX;
        obj.y = event.clientY;
        return obj;
    }
    /**
    * Find Nearest Element From Coordinate
    * @param  {obj} obj : Previous coordinate(x, y, time, index)
    * @param  {obj} cell : object contains cell size
    * @param  {obj} coordinate : object contains clicked coordinate
    * @return {obj} obj : object contains data-nameid and data-time
    */
    findNearestElementByCoordinate(obj, cell, clickedCoordinate){
        //let hasObj = false;
        $(".js-tdata").each((i,elem)=>{
            let dom = $(elem).children();
            for(let i = 0; i < dom.length; i++){
                if(i === 0)continue;
                let target = $(dom[i]);
                let startCoordinate = this.getCoordinateFromSelector($(target));
                let endCoordinate = {};
                endCoordinate.x = startCoordinate.x + cell.width;
                endCoordinate.y = startCoordinate.y + cell.height;
                // Recognize clicked cell's top left coordinate is nearest
                let xPos = (clickedCoordinate.x >= startCoordinate.x && clickedCoordinate.x <= endCoordinate.x);
                let yPos = (clickedCoordinate.y >= startCoordinate.y && clickedCoordinate.y <= endCoordinate.y);
                // Decide the cell clicked
                if(xPos&&yPos){
                    obj.y = startCoordinate.y;
                    obj.index = $(target).attr("data-nameid");
                    // Compare start position left or right
                    if(Math.abs(startCoordinate.x - clickedCoordinate.x) < Math.abs(endCoordinate.x - clickedCoordinate.x)){
                        obj.x = startCoordinate.x;
                        obj.time = $(target).attr("data-time");
                        obj.over = false;
                    }else{
                        obj.x = endCoordinate.x;
                        let time = $(dom[i + 1]).attr("data-time");
                        if(time){
                            obj.time = time;
                            obj.over = false;
                        }else{
                            obj.time = `${this.v.endTime - this.v.divTime}`;
                            obj.over = true;
                        }
                    }
                    return obj;
                }
            }
        });
        return obj;
    }
    /**
     * Get Id From Y Coordinate
     * @param  {obj} cell object contains cell size
     * @param  {int} y    y coordinate
     * @return {int} index index of name id
     */
    getIdFromYCoordinate(cell,y){
        let index = null;
        $(".js-tdata").each((i,elem)=>{
            let dom = $(elem);
            let start = this.getCoordinateFromSelector(dom).y;
            let end = start + cell.height;
            if(y >= start && y <= end){
                index = $(dom).attr("id");
            }
        });
        return index;
    }
    /**
     * [refreshWorkTime description]
     */
    refreshWorkTime(){
        let tbody = $("#TimeTable").find(".js-tdata");
        tbody.each((i,elem)=>{
            let target = "";
            if(this.v.option["selectBox"]){
                target = $(elem).find(".timeTableSelectbox option:selected").attr("value");
            }else{
                target = $(elem).attr("id");
            }
            let time = this.getTotalShiftTime(target, this.v.shiftTime);
            $(elem).find(".js-workTime").html(time);
        });
    }
}

// Intial class to be called.
class TimeTable{    // eslint-disable-line no-unused-vars
    constructor(data){
        this.v = new ValidationT();
        this.c = new CalculationT();
        this.u = new UtilT();
        // Flag for when this instance got error
        this.errFlg = true;
        // End if necessary parameter was missing
        if(!this.v.checkExistance(
            data["startTime"],
            data["endTime"],
            data["divTime"])
        ){
            this.errFlg = false;
            return false;
        }
        this.v.startTime  = data["startTime"]; // Beginning Time
        this.v.endTime    = data["endTime"];   // Endint Time
        this.v.divTime    = data["divTime"];   // Unit to Divide time(minutes)
        this.v.shiftTime  = data["shift"];     // Time Table Data
        this.v.option     = data["option"];     // Other option
        // For final check of values
        let arr = [
            this.v.startTime,
            this.v.endTime,
            this.v.divTime,
            this.v.shiftTime,
            this.v.option
        ];
        // End if there was error in any parameter
        if(!this.v.checkUndefinedArray(arr)){
            this.errFlg = false;
            return false;
        }
        // Make instance after passes validation has done
        this.can = new CanvasT();
    }
    /*
    To Create TimeTable
    @param  {selector} id : Selector has to be ID
    @return {boolean}  true  : No Error.
    false : Has Error.
    */
    init(sel){
        // Not to proceed process when there was error
        if(!this.errFlg)return false;
        // Set as Constructor
        this.v.selector = sel;
        // Set Table
        this.createTable();
        // Set options
        if(this.v.option["workTime"])this.setWorkTimeColumn();
        $(sel).append(this.table);
        if(this.v.option["selectBox"])this.changeNameId();
        this.deleteRow();
        // Draw Chart
        this.can.init();
        $(window).resize(()=>this.refreshCanvas());
    }
    /*
    Create Table for append document.
    */
    createTable(){
        let base = $("<table>",{class: "TimeTable",id: "TimeTable"});
        if(this.v.option["useBootstrap"]){
            $(base).addClass("TimeTable--bootstrap");
        }
        // Create Header
        base = this.createTableHeader(base);
        // Create Data
        base = this.createTableData(base);
        // Set 1st column(name)
        base = this.addFirstColumn(base);
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
        let colspan = 60 / this.v.divTime;
        // Column of Time(Name column is not included)
        const COLUMNS = this.c.countColumns(this.v.startTime, this.v.endTime, this.v.divTime);
        let startTime = this.v.startTime;
        // Create Table Header
        for(let i = 0; i < COLUMNS; i++){
            // Convert time
            let thTime = this.c.int2Time(startTime + i * this.v.divTime);
            // Skip if time is NOT --:00
            if((startTime + i * this.v.divTime) % 60 != 0){continue;}
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
        // When there is no shift
        if(!Object.keys(this.v.shiftTime).length){
            for(let i = 0; i < 3; i++){
                this.addRow(base);
            }
            return base;
        }
        const COLUMNS = this.c.countColumns(this.v.startTime, this.v.endTime, this.v.divTime);
        const NUMSHIFT = this.c.getNames(this.v.shiftTime).length;
        // Add as id
        const INDEX = this.c.getIndex(this.v.shiftTime);
        // Loop for number of shift(rows)
        for(let i = 0; i < NUMSHIFT; i++){
            // Loop for time cells(columns)
            let nameId = INDEX[i];
            let tr = $("<tr></tr>", {id: nameId , class: "js-tdata TimeTable__row"});
            for(let j = 0; j < COLUMNS; j++){
                let timeAttr =  this.v.startTime + this.v.divTime * j;
                let td = $("<td></td>");
                // Set id for getting coordinate
                // Use attr because of eslint setting (double-quote-enclosure)
                td.attr("data-nameid", nameId);
                td.attr("data-time", timeAttr);
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
        const NAMES = this.c.getNames(this.v.shiftTime);
        // id for find
        const INDEX = this.c.getIndex(this.v.shiftTime);
        // Column of Header
        base.find("#theader").prepend("<th>NAME</th>");
        // Column of Data
        for(let i = 0; i < NAMES.length; i ++){
            let td = base.find(`#${INDEX[i]}`);
            let nameColumn = "";
            let optionalDeleteButton = this.v.option.deleteRows ? (`<button class="deleteRow js-deleteButton" data-nameid="${INDEX[i]}">x</button>`) : "";
            // Different whether select box option exist
            if(this.v.option["selectBox"]){
                // Required to create selecttag as string (Why?)
                let select = this.createSelectBox(INDEX[i],NAMES[i]);
                nameColumn = (`<td class="TimeTable__name">${select}${optionalDeleteButton}</td>`);
                //console.log(toString(this.selectbox));
            }else{
                nameColumn = (`<td class="TimeTable__name">${NAMES[i]}${optionalDeleteButton}</td>`);
            }
            td.prepend($(nameColumn));
        }
        return base;
    }
    /**
    * [createSelectBox description]
    * @param  {str} index [description]
    * @param  {str} name  [description]
    * @return {dom} selectTag
    */
    createSelectBox(index=0,name=null){
        let selectTag = "<select class=\"timeTableSelectbox js-timeSelectBox\">";
        let str = "";
        let obj = this.v.option["selectBox"];
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
    /**
    * setWorkTimeColumn - description
    */
    setWorkTimeColumn(){
        let header = this.table.find("#theader");
        $(this.v.selector).append(this.table);
        header.append("<th>Total</th>");
        let tbody = this.table.find(".js-tdata");
        tbody.each((i,elem)=>{
            let target = "";
            if(this.v.option["selectBox"]){
                target = $(elem).find(".timeTableSelectbox option:selected").attr("value");
            }else{
                target = $(elem).attr("id");
            }
            let time = this.c.getTotalShiftTime(target, this.v.shiftTime);
            $(elem).append(`<td class="TimeTable__worktime js-workTime">${time}</td>`);
        });
    }
    /**
     * Reasign name id when changing
     */
    changeNameId(){
        // Different function because of scope
        let shift = this.v.shiftTime;
        let deleteBar = (prevId)=>{this.can.deleteIdBar(prevId);};
        $(document).on("change", ".js-timeSelectBox",function(){
            let prevId;
            let selectedId = $(this).val();
            let _this = this;
            let options = $(_this).children(["option"]);
            for(let i = 0; i < options.length; i++){
                // Delete "selected"
                if($(options[i]).attr("selected")){
                    $(options[i]).removeAttr("selected");
                    prevId = $(options[i]).attr("value");
                }
                // Assign "selected"
                if($(options[i]).attr("value") == selectedId){
                    $(options[i]).attr("selected","");
                }
            }
            // Reassign name-id
            // Delete Button
            $(_this).next().attr("data-nameid",selectedId);
            // td
            let sib = $(_this).parent().siblings();
            for(let i = 0; i < sib.length; i++){
                $(sib[i]).attr("data-nameid", selectedId);
            }
            // Change id of row
            if(prevId){
                $(`#${prevId}`).attr("id",selectedId);
            }else{
                $(_this).parent().parent().attr("id",selectedId);
            }

            // Delete prevId from Shift data
            delete shift[prevId];
            deleteBar(prevId);
        });
    }
    /**
     * [deleteRow description]
     * @return {[type]} [description]
     */
    deleteRow(){
        let shift = this.v.shiftTime;
        let refresh = ()=>{this.refreshCanvas();};
        $(document).on("click", ".js-deleteButton",function(){
            let _this = this;
            let id = $(_this).attr("data-nameid");
            if($(".js-tdata").length > 1){
                $("#timeTableToolTip").remove();
                if(id){
                    $(`#${id}`).remove();
                    delete shift[id];
                // No name row
                }else{
                    $(_this).parent().parent().remove();
                }
            }
            refresh();
        });
    }
    /**
     * [deleteRow description]
     * @return {[type]} [description]
     */
    addRow(target="#TimeTable"){
        if(!this.v.option["selectBox"])return;
        if($(".js-tdata").length > 15)return;
        // Crate row
        let row = $("<tr></tr>", {class: "js-tdata TimeTable__row"});
        let optionalDeleteButton = this.v.option.deleteRows ? "<button class=\"deleteRow js-deleteButton\">x</button>" : "";
        // Create Name Column
        $(row).append((`<td class="TimeTable__name">${optionalDeleteButton}</td>`));
        // Craete Table Data
        const COLUMNS = this.c.countColumns(this.v.startTime, this.v.endTime, this.v.divTime);
        for(let j = 0; j < COLUMNS; j++){
            let timeAttr =  this.v.startTime + this.v.divTime * j;
            let td = $("<td></td>");
            // Set id for getting coordinate
            // Use attr because of eslint setting (double-quote-enclosure)
            td.attr("data-time", timeAttr);
            row.append(td);
        }
        // Create Work Time Colummn
        if(this.v.option["workTime"]){
            $(row).append("<td class=\"TimeTable__worktime js-workTime\"></td>");
        }
        // Create SelectBox
        if(this.v.option["selectBox"]){
            let selectTag = "<select class=\"timeTableSelectbox js-timeSelectBox\">";
            let str = "";
            let obj = this.v.option["selectBox"];
            for(let i in obj){
                str += `<option value="${i}">${obj[i]}</option>`;
            }
            selectTag = selectTag + str + "</select>";
            $(row).find(".TimeTable__name").prepend(selectTag);
            $(row).find(".js-timeSelectBox").val("");
        }
        $(target).append(row);
        // When there is no shift
        if(!Object.keys(this.v.shiftTime).length&&$(target).find(".js-workTime").length == 1){
            $(target).find(".js-workTime").remove();
            return;
        }
        this.deleteRow();
        this.u.refreshWorkTime();

        this.refreshCanvas();
    }
    /**
     * [refreshCanvas description]
     * @return {[type]} [description]
     */
    refreshCanvas(){
        $("#timeBar").off("mousedown");
        $("#timeBar").remove();
        this.can.init();
    }
    /**
     * return ShiftDate
     * @return {obj} shiftData
     */
    data(){
        return JSON.parse(JSON.stringify(this.v.shiftTime));
    }
    delete(){
        let stage = this.can.stage;
        let barNum = stage.children.length;
        for(let i = 0; i < barNum; i++){
            $(stage.children[i]).off("click");
        }
        $(document).off("change", ".js-timeSelectBox");
        $(document).off("mouseup");
        $("#timeBar").off("mousedown");
        $("#timeBar").remove();
        $("#TimeTable").remove();
    }
}

class CanvasT extends CalculationT{
    constructor(){
        super();
        this.v = new ValidationT();
        this.u = new UtilT();
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
        this.workTime = this.v.workTime;
        this.useBootstrap = this.v.option.useBootstrap;
        // Set option Color
        let optionColor = this.v.option.bgcolor;
        if(optionColor){
            for(let i in optionColor){
                this.color[i] = optionColor[i];
            }
        }
        // To store canvas tag beginning position and size
        this.canvasTag = {};
        // Select of canvas tag. This selector is for draw as canvas.
        this.canvasSelector = null;
        // To store cell size
        this.cell = {};
        // Set stage for each object
        this.stage = null;
        // To store shape and sId, eId for deleting data when delete bar.
        this.stageId = {};
        // Start coordinate of creating bar by Drag&Drop
        this.startCoordinate = {};
        // End coordinate of creating bar by Drag&Drop
        this.endCoordinate = {};
    }
    /**
    * Process needs to be done after Table is appeded to html
    */
    init(){
        this.measureCellSize();
        this.setCanvasTag();
        this.stage = new createjs.Stage(this.canvasSelector);
        this.initialDraw();
    }
    /**
     * Set process execute same timing as stage update
     * This will be called manually add/delete bar
     */
    stageUpdate(){
        this.stage.update();
        if(this.v.option["workTime"]){
            this.u.refreshWorkTime();
        }
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
        let firstCell = this.u.getCoordinateFromSelector(".TimeTable td:eq(1)");
        // End cell will be different depends on worktime column
        let last = (this.workTime)?$(".TimeTable td:last").prev():$(".TimeTable td:last");
        let lastCell  = this.u.getCoordinateFromSelector(last);
        // Absolute coordinate & Add Tab tags coordinate
        this.canvasTag.x = firstCell.x;
        this.canvasTag.y = firstCell.y;
        // Add cell size
        this.canvasTag.width = lastCell.x - firstCell.x + this.cell.width;
        this.canvasTag.height = lastCell.y - firstCell.y + this.cell.height;
        let canvas = $("<canvas>",{id:"timeBar",class:"barCanvas"});
        let top = this.canvasTag.y;
        let left = this.canvasTag.x;
        if(this.useBootstrap){
            top = 32; // Height of Table Header
        }
        canvas.css({
            position: "absolute",
            top: top,
            left: left
        });
        canvas.attr({
            height: this.canvasTag.height,
            width: this.canvasTag.width - this.cell.width
        });
        $(".TimeTable").prepend(canvas);
        this.canvasSelector = $("#timeBar").get(0);
    }
    /**
    * Draw Initial bar
    */
    initialDraw(){
        let timeData = super.getIndexAndTime(this.v.shiftTime);
        let gen = this.u.colorTimeGenerator(timeData);
        for(;;){
            // Analyze object
            let [index,color,s,e] = gen.next().value;
            // End of generator
            if(!index)break;
            let [sTime,eTime,over] = this.setDrawParameter(index,s,e);
            // Draw Line
            let shape = this.drawLine(index,sTime,eTime,color,over);
            // Add mouse over Tooltip event
            let time = `${super.int2Time(s)}-${super.int2Time(e)}`;
            let startCoordinate = this.u.getCoordinateFromCustomAttribute(index,s);
            this.addTooltipEvent(shape, index, time, startCoordinate);
        }
        this.addCreateBarEvent();
    }
    /**
    * [setDrawParameter description]
    * @param {str} index name index
    * @param {str} s     start time (data-time)
    * @param {str} e     end time (data-time)
    */
    setDrawParameter(index,s,e){
        // Get id of dom which will plot start time and end time
        let [sTime,eTime] = this.u.searchNearestDom(index,s,e);
        // If there is no next element, the coordinate may be not proper.
        let over = false;
        // Conditions to judge whether bar reaches to last cell
        over = this.u.checkOver(e,eTime);

        return [sTime,eTime,over];
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
    * @return {shape} shape : object in canvas
    * @return {obj} sc : StartCoordinate to display tooltip
    */
    drawLine(index,sTime,eTime,color,over){
        // TODO: Temporary Fix
        if(!sTime||!eTime)return;
        let [sc,ec] = this.calculateLineCoordinate(index,sTime,eTime,over);
        let barColor = this.color[parseInt(color,10)];
        // Set name for each bar
        let obj = {};
        let TimeObj = {};
        TimeObj["start"] = sTime;
        TimeObj["end"] = eTime;
        obj[index] = TimeObj;
        let shape = new createjs.Shape().set({
            name:obj
        });
        shape.graphics
            .setStrokeStyle(10)
            .beginStroke(barColor)
            .moveTo(sc.x,sc.y)
            .lineTo(ec.x,ec.y)
            .endStroke();
        this.stage.addChild(shape);
        this.stageUpdate();
        return shape;
    }
    /**
    * a2R - Convert absolute coordinate to relative coordinate(Use in Canvas)
    * relative coordinate based on Canvas
    *
    * @param  {obj} coordinate : Must have format of {x: x, y: y}
    * @return {obj} obj        : Converted object
    */
    a2R(coordinate){
        let obj = {};
        // TODO:Temporary fix
        if(!coordinate)return;
        obj.x = coordinate.x - this.canvasTag.x;
        obj.y = coordinate.y - this.canvasTag.y;
        return obj;
    }
    /**
    * calculateLineCoordinate - To Calculate coordinate to draw line
    *
    * @param  {str} sId   : id to start draw line
    * @param  {str} eId   : id to end drawing line
    * @param  {boolean} over : Whether line reach to rightmost column or more than it.
    *                          Not able to reach last cell because of
    *                          no coordinate in end of cell.
    * @return {obj}  sc : starting coordinate
    * @return {obj}  ec : starting coordinate
    */
    calculateLineCoordinate(index,sId,eId,over){
        // Coordinates to reaturn
        // Coordinate of start and end
        let sc = this.u.getCoordinateFromCustomAttribute(index,sId);
        let ec  = this.u.getCoordinateFromCustomAttribute(index,eId);
        // Convert to use for coordinate in canvas
        sc = this.a2R(sc);
        ec = this.a2R(ec);
        // Set Y coordinate middle of cell
        let middle = this.cell.height / 2;
        sc.y += middle;
        ec.y += middle;
        // When over or reach to last cell.
        if(over){ec.x += this.cell.width;}
        return [sc,ec];
    }
    /**
    * addMouseOverTooltip - Add event to display Tooltip & delete bar
    *
    * @param  {shape} select selector of shape
    * @param  {str} time    time to display
    * @param  {obj} sId     Coordinate to display tool tip and find bar when deleting
    * @param  {obj} shift   To change shift object when deleting bar
    */
    addTooltipEvent(shape, index, time, sc){
        $(shape).on("click", ()=>{
            // Shifting Pointing part of Tool tip
            let yToMove = this.cell.height - 5;
            // Coordinate of Tooltip to Display
            let toolTipToDisplay = sc;
            // Delete tool tip
            if($("#timeTableToolTip").length){
                let prevToolTip = null;
                prevToolTip = this.u.getCoordinateFromSelector("#timeTableToolTip");
                prevToolTip.y -= yToMove;
                $("#timeTableToolTip").remove();
                // Return when same bar is clicked
                let xSame = (toolTipToDisplay.x === prevToolTip.x);
                let ySame = (toolTipToDisplay.y === prevToolTip.y);
                if((xSame && ySame))return;
            }
            // Create dom to append
            let dom = $("<div></div>",
                {class: "timeTableToolTip",
                    id: "timeTableToolTip"})
                .append(time)
                .css({
                    left : toolTipToDisplay.x,
                    top : toolTipToDisplay.y + yToMove
                });
            let deleteButton = $("<button class=\"toolTipDelete\">x</button>");
            // Add Event to delete bar and also Tool tip
            $(deleteButton).on("click", ()=>{
                this.stage.removeChild(shape);
                $("#timeTableToolTip").remove();
                $(shape).off("click");
                this.deleteShiftData(time, index);
                this.stageUpdate();
            });
            $(dom).append(deleteButton);
            $(".TimeTable").append(dom);
        });
    }
    /**
     * Add event to create Bar
     */
    addCreateBarEvent(){
        $("#timeBar").on({
            "mousedown": ()=>{
                let startFlg = false;
                $("#timeBar").on("mousemove",()=>{
                    // Record Beginning Place
                    if(!startFlg){
                        // Decide starting place and index
                        let start = this.u.getCoordinateByClick(event);
                        this.startCoordinate = this.u.findNearestElementByCoordinate(this.startCoordinate, this.cell, start);
                        // TODO: Temporary fix
                        if(!this.startCoordinate.index)return;
                        $("#timeBar").on("mouseup",()=>{
                            $("#timeBar").off("mousemove");
                            $("#timeBar").off("mouseup");
                            // Delete Temporary Bar
                            if(this.tempShape){
                                this.stage.removeChild(this.tempShape);
                                this.stageUpdate();
                            }
                            // Redraw Bar for not to delete when again drag & drop
                            let sTime = parseInt(this.startCoordinate.time,10);
                            let eTime = parseInt(this.endCoordinate.time,10);
                            // Switch Time if drag & drop from left to right
                            if(sTime > eTime){
                                let temp = this.startCoordinate;
                                this.startCoordinate = this.endCoordinate;
                                this.endCoordinate = temp;
                                sTime = parseInt(this.startCoordinate.time,10);
                                eTime = parseInt(this.endCoordinate.time,10);
                            }
                            //let color = Math.floor(Math.random() * Math.floor(10));
                            let color = 1;
                            // Draw confirmed line
                            let shape = this.drawLine(
                                this.startCoordinate.index,
                                sTime,
                                eTime,
                                color,
                                this.endCoordinate.over
                            );
                            // Actual time to display in Tooltip
                            if(this.endCoordinate.over){
                                let divTime = parseInt(this.v.divTime,10);
                                eTime += divTime;
                                this.endCoordinate.time = divTime + parseInt(this.endCoordinate.time);
                            }
                            this.addShiftData(color);
                            // Manually reupdate for refresh worktime
                            this.stageUpdate();
                            // Add mouse over Tooltip event
                            let time = "";
                            let coordinate = {};
                            // Drag left to right
                            time = `${super.int2Time(sTime)}-${super.int2Time(eTime)}`;
                            coordinate.x = this.startCoordinate.x;
                            coordinate.y = this.startCoordinate.y;
                            this.addTooltipEvent(shape, this.startCoordinate.index, time, coordinate);
                        });
                        startFlg = true;
                    }
                    let end = this.u.getCoordinateByClick(event);
                    this.endCoordinate = this.u.findNearestElementByCoordinate(this.endCoordinate, this.cell, end);
                    this.addBarByClick();
                });
            }
        });
        // When dropping outside of canvas.
        $(document).on("mouseup", ()=>$("#timeBar").off("mousemove"));
    }
    /**
     * Drawing bar by drag and drop
     */
    addBarByClick(){
        if(this.tempShape){
            this.stage.removeChild(this.tempShape);
            this.stageUpdate();
        }
        let start = this.startCoordinate;
        let end = this.endCoordinate;
        // Switch Time if drag & drop from left to right
        if(parseInt(this.startCoordinate.time,10) > parseInt(this.endCoordinate.time,10)){
            start = this.endCoordinate;
            end = this.startCoordinate;
        }
        this.tempShape = this.drawLine(
            start.index,
            parseInt(start.time,10),
            parseInt(end.time,10),
            "1",
            end.over
        );
    }
    /**
    * deleteShiftData
    *
    * @param  {str} time  time to delete
    * @param  {str} sId  To identify the row.
    * @param  {object} shift  Object of shift to modify
    */
    deleteShiftData(time, index){
        let shift = this.v.shiftTime;
        //let firstIndex = super.getIndexFromStartId(index);
        // Access to Object rooted to Index Key
        for(let key in shift){
            if(key !== index)continue;
            let indexObj = shift[key];
            // Access to Object rooted to Name Key
            for(let name in indexObj){
                let nameObj = indexObj[name];
                // Access to Object rooted to Color Key
                for(let i in nameObj){
                    let obj = nameObj[i];
                    // Time in shift object
                    let shiftTime = Object.values(obj)[0];
                    if(shiftTime === time){
                        // Delete from index when there is only 1 defined time
                        if(nameObj.length == 1){
                            delete shift[key];
                        }else{
                            nameObj.splice(i,1);
                        }
                    }
                }
            }
        }
    }
    /**
    * addShiftData
    *
    * @param  {str} color : Color of Line
    */
    addShiftData(color){
        // Data to insert
        let index = this.startCoordinate.index;
        let sTime = super.int2Time(this.startCoordinate.time);
        let eTime = "";
        if(!this.endCoordinate.over){
            eTime = super.int2Time(this.endCoordinate.time);
        }else{
            let temp = parseInt(this.endCoordinate.time,10);
            eTime = super.int2Time(temp);
        }
        // Not to add in data
        if(sTime === eTime)return;
        let name = super.getNameFromId(index);
        let colorTimeObj = {};
        colorTimeObj[`${color}`] = `${sTime}-${eTime}`;
        // Seach index
        let shift = this.v.shiftTime;
        let isExist = Object.keys(shift).indexOf(index);
        // index exist
        if(isExist>=0){
            let nameArr = Object.values(shift[index]);
            nameArr[0].push(colorTimeObj);
        // index Not exist
        }else{
            let nameObj = {};
            let arr = [colorTimeObj];
            nameObj[`${name}`] = arr;
            shift[`${index}`] = nameObj;
        }
    }
    /**
     * Delete Bar from matched id
     * @return {[type]} [description]
     */
    deleteIdBar(id){
        let barNum = this.stage.children.length;
        for(let i = 0; i < barNum; i++){
            // If index matches to stage name
            if(Object.keys(this.stage.children[i].name).join("") === id){
                //console.log(this.stage.children[i]);
                $(this.stage.children[i]).off("click");
                this.stage.removeChild(this.stage.children[i]);
                // Decrease the length of array
                barNum--;
                i--;
            }
        }
        this.stageUpdate();
    }
}
