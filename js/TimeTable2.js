"use strict";
let gVal = {};
gVal.START_TIME = null;
gVal.END_TIME = null;
gVal.DIV_TIME = null;
gVal.SHIFT = null;
gVal.OPTION = null;
gVal.SELECTOR = null;
// Decare Utility class
// Class for calculation
class Calculation{
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
}
// Class to manage messages
class Message{
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
class Validation extends Message{
    constructor(){
        super();
        this.calc = new Calculation();
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
// Util functions to set bar
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

// Intial class to be called.
class TimeTable2{    // eslint-disable-line no-unused-vars
    constructor(data){
        let v = new Validation();
        // Flag for when this instance got error
        this.errFlg = true;
        // End if necessary parameter was missing
        if(!v.checkExistance(
            data["startTime"],
            data["endTime"],
            data["divTime"])
        )return false;
        v.startTime  = data["startTime"]; // Beginning Time
        v.endTime    = data["endTime"];   // Endint Time
        v.divTime    = data["divTime"];   // Unit to Divide time(minutes)
        v.shiftTime  = data["shift"];     // Time Table Data
        v.option     = data["option"];     // Other option
        // For final check of values
        let arr = [
            gVal.startTime,
            gVal.endTime,
            gVal.divTime,
            gVal.shiftTime,
            gVal.option
        ];
        // End if there was error in any parameter
        if(!v.checkUndefinedArray(arr))return false;

    }
    /**
     * Initial Function to be called
     * @return {[type]} [description]
     */
    init(){

    }
}

class Canvas extends Calculation{
    constructor(color,workTime){
        super();
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
        this.workTime = workTime;
        // Set option Color
        if(color){
            for(let i in color){
                this.color[i] = color[i];
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
    }
    /**
    * Process needs to be done after Table is appeded to html
    */
    init(){
        this.measureCellSize();
        this.setCanvasTag();
        this.stage = new createjs.Stage(this.canvasSelector);
        // For creating bar by drag&drop
        this.stage.addEventListener("stagemousedown", this.handleDown);
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
        // End cell will be different depends on worktime column
        let last = (this.workTime)?$(".TimeTable td:last").prev():$(".TimeTable td:last");
        let lastCell  = this.getCoordinate(last);
        // Absolute coordinate & Add Tab tags coordinate
        this.canvasTag.x = firstCell.x;
        this.canvasTag.y = firstCell.y;
        // Add cell size
        this.canvasTag.width = lastCell.x - firstCell.x + this.cell.width;
        this.canvasTag.height = lastCell.y - firstCell.y + this.cell.height;
        let canvas = $("<canvas>",{id:"timeBar"});
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
        this.canvasSelector = $("#timeBar").get(0);
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
    drawLine(sId,eId,color,over){
        let [sc,ec] = this.calculateLineCoordinate(sId,eId,over);
        let barColor = this.color[parseInt(color,10)];
        // => is delimeter of coordinate
        let shape = new createjs.Shape().set({name:`${sId}=>${eId}`});
        shape.graphics
            .setStrokeStyle(10)
            .beginStroke(barColor)
            .moveTo(sc.x,sc.y)
            .lineTo(ec.x,ec.y)
            .endStroke();
        this.stage.addChild(shape);
        this.stage.update();
        return shape;
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
    calculateLineCoordinate(sId,eId,over){
        // Coordinates to reaturn
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
        return [sc,ec];
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
    /**
    * addMouseOverTooltip - Add event to display Tooltip & delete bar
    *
    * @param  {shape} select selector of shape
    * @param  {str} time    time to display
    * @param  {obj} sId     Coordinate to display tool tip and find bar when deleting
    * @param  {obj} shift   To change shift object when deleting bar
    */
    addTooltipEvent(shape, time, sId, shift){
        $(shape).on("click",()=>{
            // Shifting Pointing part of Tool tip
            let yToShift = this.cell.height - 5;
            // Coordinate of Tooltip to Display
            let toolTipToDisplay = super.getCoordinate(`#${sId}`);
            let prevToolTip = null;
            // Delete tool tip and return when same bar is clicked
            if($("#timeTableToolTip").length){
                prevToolTip = super.getCoordinate("#timeTableToolTip");
                prevToolTip.y -= yToShift;
                $("#timeTableToolTip").remove();
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
                    top : toolTipToDisplay.y + yToShift
                });
            let deleteButton = $("<button class=\"toolTipDelete\">×</button>");
            // Add Event to delete bar and also Tool tip
            $(deleteButton).on("click",()=>{
                this.stage.removeChild(shape);
                $("#timeTableToolTip").remove();
                $(shape).off("click");
                this.deleteShiftData(time, sId, shift);
                this.stage.update();
            });
            $(dom).append(deleteButton);
            $(".TimeTable").append(dom);
        });
    }
    /**
    * deleteShiftData
    *
    * @param  {str} time  time to delete
    * @param  {str} sId  To identify the row.
    * @param  {object} shift  Object of shift to modify
    */
    deleteShiftData(time, sId, shift){
        let index = super.getIndexFromStartId(sId);
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
}
