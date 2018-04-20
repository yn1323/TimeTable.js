module.exports = {
    "env": {
        "es6": true,
        "browser": true,
        "node": true,
        "jQuery" : true
    },
    "globals": {
        //"var1": true,
        //"var2": false
    }
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "no-console"        : "allow",
        "indent"            : ["error","tab"],
        "linebreak-style"   : ["error","windows"],
        "quotes"            : ["error","double"],
        "semi"              : ["error","always"]
        }
}