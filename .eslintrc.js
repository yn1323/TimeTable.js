module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  plugins: ["prettier", "svelte3"],
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  "extends": "eslint:recommended",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
    "module": false,
    "require": false,
    "process": false,
    "__dirname": false,
    "describe": false,
    "test": false,
    "expect": false,
    "TimeTable": false,
  },
  "parserOptions": {
    "ecmaVersion": 2019,
    "sourceType": "module"
  },
  "rules": {
    "eqeqeq": "warn",
    "quotes": ["warn", "single"]
  }
};