import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Serve static HTML
app.use(express.static(path.join(__dirname, 'public')));

// 创建 WebSocket 服务
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('新客户端已连接');

  ws.on('message', (data) => {
    try {
      const { username, msg } = JSON.parse(data);
      const full = `${username}：${msg}`;

      // 广播给所有客户端
      wss.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
          client.send(full);
        }
      });
    } catch (e) {
      console.log("格式错误:", e);
    }
  });

  ws.on('close', () => {
    console.log('客户端已断开连接');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`服务运行中，端口 ${PORT}`);
});
