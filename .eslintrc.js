module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "jquery" : true
    },
    "globals": {
        "TimeTable": true,
        "stage": false,
        "createjs": false
    },
    "extends": "eslint:recommended",
    "rules": {
        "no-console"      : ["error", { allow: ["warn", "error"] }],
        "indent"          : ["error",4],
        "linebreak-style" : ["error","windows"],
        "quotes"          : ["error","double"],
        "semi"            : ["error","always"]
    }
};
