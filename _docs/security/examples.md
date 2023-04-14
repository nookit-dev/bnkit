## Examples of Using generateEncryptionKey() function

### Example 1:
```javascript
const encryptionKey = generateEncryptionKey();
console.log(encryptionKey);
```

Output:
```
sTlo4fx7sOwc2JmaV8yKtDgBe1pZkNhu
```


### Example 2:
```javascript
const encryptionKey = generateEncryptionKey();
console.log(`Your encryption key is: ${encryptionKey}`);
```

Output:
```
Your encryption key is: S5mLk1D6XgWcUzRvPtj0HfMwox8ZybC
```


### Example 3:
```javascript
const encryptionKey = generateEncryptionKey();
const encryptedData = encryptData('Hello World', encryptionKey);
const decryptedData = decryptData(encryptedData, encryptionKey);
console.log(`Original data: Hello World`);
console.log(`Encrypted data: ${encryptedData}`);
console.log(`Decrypted data: ${decryptedData}`);
```

Output:
```
Original data: Hello World
Encrypted data: 4edf29bbae80bb7ff0e677381d9a47efa48f8931b7f4b503c8e8eaed7870c0b7
Decrypted data: Hello World
```