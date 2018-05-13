describe("class Caluculation",()=>{
    let c = new Calculation();
    describe("twoTime2Int()",()=>{
        it("OpeningTime < ClosingTime (\"12:00\"-\"15:00\")",()=>{
            expect(c.twoTime2Int("12:00-15:00")[0]).toBe(720);
            expect(c.twoTime2Int("12:00-15:00")[1]).toBe(900);
        });
        it("OpeningTime > ClosingTime (\"16:00\"-\"03:00\")",()=>{
            expect(c.twoTime2Int("16:00-03:00")[0]).toBe(960);
            expect(c.twoTime2Int("16:00-03:00")[1]).toBe(1620);
        });
        it("OpeningTime = ClosingTime (\"08:00\"-\"08:00\")",()=>{
            expect(c.twoTime2Int("08:00-08:00")[0]).toBe(480);
            expect(c.twoTime2Int("08:00-08:00")[1]).toBe(480);
        });
    });
    describe("time2Int()",()=>{
        it("Only Hour (\"13:00\")",()=>{
            expect(c.time2Int("13:00")).toBe(780);
        });
        it("Hour & Minute (\"13:42\")",()=>{
            expect(c.time2Int("13:42")).toBe(822);
        });
    });
    describe("int2Time()",()=>{
        it("Before 24:00 (780)",()=>{
            expect(c.int2Time(780)).toBe("13:00");
        });
        it("After 24:00 (1500)",()=>{
            expect(c.int2Time(1500)).toBe("01:00");
        });
    });
    describe("toDoubleDigits()",()=>{
    });
    describe("countColumns()",()=>{
    });
});
describe("class Message",()=>{
    let m = new Message();
    describe("setErrorMessage()", ()=>{
        it("retruns Object",()=>{
            expect(m.setErrorMessage()).toEqual(jasmine.any(Object));
        });
    });
});

describe("class Validation",()=>{
    describe("checkExistance()",()=>{
        let v = new Validation();
        it("returns true", ()=>{
            expect(v.checkExistance("12:00","15:00","15")).toBeTruthy();
        });
        it("returns false(otime Null)", ()=>{
            expect(v.checkExistance(null,"15:00","15")).toBeFalsy();
        });
        it("returns false(ctime Null)", ()=>{
            expect(v.checkExistance("12:00",null,"15")).toBeFalsy();
        });
        it("returns false(dtime Null)", ()=>{
            expect(v.checkExistance("12:00","15:00",null)).toBeFalsy();
        });
    });
});
