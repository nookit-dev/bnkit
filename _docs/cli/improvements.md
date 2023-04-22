## Possible Improvements

- Add validation for user input to `getUserInput` function to ensure that the input is of the expected format.
- Use a library like `commander` or `yargs` to handle parsing command line arguments, as they provide a more robust and extensible way to define and handle arguments.
- Use the `inquirer` library for a more user-friendly command line interface that can handle prompts, checkboxes, and other input types.
- Add error handling and validation for file and directory operations, such as checking if a file exists before writing to it or ensuring that a directory exists before attempting to create a file in it.
- Use `Promise.all` to execute multiple asynchronous tasks concurrently instead of running them sequentially.
- Use `async` functions instead of callbacks for asynchronous operations to improve readability and maintainability of code.
- Use type-safe libraries like `io-ts` or `joi` for validating and parsing command line arguments to help avoid unexpected behavior and improve code quality.
- Define and use constants or enums instead of hardcoding string literals to improve maintainability and avoid typos.
- Write unit tests for each function to ensure that they behave as expected and to catch any regressions.