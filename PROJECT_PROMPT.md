# Project Prompt: Building a Type-Safe API Server with Bun Nookit (BNK)

We are building a robust, type-safe web application using Bun Nookit (BNK), a comprehensive toolkit for software development leveraging the power of Bun and TypeScript. Our project will focus on creating a simple but powerful API server with a SQLite database backend. Here are the key aspects of our project:

1. Server Setup:
   We'll use the @server module to create a type-safe HTTP server. Our server will handle various routes and utilize middleware for tasks like CORS handling.

2. Database Integration:
   We'll integrate SQLite using the @sqlite module, creating a type-safe database interface for our application.

3. API Endpoints:
   We'll create RESTful API endpoints for CRUD operations on a simple resource (e.g., "notes" or "todos").

4. Type Safety:
   Throughout the project, we'll leverage TypeScript and BNK's strong type inferencing to ensure type safety across our application.

5. Code Style and Formatting:
   We'll adhere to the Biome configuration specified in @biome.json, which includes using single quotes, spaces for indentation, and a line width of 120 characters.

Key Requirements:

1. Use the serverFactory from @server to set up the HTTP server.
2. Implement CORS middleware using configCorsMW from @server.
3. Use sqliteFactory from @sqlite to set up the database connection.
4. Create a table schema and CRUD operations using the SQLite utilities provided by BNK.
5. Implement error handling and proper HTTP status codes for API responses.
6. Ensure all code follows the Biome configuration and best practices.

When providing code snippets or recommendations, please:

- Use modern TypeScript features such as the 'satisfies' keyword for type checking.
- Utilize generics whenever possible to enhance type safety and reusability.
- Avoid using 'any' type; instead, use more specific types or 'unknown' if necessary.
- Leverage TypeScript's type inference capabilities to reduce explicit type annotations when possible.
- Use type predicates and type guards to narrow types when appropriate.
- Implement proper error handling with custom error types if needed.
- Use const assertions for literal types when applicable.

This project will showcase the power of BNK in creating a modular, type-safe, and efficient web application with zero third-party dependencies, adhering to Web API standards.

6. Testing:
   We'll use Bun's built-in test runner (bun:test) to write and run unit tests for our application components. Our tests will follow these guidelines:

   a. Use the `describe` function to group related tests.
   b. Use the `test` function for individual test cases.
   c. Use `expect` for assertions.
   d. Mock functions and dependencies when necessary using `mock`.
   e. Test both success and error scenarios.
   f. Use descriptive test names that explain the expected behavior.

   Example test structure:

   ```typescript
   import { describe, expect, test, mock } from 'bun:test'
   import { functionToTest } from './module-to-test'

   describe('functionToTest', () => {
     test('should behave correctly in normal conditions', () => {
       const result = functionToTest()
       expect(result).toBe(expectedValue)
     })

     test('should handle error conditions', () => {
       expect(() => functionToTest(invalidInput)).toThrow(ExpectedError)
     })

     test('should interact correctly with mocked dependencies', () => {
       const mockDependency = mock(() => 'mocked value')
       const result = functionToTest(mockDependency)
       expect(result).toBe('expected result')
       expect(mockDependency).toHaveBeenCalledTimes(1)
     })
   })
   ```

7. Test File Naming:
   Name test files with the `.test.ts` extension, placing them adjacent to the files they're testing.

8. Test Coverage:
   Aim for comprehensive test coverage, including edge cases and error scenarios.

When writing tests:

- Use async/await for asynchronous tests.
- Test both successful and error paths.
- Use mocks to isolate the unit being tested.
- Write clear, descriptive test names.
- Group related tests using `describe` blocks.
- Use `beforeEach` or `beforeAll` for common setup if needed.
- Avoid testing implementation details; focus on behavior.

This testing approach will ensure our application is robust, reliable, and maintainable.