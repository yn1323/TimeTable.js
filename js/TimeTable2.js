"use strict";
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
    * @param  {int} o   : openTime in parameter
    * {int} c   : closeTime in parameter
    * {int} d   : divTime in parameter
    * @return {int} columns   : columns(cells) of Table
    */
    countColumns(s,e,d){
        return (e - s) / d;
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
// Class to check validations
class Validation extends Message{
    /**
     * Check Existance of starttime, endtime, divtime
     * @param  {String} oTime Opening Time
     * @param  {String} cTime Closing Time
     * @param  {String} dTime Dividing Time
     * @return {boolean}
     */
    checkExistance(oTime,cTime,dTime){
        // flag to detect error(true: No error, false: Has error)
        let flg = true;
        try{
            // Check existance of startTime
            if(oTime == null)throw new Error(this.ermsg["NO_STARTTIME"]);
            // Check existance of endTime
            if(cTime == null)  throw new Error(this.ermsg["NO_ENDTIME"]);
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
     * @param  {String} time OpeningTime (ex."10:00")
     * @return {int} intTime Time in int
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


let v = new Validation();
let gVal = {
    get startTime() {return this.START_TIME;},
    set startTime(x){if(v.checkStartTime(x)) this.START_TIME = v.checkStartTime(x);},
    get endTime  () {return this.END_TIME;},
    set endTime  (x){if(v.checkEndTime  (x)) this.END_TIME   = v.checkEndTime(x);},
    get divTime  () {return this.DIV_TIME;},
    set divTime  (x){if(v.checkDivTime  (x)) this.DIV_TIME   = v.checkDivTime(x);},
    get shiftTime() {return this.SHIFT;},
    set shiftTime(x){if(v.checkShiftTime(x)) this.SHIFT      = v.checkShiftTime(x);},
    get option   () {return this.OPTION;},
    set option   (x){if(v.checkOption   (x)) this.OPTION     = v.checkOption(x);},
    get selector () {return this.SELECTOR;},
    set selector (x){this.SELECTOR = x;},
    get coordinate () {return this.COORDINATE;},
    set coordinate (x){this.COORDINATE = x;},
    get table () {return this.TABLE;},
    set table (x){this.TABLE = x;},
    get selectbox () {return this.SELECTBOX;},
    set selectbox (x){this.SELECTBOX = x;},
};
let aaa = "hoge";

/*
get endTime  () {return this.END_TIME;}
set endTime  (x){if(this.v.checkEndTime  (x)) this.END_TIME   = this.v.checkEndTime(x);}
get divTime  () {return this.DIV_TIME;}
set divTime  (x){if(this.v.checkDivTime  (x)) this.DIV_TIME   = this.v.checkDivTime(x);}
get shiftTime() {return this.SHIFT;}
set shiftTime(x){if(this.v.checkShiftTime(x)) this.SHIFT      = this.v.checkShiftTime(x);}
get option   () {return this.OPTION;}
set option   (x){if(this.v.checkOption   (x)) this.OPTION     = this.v.checkOption(x);}
get selector () {return this.SELECTOR;}
set selector (x){this.SELECTOR = x;}
get coordinate () {return this.COORDINATE;}
set coordinate (x){this.COORDINATE = x;}
get table () {return this.TABLE;}
set table (x){this.TABLE = x;}
get selectbox () {return this.SELECTBOX;}
set selectbox (x){this.SELECTBOX = x;}
*/

// Intial class to be called.
class TimeTable2{    // eslint-disable-line no-unused-vars
    constructor(data){
        // Flag for when this instance got error
        this.errFlg = true;
        // End if necessary parameter was missing
        if(!v.checkExistance())return false;
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
}
