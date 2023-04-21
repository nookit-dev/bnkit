```typescript
import { createArduinoInterface, listPorts } from "./arduino";

// Get list of available ports
const ports = await listPorts();
console.log(ports);

// Connect to Arduino on specific port
const arduino = createArduinoInterface({ port: ports[0].path });

// Listen for incoming data from the Arduino
arduino.onData((data: string) => {
  console.log(`Received data from Arduino: ${data}`);
});

// Send data to the Arduino
await arduino.write("Hello Arduino!");
```