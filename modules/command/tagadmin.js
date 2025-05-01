module.exports.config = {
  name: "tagadmin",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "Bạn có thể điền thông tin của mình hoặc nhóm phát triển vào đây",
  description: "tagadmin",
  commandCategory: "Admin",
  usages: "tagadmin",
  cooldowns: 1,
};

module.exports.handleEvent = function ({ api, event }) {
  if (!event.senderID || !event.mentions) return;
  if (event.senderID !== global.config.NDH[0]) {
    const adminID = global.config.NDH[0];
    if (Object.keys(event.mentions).includes(adminID)) {
      const msg = 'Dùng lệnh "/callad" để gửi tin nhắn đến Admin !';
      return api.sendMessage({ body: msg }, event.threadID, event.messageID);
    }
  }
};

module.exports.run = async function ({}) {};
