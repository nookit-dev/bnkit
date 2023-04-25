## Functions

### `createArduinoInterface(options: ArduinoOptions)`

Creates an interface to communicate with an Arduino device over a serial port.

- Input: `options` - An object containing the `port` string and optional `baudRate` number.
- Output: An object containing `onData` and `write` functions.

### `onData(callback: (data: string) => void)`

Registers a callback function to be called when data is received from the Arduino.

- Input: `callback` - A function that accepts a string parameter.

### `write(data: string): Promise<void>`

Writes data to the Arduino.

- Input: `data` - A string to be sent to the Arduino.
- Output: A promise which resolves when the data has been successfully written.

### `listPorts(): Promise<Array<{ path: string; manufacturer: string }>>`

Lists all available serial ports on the system.

- Output: A promise which resolves to an array of objects containing the `path` and `manufacturer` of each available port.