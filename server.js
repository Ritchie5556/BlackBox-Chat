const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;

const server = require('http').createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    ws.send(`Echo: ${message}`);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
