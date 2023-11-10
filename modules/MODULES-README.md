# BNK Modules

## Overview

Bun Nook Kit is structured as a modular toolkit, most modules try to keep reliance of other modules to a minimum, however where possible make it easy to interface between modules. This design facilitates flexibility, reusability, and maintainability, ensuring that each module can be developed, updated, and replaced independently without affecting the core functionality of the system.

## How Modules Connect to Bun Nook Kit

Each module in Bun Nook Kit, such as the auth module, is connected through a well-defined interface and follows specific conventions and patterns to ensure compatibility and ease of integration. Here's how the connection process typically works:

1. **Module Exporting:** Modules are designed to expose their functionality via an `index.ts` file, which acts as a clear entry point. This file exports the public API that the module offers, such as functions, classes, or constants.

2. **Project Importing:** The core of Bun Nook Kit imports these modules through their respective `index.ts` files. This way, the core system has access to all the functionalities provided by the modules and can utilize them as needed.

## Example: Connecting the Auth Module

Here's a simplified example of how the auth module connects to Bun Nook Kit:

```typescript
// In the auth module's index.ts
export { createSecurityToken, verifyToken } from './security-token';

// using just the auth module from BNK stack
import { createSecurityToken, verifyToken } from '@bnk/module/auth';

// Usage of the auth module's functionality
async function initializeAuth() {
  const token = await createSecurityToken(3600); // Create a token valid for 1 hour
  // Further implementation...
}
```

By following this standardized method of connection, Bun Nook Kit ensures that each module can be developed and maintained in isolation, promoting a robust and scalable architecture.

### Single Release For All Modules
When there is a new release the modules are published as a single modules installed as `@bnk/core`
Plugins contain other peer dependencies, so are not considered a core module. Those are installed seperately `bun add @bnk/react` for example.