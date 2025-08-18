// server.js
import WebSocket, { WebSocketServer } from 'ws';
import { validateEvent } from '@nostr-relay/validator';

// 保存所有连接和事件
const clients = new Set();
const events = [];

// 创建 WebSocket 服务器
const wss = new WebSocketServer({ port: 8080 }, () => {
  console.log('Nostr relay started on ws://localhost:8080');
});

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('New client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());

      // 处理 Nostr 请求类型
      if (Array.isArray(data)) {
        const [type, subId, payload] = data;

        if (type === 'EVENT') {
          // 验证事件合法性
          if (validateEvent(payload)) {
            events.push(payload);
            console.log('Received valid event:', payload);

            // 广播给所有客户端
            broadcast(JSON.stringify(['EVENT', payload]));
          } else {
            console.log('Invalid event:', payload);
          }
        } else if (type === 'REQ') {
          // 订阅事件，简单实现：发送所有已存事件
          ws.send(JSON.stringify(['EVENT', events]));
        }
      }
    } catch (err) {
      console.error('Error parsing message:', err);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

function broadcast(msg) {
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  }
}
