module.exports.config = {
    name: "uid",
    version: "1.0.0",
    hasPermssion: 0,
    Rent: 1,
    credits: "NLam182",
    description: "Kiểm tra UID của tài khoản Facebook",
    commandCategory: "Thành Viên",
    usages: "uid [reply/mention/link]",
    cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
    const { threadID, messageID, mentions, type, messageReply } = event;
  const uid = type === "message_reply" && messageReply ? messageReply.senderID : (mentions && Object.keys(mentions).length > 0) ? Object.keys(mentions)[0] : event.senderID;
  api.sendMessage(`${uid}`, threadID, messageID);

};
