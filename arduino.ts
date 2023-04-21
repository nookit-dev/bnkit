import { handleError } from "error-handler-validation";

export type ArduinoOptions = {
  port: string;
  baudRate?: number;
};

export function createArduinoInterface({
  port,
  baudRate = 9600,
}: ArduinoOptions) {
  const serialPort = new (require("serialport"))(port, {
    baudRate: baudRate,
  });

  function onData(callback: (data: string) => void) {
    serialPort.on("data", (data: Buffer) => {
      try {
        callback(data.toString());
      } catch (error: any) {
        handleError({ type: "APIError", message: error?.message });
      }
    });
  }

  function write(data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      serialPort.write(data, (error: Error) => {
        if (error) {
          reject(handleError({ type: "APIError", message: error.message }));
        } else {
          resolve();
        }
      });
    });
  }

  return { onData, write };
}

//  example usage:
// import { createArduinoInterface } from "./arduino";

// const arduino = createArduinoInterface({ port: "/dev/ttyACM0" });

// arduino.onData((data: string) => {
//   console.log(`Received data from Arduino: ${data}`);
// });

// Send data to the Arduino
// arduino.write("Hello Arduino!");
