// server.js
import WebSocket, { WebSocketServer } from 'ws';
import { validateEvent } from 'nostr-tools';

const wss = new WebSocketServer({ port: 8080 });
console.log('Nostr relay running on ws://localhost:8080');

// 存储所有连接
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected. Total:', clients.size);

  ws.on('message', (message) => {
    try {
      const event = JSON.parse(message.toString());

      // 验证事件
      if (!validateEvent(event)) {
        ws.send(JSON.stringify({ ok: false, error: 'Invalid event' }));
        return;
      }

      // 广播给其他客户端
      for (const client of clients) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(event));
        }
      }
    } catch (e) {
      console.error('Error processing message:', e);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected. Total:', clients.size);
  });
});
