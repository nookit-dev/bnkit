To use this module, you can simply import the function and call it to generate a 32-character encryption key:

```typescript
import { generateEncryptionKey } from './encryptionUtils';

const key = generateEncryptionKey(); // returns a 32-character string
```

You can then use this key to encrypt and decrypt sensitive data in your application.