import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: process.env.PORT || 3000 });

wss.on("connection", (ws) => {
  console.log("client connected");

  ws.on("message", (msg) => {
    console.log("recv:", msg.toString());
    // 简单 echo 回去
    ws.send(`echo: ${msg}`);
  });
});

console.log("Relay running at ws://localhost:3000");
