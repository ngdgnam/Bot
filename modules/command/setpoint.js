const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "cache/points.json");

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify({}));
}

module.exports.config = {
  name: "setpoint",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "",
  description: "Set điểm.",
  commandCategory: "Kiếm Tiền",
  usages: "setpoint",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args, Users, permssion }) {
  const { threadID, senderID, mentions, type, messageReply } = event;
  let targetID = senderID;
  let pointsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (type == 'message_reply') {
    targetID = messageReply.senderID;
  } else if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  }

  const name = await Users.getNameUser(targetID);
  const currentPoints = pointsData[targetID] || 0;
  const changePoints = parseInt(args[1]);

  try {
    switch (args[0]) {
      case "+":
        if (permssion < 2) return api.sendMessage("Bạn không đủ quyền", threadID);
        pointsData[targetID] = currentPoints + changePoints;
        api.sendMessage({
          body: `- Đã cộng thêm cho ${name} ${changePoints} điểm.\n- Tổng điểm hiện có: ${pointsData[targetID]} điểm.`
        }, threadID);
        break;

      case "-":
        if (permssion < 2) return api.sendMessage("Bạn không đủ quyền", threadID);
        pointsData[targetID] = currentPoints - changePoints;
        api.sendMessage({
          body: `- Đã trừ ${changePoints} điểm của ${name}.\n- Tổng điểm hiện có: ${pointsData[targetID]} điểm.`
        }, threadID);
        break;

      case "reset":
        if (permssion < 2) return api.sendMessage("Bạn không đủ quyền", threadID);
        pointsData[targetID] = 0;
        api.sendMessage({
          body: `- Điểm của ${name} đã được reset về 0.`
        }, threadID);
        break;

      default:
        return api.sendMessage(
          `1. /setpoint + [điểm] : Cộng điểm\n` +
          `2. /setpoint - [điểm] : Trừ điểm\n` +
          `3. /setpoint reset : Reset điểm\n` +
          `⚠ Nếu muốn set điểm cho người khác thì thêm @tag ở cuối lệnh.\n`,
          threadID
        );
    }
    fs.writeFileSync(filePath, JSON.stringify(pointsData, null, 2));
  } catch (e) {
    console.log(e);
  }
};
