## Encryption Key Generator Module

This module exports a function to generate a random encryption key consisting of 32 characters from a combination of uppercase letters, lowercase letters, and numbers.

### Installation

Install the module using npm:

```
npm install encryption-key-generator
```

### Usage

Import the module and call the `generateEncryptionKey` function to generate a random encryption key:

```javascript
const { generateEncryptionKey } = require('encryption-key-generator');
const key = generateEncryptionKey();
console.log(key); // example output: rG6lIkWfD8RnUZ9m1XsPoGLz05bV7cAY
```

### License

This module is released under the [MIT License](https://opensource.org/licenses/MIT). See LICENSE file for details.