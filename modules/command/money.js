module.exports.config = {
  name: "money",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "",
  description: "Kiểm tra tiền của bản thân, người khác hoặc tất cả thành viên trong nhóm",
  commandCategory: "Kiếm Tiền",
  usages: "money|money all",
  cooldowns: 0,
  usePrefix: false,
};

module.exports.run = async function ({ Currencies, api, event, Users }) {
  const { threadID, senderID, mentions, type, messageReply, body } = event;
  let targetID = senderID;
  if (body.toLowerCase().includes("all")) {
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const allMembers = threadInfo.participantIDs;
      let message = `Số tiền của các thành viên trong nhóm :\n\n`;

      let membersMoney = [];
      for (const memberID of allMembers) {
        const name = await Users.getNameUser(memberID);
        const userData = await Currencies.getData(memberID);
        const money = (userData && typeof userData.money !== 'undefined') ? userData.money : 0;
        membersMoney.push({ name, money });
      }
      membersMoney.sort((a, b) => b.money - a.money);
      for (const member of membersMoney) {
        if (member.money === Infinity) {
          message += `- ${member.name} có vô hạn tiền\n`;
        } else {
          message += `- ${member.name} có ${member.money} VND\n`;
        }
      }
      return api.sendMessage(message, threadID);
    } catch (e) {
      console.log(`Lỗi khi truy xuất tiền của tất cả thành viên:`, e);
      return api.sendMessage("Đã có lỗi xảy ra khi lấy thông tin nhóm. Vui lòng thử lại sau.", threadID);
    }
  }
  if (type === 'message_reply' && messageReply.senderID) {
    targetID = messageReply.senderID;
  } else if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  }

  const name = await Users.getNameUser(targetID);
  try {
    const userData = await Currencies.getData(targetID);
    if (!userData || typeof userData.money === 'undefined') {
      return api.sendMessage(`- ${name} có 0 VND`, threadID);
    }
    const money = userData.money;
    if (money === Infinity) {
      return api.sendMessage(`- ${name} có vô hạn tiền`, threadID);
    }
    return api.sendMessage({ body: `- ${name} có ${money} VND` }, threadID);
  } catch (e) {
    console.log(`Lỗi khi truy xuất tiền của người dùng ${targetID}:`, e);
    return api.sendMessage("Đã có lỗi xảy ra. Vui lòng thử lại sau.", threadID);
  }
};
