export const websocketScript = `
<script>
    // Replace "ws://example.com" with your WebSocket server address
    const socket = new WebSocket("ws://example.com");
    
    // Connection opened
    socket.addEventListener("open", (event) => {
      console.log("WebSocket connection opened:", event);
      socket.send("Hello, WebSocket!");
    });
    
    // Listen for messages
    socket.addEventListener("message", (event) => {
      console.log("WebSocket message received:", event.data);
    });
    
    // Connection closed
    socket.addEventListener("close", (event) => {
      console.log("WebSocket connection closed:", event);
    });
    
    // Connection error
    socket.addEventListener("error", (event) => {
      console.error("WebSocket error:", event);
    });
    </script>
`;

const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebSocket Example</title>
</head>
<body>
  ${websocketScript}

  <div>
    // button to send message via websocket
    <button>Send message</button>
    

  </div>
</body>
</html>`;
