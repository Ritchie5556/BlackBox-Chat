import { Relay } from "nostr-relay-js";

const PORT = process.env.PORT || 3000;

// 使用内存存储（生产可以接 MySQL/SQLite）
const relay = new Relay({
  storage: "memory", // 存储方式: memory/sqlite/mysql/postgres
});

// 启动 Relay
relay.listen(PORT, () => {
  console.log(`✅ Nostr relay running on ws://localhost:${PORT}`);
});
