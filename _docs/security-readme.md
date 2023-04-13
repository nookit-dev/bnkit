# Encryption Key Generator

This module exports a function `generateEncryptionKey` which generates a string of length 32 containing random characters from the set of uppercase and lowercase alphabets and numbers. 

## Installation

This module can be installed from NPM using the following command:

```
npm install encryption-key-generator
```

## Usage

```
const generateEncryptionKey = require('encryption-key-generator');

const key = generateEncryptionKey();
console.log(key);
// Output: "sldjflsghdfnlkfgds8w36498ryfhsd"
```

## API

### generateEncryptionKey()

This function generates and returns a string of length 32 containing random characters from the set of uppercase and lowercase alphabets and numbers.

## License

MIT