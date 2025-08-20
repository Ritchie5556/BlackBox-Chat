import * as secp from "noble-secp256k1"
import { utils } from "noble-secp256k1";
import WebSocket from "ws";

const privateKeyBytes = secp.utils.randomPrivateKey();
const privateKey = Buffer.from(privateKeyBytes).toString("hex");

// 生成 Schnorr 公钥（32字节）
const publicKeyBytes = await secp.schnorr.getPublicKey(privateKeyBytes);
const publicKey = Buffer.from(publicKeyBytes).toString("hex");

console.log("私钥:", privateKey);
console.log("公钥:", publicKey);
//注释NoStr协议
/*
 {
    "id": "4376c65d2f232afbe9b882a35baa4f6fe8667c4e684749af565f981833ed6a65",
    "pubkey": "6e468422dfb74a5738702a8823b9b28168abab8655faacb6853cd0ee15deee93",
    "created_at": 1673347337,
    "kind": 1,
    "tags": [
        ["e", "3da979448d9ba263864c4d6f14984c423a3838364ec255f03c7904b1ae77f206"],
        ["p", "bf2376e17ba4ec269d10fcc996a4746b451152be9031fa48e74553dde5526bce"]
    ],
    "content": "Walled gardens became prisons, and nostr is the first step towards tearing down the prison walls.",
    "sig": "908a15e46fb4d8675bab026fc230a0e3542bfade63da02d542fb78b2a8513fcd0092619a2c8c1221e581946e0191f2af505dfdf8657a414dbca329186f009262"
  }
*/
// 将 Uint8Array 转 hex 字符串
function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
async function  getUserPrivateNode(event){
  const payload = [
    0,
    event.pubkey,
    event.created_at,
    event.kind,
    event.tags,
    event.content,
  ];
  const json = JSON.stringify(payload);
  const hash = await secp.utils.sha256(new TextEncoder().encode(json));
    return bytesToHex(hash)    
}
async function  setUserPrivateNode(content){
     const event={
        pubkey:publicKey,//用户的公钥
        created_at:Math.floor(Date.now()/1000), //创建时间
        kind:1 ,//事件
        tags:[],//标签
        content//内容
     }
     event.id=await getUserPrivateNode(event);//事件id
     const sigBytes=await secp.schnorr.sign(
        Buffer.from(event.id,"hex"),
        privateKeyBytes
    );//签名
     event.sig = Buffer.from(sigBytes).toString("hex");
     return  event;
}
//连接websocket
async function webSocketMessage(content){
    const ws=new WebSocket("wss://nostr.wine") //连接中继网络
    //启动
    ws.on("open",async()=>{
        const event=await setUserPrivateNode(content) 
        ws.send(JSON.stringify(["EVENT",event]));//发送到Relay节点上
        console.log("结果:",event)
        //ws.close();//关闭
    })
    ws.on("message",(data)=>{
       console.log("收到:",data) 
    })
    ws.on("error",(err)=>{
        console.log("连接错误，请重新连接",err)
    })
}
webSocketMessage("你好，我是一个测试连接，你是否看得到？")
