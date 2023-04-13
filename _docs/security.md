## Example Usage

To generate a new encryption key:

```javascript
const encryption = require("encryption");

const key = encryption.generateEncryptionKey();
console.log(key); // Example output: "3nF7pCzBqoVxMklJB95dYtEsvgjhiA6"
```

To encrypt a message using the generated key:

```javascript
const encryption = require("encryption");

const key = "3nF7pCzBqoVxMklJB95dYtEsvgjhiA6";
const message = "This is a secret message";

const encryptedMessage = encryption.encrypt(message, key);
console.log(encryptedMessage); // Example output: "6Fh3nJ1E6pZG6a8l6h5w6RJMH6a1c5g2"
```

To decrypt the encrypted message using the same key:

```javascript
const encryption = require("encryption");

const key = "3nF7pCzBqoVxMklJB95dYtEsvgjhiA6";
const encryptedMessage = "6Fh3nJ1E6pZG6a8l6h5w6RJMH6a1c5g2";

const decryptedMessage = encryption.decrypt(encryptedMessage, key);
console.log(decryptedMessage); // Example output: "This is a secret message"
```