import { Relay } from 'nostr-relay'

// 创建一个 relay（内存存储，也可以接 SQLite）
const relay = new Relay({
  port: process.env.PORT || 3000, // Render 会分配 PORT
  persist: false                  // 设置为 true 时可接 SQLite
})

// 启动
relay.listen().then(() => {
  console.log(`Relay running at ws://localhost:${relay.port}`)
})
