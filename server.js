const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static HTML
app.use(express.static(path.join(__dirname, 'public')));

// Broadcast
wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    try {
      const { username, msg } = JSON.parse(data);
      const full = `${username}：${msg}`;

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(full);
        }
      });
    } catch (e) {
      console.log("格式错误", e);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ 服务运行中，端口 ${PORT}`);
});
