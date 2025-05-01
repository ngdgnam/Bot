const axios = require('axios');
const moment = require('moment');

module.exports.config = {
  name: "tt",
  version: "1.0.0",
  hasPermission: 0,
  credits: "", 
  description: "Lấy thông tin chi tiết tài khoản TikTok qua ID",
  commandCategory: "Thành Viên",
  usages: "tt + username",
  cooldowns: 5,
};

const originalCredits = "";
module.exports.run = async function({ api, event, args }) {
  if (module.exports.config.credits !== originalCredits) {
    return api.sendMessage("Nhìn Cái Lồn", event.threadID);
  }
  if (!args[0]) {
    return api.sendMessage("Vui lòng nhập Username của tài khoản TikTok.\n", event.threadID);
  }  
  const tiktokId = args[0];
  const apiUrl = `https://api.sumiproject.net/tiktok?info=${tiktokId}`;
  try {
    const response = await axios.get(apiUrl);
    const data = response.data.data;
    if (data) {
      let resultMessage = "╭──────TikTok Info───────⭓\n";
      
      resultMessage += "┌ 👤 Người Dùng\n";
      resultMessage += `├ Tên : ${data.user.nickname}\n`;
      resultMessage += `├ ID: ${data.user.id}\n`;
      resultMessage += `├ Username: ${data.user.uniqueId}\n`;
      resultMessage += `├ Tiểu sử: ${data.user.signature}\n`;
      resultMessage += `├ Tích xanh: ${data.user.verified ? "Có" : "Không"}\n`;
      resultMessage += `└─ Kênh Youtube: ${data.user.youtube_channel_title}\n\n`;
      
      resultMessage += "┌ 📊 Thống Kê\n";
      resultMessage += `├ Người theo dõi: ${data.stats.followerCount}\n`;
      resultMessage += `├ Đang theo dõi: ${data.stats.followingCount}\n`;
      resultMessage += `├ Số video: ${data.stats.videoCount}\n`;
      resultMessage += `├ Lượt thích: ${data.stats.heartCount}\n`;
      resultMessage += `└─ Lượt trả thích: ${data.stats.diggCount}\n\n`;

      resultMessage += "╰─────────────⭓";

      api.sendMessage(resultMessage, event.threadID);
    } else {
      api.sendMessage("Không tìm thấy thông tin hoặc có lỗi xảy ra.", event.threadID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("Có lỗi xảy ra khi lấy thông tin, có thể là do API.", event.threadID);
  }
};
