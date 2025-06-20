const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const fs = require("fs");
require("dotenv").config();

const sessionPath = "./session";
if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath);

// Decode base64 SESSION_ID
const sessionData = Buffer.from(process.env.SESSION_ID, "base64").toString("utf-8");
fs.writeFileSync(`${sessionPath}/creds.json`, sessionData);

const autoReplies = {
  "hi": "Kya hal hy mari jaan",
  "hlo": "aur suna kya hl hy meri jaan♥️ ka",
  "h": "kya hl hy janoo❤️",
  "good morning": "*Good Morning 🌅 janoo*",
  "good night": "*Good Night..🌉*",
  "bye": "*Bye bye....*",
  "by": "by jano",
  "aslam o alykum": "> *walykum salam ❤‍🔥🤌🏻*",
  "assalamualaikum": "Walikunmusalam mari jaan",
  "owner": "*Mr Hasan 🦅*",
  "hassan": "G jano💕",
  "hasan": "G jano💕",
  "sc": "*Yeah Lain Broo Enjoy Karo🌚*",
  "repo": "*Bass Dekhnaye Aye Ho Ya Kia🙈*",
  "hello": "*G ky hl chal meri jan💕*",
  "ok": "*Ok Mere Jaan*",
  "hmm": "> *Hamm.🌚*",
  "lanat": "*Lakhhhhhhhhhh Di Lanat 🙌😂*",
  "uff": "*💋 Hyee*",
  "love": "*Lub you two² 💗😁*",
  "acha": "OK meri jan",
  "thk tou suna": "mayn bhi thek ho jano",
  "kya hal hy": "mayn thek thak ho jano",
  "kya hl hy": "mayn thek thak ho jano",
  "main bhi thk": "kya chl raha hy❤️",
  "hla": "ok jan"
};

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const body = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").toLowerCase();

    if (autoReplies[body]) {
      await sock.sendMessage(from, { text: autoReplies[body] });
    }
  });

  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") {
      console.log("✅ Bot connected successfully!");
    }
  });
}

startBot();
