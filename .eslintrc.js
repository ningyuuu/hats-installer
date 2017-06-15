module.exports = {
  "parser": "babel-eslint",
  "extends": ["airbnb"],
  "plugins": [
    "import"
  ],
  "env": {
    "jquery": true,
    "mocha": true,
    "node": true
  },
  "globals": {
    "document": true,
    "window": true,
    "FileReader": true
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "rules": {
    "no-console": 0,
    "comma-dangle": ["error", "never"],
    "no-restricted-syntax": 0,
    "func-names": 0,
    "no-param-reassign": 0,
    "guard-for-in": 0,
    "max-len": [2, 120, 2]
  }
};