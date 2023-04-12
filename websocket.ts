import { ServerWebSocket } from "bun";

export default useWebSockets = () => {
  return {
    open(ws: ServerWebSocket) {
      console.log("WebSocket connection opened");
    },
    message(ws: ServerWebSocket, message: unknown) {
      console.log("WebSocket message received:", message);

      // You can also send a response back to the connected client
      ws.send(`Server received: ${message}`);
    },
    close(ws: ServerWebSocket) {
      console.log("WebSocket connection closed");
      // You can add any cleanup code or resource release here.
    },
    error(ws: ServerWebSocket, error: Error) {
      console.error("WebSocket error:", error);
      // You can add any additional error handling or logging here.
    },
    drain(ws: ServerWebSocket) {
      console.log("WebSocket backpressure drained, ready for more data");
      // You can add any code to handle backpressure or resume sending data here.
    },
  };
};
