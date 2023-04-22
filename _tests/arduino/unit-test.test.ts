import { createArduinoInterface, listPorts } from "./arduino";
import { handleError } from "error-handler-validation";

// Mock SerialPort
jest.mock("serialport", () => ({
  list: jest.fn().mockResolvedValue([
    { path: "/dev/ttyACM0", manufacturer: "Arduino, LLC" },
  ]),
  SerialPort: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    write: jest.fn(),
  })),
}));

// Mock handleError function
jest.mock("error-handler-validation", () => ({
  handleError: jest.fn(),
}));

describe("createArduinoInterface", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a SerialPort object with the specified port and baud rate", () => {
    const arduino = createArduinoInterface({ port: "/dev/ttyACM0" });

    expect(arduino).toBeDefined();
    expect(arduino.onData).toBeDefined();
    expect(arduino.write).toBeDefined();
    expect(SerialPort).toHaveBeenCalledWith("/dev/ttyACM0", { baudRate: 9600 });
  });

  it("should call the onData callback function when data is received from the SerialPort", () => {
    const onDataMock = jest.fn();
    const arduino = createArduinoInterface({ port: "/dev/ttyACM0" });

    arduino.onData(onDataMock);

    const onDataCallback = SerialPort.mock.calls[0][1];
    onDataCallback(Buffer.from("Test data"));

    expect(onDataMock).toHaveBeenCalledWith("Test data");
  });

  it("should call the handleError function when an error occurs in the onData callback function", () => {
    const onErrorMock = jest.fn();
    const arduino = createArduinoInterface({ port: "/dev/ttyACM0" });

    arduino.onData(() => {
      throw new Error("Test error");
    });

    const onDataCallback = SerialPort.mock.calls[0][1];
    onDataCallback(Buffer.from("Test data"));

    expect(handleError).toHaveBeenCalledWith({
      type: "APIError",
      message: "Test error",
    });
  });

  it("should write data to the SerialPort and resolve the promise when successful", async () => {
    const arduino = createArduinoInterface({ port: "/dev/ttyACM0" });

    const writePromise = arduino.write("Test data");

    const writeCallback = SerialPort.mock.instances[0].write.mock.calls[0][1];
    writeCallback(null);

    await expect(writePromise).resolves.toBeUndefined();
  });

  it("should write data to the SerialPort and reject the promise when unsuccessful", async () => {
    const arduino = createArduinoInterface({ port: "/dev/ttyACM0" });

    const writePromise = arduino.write("Test data");

    const writeCallback = SerialPort.mock.instances[0].write.mock.calls[0][1];
    writeCallback(new Error("Write error"));

    await expect(writePromise).rejects.toEqual({
      type: "APIError",
      message: "Write error",
    });
  });
});

describe("listPorts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of ports with their paths and manufacturers", async () => {
    const portList = await listPorts();

    expect(portList).toEqual([{ path: "/dev/ttyACM0", manufacturer: "Arduino, LLC" }]);
    expect(SerialPort.list).toHaveBeenCalled();
  });

  it("should call the handleError function when an error occurs", async () => {
    SerialPort.list.mockRejectedValueOnce(new Error("List error"));
    const expectedError = { type: "APIError", message: "List error" };

    const portList = await listPorts();

    expect(portList).toEqual([]);
    expect(handleError).toHaveBeenCalledWith(expectedError);
  });
});