const chalk = require('chalk');
const moment = require("moment-timezone");
const SPAM_THRESHOLD = 10; // Số lượng tin nhắn để xác định spam
const SPAM_TIMEFRAME = 3000; // Thời gian trong ms để kiểm tra spam (3 giây)
const LOG_COOLDOWN = 20000; // Thời gian trong ms để tạm dừng log (20 giây)
let messageCounts = {};
let isSpamming = false;
let cooldownTimer;

module.exports.config = {
  name: "console",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "Vtuan",
  description: "",
  commandCategory: "Admin",
  usages: "",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  const thính = require('./../../includes/datajson/poem.json');
  var poem = thính[Math.floor(Math.random() * thính.length)].trim();
  const { threadID, senderID } = event;
  if (senderID === global.data.botID || global.data.threadData.get(threadID)?.console === true) return;

  if (!messageCounts[threadID]) {
    messageCounts[threadID] = { count: 0, lastMessageTime: Date.now() };
  }
  const now = Date.now();
  let threadMessageCount = messageCounts[threadID];
  if (now - threadMessageCount.lastMessageTime <= SPAM_TIMEFRAME) {
    threadMessageCount.count++;
    if (threadMessageCount.count > SPAM_THRESHOLD) {
      if (!isSpamming) {
        console.log(chalk.red('Cảnh báo spam: console bị tạm dừng.'));
        isSpamming = true;
        if (cooldownTimer) clearTimeout(cooldownTimer);
        cooldownTimer = setTimeout(() => {
          console.log(chalk.green('console đã được kích hoạt trở lại.'));
          isSpamming = false;
        }, LOG_COOLDOWN);
      }
      threadMessageCount.lastMessageTime = now;
      return;
    }
  } else {
    threadMessageCount.count = 1;
    threadMessageCount.lastMessageTime = now;
    console.log(`[ ${poem} ]`)
  }
  if (!isSpamming) {
    const threadName = global.data.threadInfo.get(threadID)?.threadName || "Tên nhóm không xác định";
    const userName = await Users.getNameUser(senderID);
    const messageContent = event.body || "Ảnh/Video hoặc ký tự đặc biệt";
    console.log(
      chalk.hex("#DEADED")(`\n╭──────────────────────────⭓\n├─ Nhóm: ${threadName}`) + "\n" +
      chalk.hex("#C0FFEE")(`├─ User: ${userName}`) + "\n" +
      chalk.hex("#FFC0CB")(`├─ Nội dung: ${messageContent}`) + "\n" +
      chalk.hex("#FFFF00")(`├─ Time: ${moment.tz("Asia/Ho_Chi_Minh").format("LLLL")}\n╰──────────────────────────⭓\n`)
    );
  }
};

module.exports.run = async function ({ api, args, Users, event, Threads, utils, client }) {};