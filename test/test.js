describe("class Caluculation",()=>{
    let c = new Calculation();    // eslint-disable-line
    describe("twoTime2Int()",()=>{
        it("OpeningTime < ClosingTime (\"12:00\"-\"15:00\") return [720,900]",()=>{
            expect(c.twoTime2Int("12:00-15:00")[0]).toBe(720);
            expect(c.twoTime2Int("12:00-15:00")[1]).toBe(900);
        });
        it("OpeningTime > ClosingTime (\"16:00\"-\"03:00\") return [960,1620]",()=>{
            expect(c.twoTime2Int("16:00-03:00")[0]).toBe(960);
            expect(c.twoTime2Int("16:00-03:00")[1]).toBe(1620);
        });
        it("OpeningTime = ClosingTime (\"08:00\"-\"08:00\") return [480,480]",()=>{
            expect(c.twoTime2Int("08:00-08:00")[0]).toBe(480);
            expect(c.twoTime2Int("08:00-08:00")[1]).toBe(480);
        });
    });
    describe("time2Int()",()=>{
        it("Only Hour (\"13:00\") return 780",()=>{
            expect(c.time2Int("13:00")).toBe(780);
        });
        it("Hour & Minute (\"13:42\") return 822",()=>{
            expect(c.time2Int("13:42")).toBe(822);
        });
    });
    describe("int2Time()",()=>{
        it("Before 24:00 (780) return \"13:00\"",()=>{
            expect(c.int2Time(780)).toBe("13:00");
        });
        it("After 24:00 (1500) return \"01:00\"",()=>{
            expect(c.int2Time(1500)).toBe("01:00");
        });
    });
    describe("toDoubleDigits()",()=>{
        it("1 digit(5) return \"05\"",()=>{
            expect(c.toDoubleDigits("5")).toBe("05");
        });
        it("2 digits(15) return \"15\"",()=>{
            expect(c.toDoubleDigits("15")).toBe("15");
        });
    });
    describe("countColumns()",()=>{
        it("Dividable value(0,1440,60) return 24",()=>{
            expect(c.countColumns(0,1440,60)).toBe(24);
        });
        it("Undividable value(0,1432,60) return 24(Ceiled value)",()=>{
            expect(c.countColumns(0,1432,60)).toBe(24);
        });
    });
});
describe("class Message",()=>{
    let m = new Message();    // eslint-disable-line
    describe("setErrorMessage()", ()=>{
        it("retrun Object",()=>{
            expect(m.setErrorMessage()).toEqual(jasmine.any(Object));
        });
    });
});
describe("class Validation",()=>{
    let v = new Validation();    // eslint-disable-line
    describe("checkExistance()",()=>{
        it("No Null Data (\"12:00\",\"15:00\",\"15\") return true", ()=>{
            expect(v.checkExistance("12:00","15:00","15")).toBeTruthy();
        });
        it("sTime is Null (null,\"15:00\",\"15\") return false", ()=>{
            expect(v.checkExistance(null,"15:00","15")).toBeFalsy();
        });
        it("eTime is Null (\"12:00\",null,\"15\") return false", ()=>{
            expect(v.checkExistance("12:00",null,"15")).toBeFalsy();
        });
        it("dTime is Null (\"12:00\",\"15:00\",null) return false", ()=>{
            expect(v.checkExistance("12:00","15:00",null)).toBeFalsy();
        });
    });
    describe("checkStartTime()",()=>{
        it("Correct format (\"12:00\") return 720", ()=>{
            expect(v.checkStartTime("12:00")).toBe(720);
        });
        it("Not correct format (\"1200\") return 0", ()=>{
            expect(v.checkStartTime("1200")).toBe(0);
        });
    });
    describe("checkEndTime()",()=>{
        it("Correct format (\"12:00\") return 720", ()=>{
            expect(v.checkEndTime("12:00")).toBe(720);
        });
        it("Not correct format and Start Time > End Time (\"02:00\") return 1560", ()=>{
            // Make condition of Start Time > End Time
            gVal.START_TIME = 720;    // eslint-disable-line
            expect(v.checkEndTime("02:00")).toBe(1560);
        });
        it("Not correct format (\"1200\") return 0", ()=>{
            expect(v.checkEndTime("1200")).toBe(0);
        });
    });
    describe("checkDivTime()",()=>{
        it("Not correct format (\"AA\") return 0", ()=>{
            expect(v.checkDivTime("AA")).toBe(0);
        });
        it("Correct format (\"30\") return 30", ()=>{
            expect(v.checkDivTime("30")).toBe(30);
        });
    });
    describe("checkShiftTime()",()=>{
        let correct = {
            "1" : {
                "Mr.B": [
                    {"1" : "10:00-12:00"},
                    {"2" : "13:00-14:00"},
                    {"9" : "17:00-20:00"},
                ]
            },
            "2" : {
                "Jason Paige": [
                    {"3" : "11:00-12:45"},
                    {"5" : "14:00-19:30"},
                ]
            },
            "500" : {
                "Turtle": [
                    {"8" : "13:00-19:00"}
                ]
            },
            "3" : {
                "No2": [
                    {"1" : "10:00-12:00"},
                    {"2" : "13:00-14:00"},
                    {"9" : "17:00-20:00"},
                ]
            },
            "4" : {
                "Mrs.Smith": [
                    {"8" : "10:00-13:30"},
                    {"7" : "14:00-17:30"},
                ]
            },
            "5" : {
                "Mario": [
                    {"1" : "12:00-15:30"}
                ]
            },
            "6" : {
                "John": [
                    {"0" : "15:00-22:30"}
                ]
            },
            "7" : {
                "Apple": [
                    {"9" : "15:00-18:30"}
                ]
            },
            "9" : {
                "MR.JSON": [
                    {"2" : "09:00-12:59"},
                    {"4" : "15:00-15:20"},
                    {"7" : "17:00-17:30"},
                ]
            },
        };
        let incorrect = {no: "15"};
        it("Correct format (var correct) return var correct", ()=>{
            expect(v.checkShiftTime(correct)).toBe(correct);
        });
        it("Not correct format (var correct) return null", ()=>{
            expect(v.checkShiftTime(incorrect)).toBe(null);
        });
    });
    describe("checkOption()",()=>{
        let correct = {
            option: {
                workTime: true,
                bgcolor: ["#00ffff"],
                selectBox: {
                    "2" : "Jason Paige",
                    "3" : "Mr.Jason",
                    "25" : "Mrs.Jason"
                }
            }
        };
        let incorrect = {
            option: {
                workTime: "500",
                bgcolor: ["#00ffff"],
                selectBox: {
                    "2" : "Jason Paige",
                    "3" : "aa",
                    "25" : "Mrs.Jason"
                }
            }
        };
        it("Correct format (var correct) return var correct", ()=>{
            expect(v.checkOption(correct["option"])).toBe(correct["option"]);
        });
        it("Not correct format (var incorrect) return null", ()=>{
            expect(v.checkOption(incorrect["option"])).toBe(null);
        });
    });
    describe("checkUndefinedArray()",()=>{
        it("No empty in Array ([1,2,3]) return true", ()=>{
            expect(v.checkUndefinedArray([1,2,3])).toBeTruthy();
        });
        it("Null in Array ([1,2,null]) return false", ()=>{
            expect(v.checkUndefinedArray([1,2,null])).toBeFalsy();
        });
    });
    describe("timeValidation()",()=>{
        it("time is String and correct format (\"15:30\") return true", ()=>{
            expect(v.timeValidation("15:30")).toBeTruthy();
        });
        it("time is not String(15) return false", ()=>{
            expect(v.timeValidation(15)).toBeFalsy();
        });
        it("Length is not 5 (\"3:15\") return false", ()=>{
            expect(v.timeValidation("3:15")).toBeFalsy();
        });
        it("Delimete is not in 3rd palce (\"135:4\") return false", ()=>{
            expect(v.timeValidation("135:4")).toBeFalsy();
        });
        it("Hour is not number (\"a1:15\") return false", ()=>{
            expect(v.timeValidation("a1:15")).toBeFalsy();
        });
        it("Minute is not number (\"15:1k\") return false", ()=>{
            expect(v.timeValidation("15:1k")).toBeFalsy();
        });
        it("Hour is less than 0 (\"-5:15\") return false", ()=>{
            expect(v.timeValidation("-5:15")).toBeFalsy();
        });
        it("Hour is more than 23 (\"24:15\") return false", ()=>{
            expect(v.timeValidation("24:15")).toBeFalsy();
        });
        it("Minute is less than 0 (\"15:-1\") return false", ()=>{
            expect(v.timeValidation("5:-1")).toBeFalsy();
        });
        it("Minute is more than 60 (\"08:61\") return false", ()=>{
            expect(v.timeValidation("08:61")).toBeFalsy();
        });
    });
    describe("divTimeValidation()",()=>{
        it("divTime is String and correct format (\"15\") return true", ()=>{
            expect(v.divTimeValidation("15")).toBeTruthy();
        });
        it("divTime is not number (\"1h\") return false", ()=>{
            expect(v.divTimeValidation("1h")).toBeFalsy();
        });
        it("divTime is less than 1 (\"0\") return false", ()=>{
            expect(v.divTimeValidation("0")).toBeFalsy();
        });
        it("divTime is more than 60 (\"61\") return false", ()=>{
            expect(v.divTimeValidation("61")).toBeFalsy();
        });
        it("divTime is 1,2,3,4,5,6,10,12,15,20,30, or 60 return true", ()=>{
            expect(v.divTimeValidation("1")).toBeTruthy();
            expect(v.divTimeValidation("2")).toBeTruthy();
            expect(v.divTimeValidation("3")).toBeTruthy();
            expect(v.divTimeValidation("4")).toBeTruthy();
            expect(v.divTimeValidation("5")).toBeTruthy();
            expect(v.divTimeValidation("6")).toBeTruthy();
            expect(v.divTimeValidation("10")).toBeTruthy();
            expect(v.divTimeValidation("12")).toBeTruthy();
            expect(v.divTimeValidation("15")).toBeTruthy();
            expect(v.divTimeValidation("20")).toBeTruthy();
            expect(v.divTimeValidation("30")).toBeTruthy();
            expect(v.divTimeValidation("60")).toBeTruthy();
        });
    });
    describe("shiftValidation()",()=>{
        let correct = {
            "1" : {
                "AA": [
                    {"1" : "10:00-12:00"},
                    {"2" : "13:00-14:00"},
                    {"9" : "17:00-20:00"},
                ]
            }
        };
        let colorNum = {
            "1" : {
                "AA": [
                    {"100" : "10:00-12:00"},
                    {"2" : "13:00-14:00"},
                    {"9" : "17:00-20:00"},
                ]
            }
        };
        let time = {
            "1" : {
                "AA": [
                    {"1" : "10:0012:00"},
                    {"2" : "13:00-14:00"},
                    {"9" : "17:00-20:00"},
                ]
            }
        };
        it("Correct format (var correct) return true", ()=>{
            expect(v.shiftValidation(correct)).toBeTruthy();
        });
        it("color format is not correct (var colorNum) return false", ()=>{
            expect(v.shiftValidation(colorNum)).toBeFalsy();
        });
        it("timet format is not correcrt (var time) return false", ()=>{
            expect(v.shiftValidation(time)).toBeFalsy();
        });
    });
    describe("shiftColorKeyValidation()",()=>{
        it("Correct Format (\"5\") return true", ()=>{
            expect(v.shiftColorKeyValidation("5")).toBeTruthy();
        });
        it("Not string (5) return false", ()=>{
            expect(v.shiftColorKeyValidation(5)).toBeFalsy();
        });
        it("More than 1 digit (\"15\") return false", ()=>{
            expect(v.shiftColorKeyValidation(15)).toBeFalsy();
        });
        it("Not number (\"A\") return false", ()=>{
            expect(v.shiftColorKeyValidation("A")).toBeFalsy();
        });
        it("color number should be 0 ~ 9 return true", ()=>{
            expect(v.shiftColorKeyValidation("-1")).toBeFalsy();
            expect(v.shiftColorKeyValidation("0")).toBeTruthy();
            expect(v.shiftColorKeyValidation("9")).toBeTruthy();
            expect(v.shiftColorKeyValidation("10")).toBeFalsy();
        });
    });
    describe("shiftTimeValidation()",()=>{
        it("Correct Format (\"10:00-16:00\") return true", ()=>{
            expect(v.shiftTimeValidation("10:00-16:00")).toBeTruthy();
        });
        it("Not Srting (720) return false", ()=>{
            expect(v.shiftTimeValidation(720)).toBeFalsy();
        });
        it("Length is not 11 (\"3:15-12:00\") return false", ()=>{
            expect(v.shiftTimeValidation("3:15-12:00")).toBeFalsy();
        });
        it("Delimeter is not - (\"10:00/15:00\") return false", ()=>{
            expect(v.shiftTimeValidation("10:00/15:00")).toBeFalsy();
        });
        it("Start time is not correct (\"10:a0-15:00\") return false", ()=>{
            expect(v.shiftTimeValidation("10:a0-15:00")).toBeFalsy();
        });
        it("End time is not correct (\"10:00-15:b0\") return false", ()=>{
            expect(v.shiftTimeValidation("10:00-15:b0")).toBeFalsy();
        });
    });
    describe("optionValidation()",()=>{
        let correct = {
            option: {
                workTime: true,
                bgcolor: ["#00ffff"],
                selectBox: {
                    "2" : "Jason Paige",
                    "3" : "Mr.Jason",
                    "25" : "Mrs.Jason"
                }
            }
        };
        let workTimeBool = {
            option: {
                workTime: "true",
                bgcolor: ["#00ffff"],
                selectBox: {
                    "2" : "Jason Paige",
                    "3" : "Mr.Jason",
                    "25" : "Mrs.Jason"
                }
            }
        };
        let colorCodeString = {
            option: {
                workTime: true,
                bgcolor: "0az",
                selectBox: {
                    "2" : "Jason Paige",
                    "3" : "Mr.Jason",
                    "25" : "Mrs.Jason"
                }
            }
        };
        let colorCodergb = {
            option: {
                workTime: true,
                bgcolor: [23,255,255],
                selectBox: {
                    "2" : "Jason Paige",
                    "3" : "Mr.Jason",
                    "25" : "Mrs.Jason"
                }
            }
        };
        let selectBoxValue = {
            option: {
                workTime: true,
                bgcolor: ["#00ffff"],
                selectBox: {
                    "2" : 56,
                    "3" : "Mr.Jason",
                    "25" : "Mrs.Jason"
                }
            }
        };

        it("Correct format (var correct) return true", ()=>{
            expect(v.optionValidation(correct["option"])).toBeTruthy();
        });
        it("workTime is not boolean (\"var workTimeBool\") return false", ()=>{
            expect(v.optionValidation(workTimeBool["option"])).toBeFalsy();
        });
        it("Color Code is not color (\"var colorCodeString\") return false", ()=>{
            expect(v.optionValidation(colorCodeString["option"])).toBeFalsy();
        });
        it("Color Code is not Hex (\"var colorCodergb\") return false", ()=>{
            expect(v.optionValidation(colorCodergb["option"])).toBeFalsy();
        });
        it("Select box Value is not String (\"var selectBoxValue\") return false", ()=>{
            expect(v.optionValidation(selectBoxValue["option"])).toBeFalsy();
        });
    });
});
describe("class TimeTable2",()=>{
    let t = new TimeTable2();    // eslint-disable-line
    describe("createSelectBox()",()=>{
        it("Select Box object return Selectbox tag as String", ()=>{
            let obj = {
                selectBox: {
                    "2" : "Jason Paige",
                    "3" : "Mr.Jason",
                    "25" : "Mrs.Jason"
                }
            };
            let correct = "<select class=\"timeTableSelectbox\"><option value=\"2\">Jason Paige</option><option value=\"3\">Mr.Jason</option><option value=\"25\">Mrs.Jason</option></select>";
            expect(t.createSelectBox(obj["selectBox"])).toBe(correct);
        });
    });
});
