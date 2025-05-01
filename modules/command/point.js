const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "cache/points.json");

module.exports.config = {
  name: "point",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "",
  description: "Kiểm tra điểm của bản thân, người khác hoặc tất cả thành viên trong nhóm",
  commandCategory: "Kiếm Tiền",
  usages: "point|point all",
  cooldowns: 0,
  usePrefix: false,
};

module.exports.run = async function ({ api, event, Users }) {
  const { threadID, senderID, mentions, type, messageReply, body } = event;
  let targetID = senderID;

  // Đọc dữ liệu điểm từ file JSON
  let pointsData;
  try {
    pointsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    return api.sendMessage("Không thể đọc dữ liệu điểm. Vui lòng kiểm tra file.", threadID);
  }

  // Kiểm tra điểm của tất cả các thành viên trong nhóm
  if (body.toLowerCase().includes("all")) {
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const allMembers = threadInfo.participantIDs;
      let message = `Điểm của các thành viên trong nhóm :\n\n`;
      
      // Tạo mảng chứa thông tin điểm của tất cả thành viên
      let membersPoints = [];
      for (const memberID of allMembers) {
        const name = await Users.getNameUser(memberID);
        const points = pointsData[memberID] || 0;
        membersPoints.push({ name, points });
      }

      // Sắp xếp theo điểm từ cao đến thấp
      membersPoints.sort((a, b) => b.points - a.points);

      // Tạo thông báo
      for (const member of membersPoints) {
        message += `- ${member.name} có ${member.points} điểm\n`;
      }

      return api.sendMessage(message, threadID);

    } catch (e) {
      console.log(`Lỗi khi truy xuất điểm của tất cả thành viên:`, e);
      return api.sendMessage("Đã có lỗi xảy ra khi lấy thông tin nhóm. Vui lòng thử lại sau.", threadID);
    }
  }

  // Kiểm tra điểm của một người (reply hoặc tag)
  if (type === 'message_reply' && messageReply.senderID) {
    targetID = messageReply.senderID;
  } else if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  }

  const name = await Users.getNameUser(targetID);
  try {
    const points = pointsData[targetID] || 0;
    return api.sendMessage({ body: `- ${name} có ${points} điểm` }, threadID);
  } catch (e) {
    console.log(`Lỗi khi truy xuất điểm của người dùng ${targetID}:`, e);
    return api.sendMessage("Đã có lỗi xảy ra. Vui lòng thử lại sau.", threadID);
  }
};
