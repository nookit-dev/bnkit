# Node.js Arduino Interface

This module provides a simple way to interface with an Arduino board using Node.js.

## Installation

Use npm to install the module:

```
npm install node-arduino-interface
```

## Usage

### `createArduinoInterface(options: ArduinoOptions): { onData(callback: (data: string) => void), write(data: string): Promise<void> }`

Creates a new Arduino interface with the specified options. Returns an object with two methods: `onData` and `write`.

- `options` (`ArduinoOptions`): Options to configure the Arduino interface. Required fields:
  - `port` (`string`): The device path for the Arduino board, e.g. "/dev/ttyACM0".
- `onData(callback: (data: string) => void)`: Sets a callback function to be called when new data is received from the Arduino board.
  - `callback` (`function`): The function to be called. The argument is the received data as a string.
- `write(data: string): Promise<void>`: Writes data to the Arduino board.
  - `data` (`string`): The data to send to the board.
  - Returns a Promise that resolves when the data has been sent.

### `listPorts(): Promise<Array<{ path: string; manufacturer: string }>>`

Returns a list of available serial ports.

- Returns a Promise that resolves to an array of objects with two fields: `path` and `manufacturer`.

## Example

```javascript
import { createArduinoInterface } from "node-arduino-interface";

const arduino = createArduinoInterface({ port: "/dev/ttyACM0" });

arduino.onData((data: string) => {
  console.log(`Received data from Arduino: ${data}`);
});

arduino.write("Hello Arduino!");
```

## License

This module is released under the [MIT License](LICENSE).