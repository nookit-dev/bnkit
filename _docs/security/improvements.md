## Improvements for generateEncryptionKey() function:

- Consider using a more secure random number generator instead of Math.random(). For example, use the cryptographic random number generator in the Node.js crypto module.
- Increase the length of the key to make it more secure. Depending on the use case, a 32-character key may not be long enough to prevent brute force attacks.
- Consider using a different character set that includes special characters and symbols to increase the possible combinations of the key, making it harder to guess.
- Add error handling in case the random number generator fails or the character set is empty.
- Ensure that the generated key is unique and has not been used before, if necessary for the specific use case.