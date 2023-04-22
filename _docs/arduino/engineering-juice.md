## Functions

### createArduinoInterface

`({ port: string, baudRate?: number }): { onData: (callback: (data: string) => void) => void, write: (data: string) => Promise<void> }`

Creates an interface for connecting to and communicating with an Arduino device via serial port. Takes an object with `port` (string) and optional `baudRate` (number) properties. Returns an object with `onData` and `write` methods.

### listPorts

`() : Promise<Array<{ path: string; manufacturer: string }>>`

Lists available serial ports. Returns a Promise that resolves to an array of port objects with `path` (string) and `manufacturer` (string) properties.