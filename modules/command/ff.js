const axios = require('axios');

module.exports.config = {
  name: "ff",
  version: "1.0.0",
  hasPermission: 0,
  credits: "", 
  description: "Lấy thông tin chi tiết của tài khoản Free Fire qua ID",
  commandCategory: "Thành Viên",
  usages: "ff + uid",
  cooldowns: 5,
};

const originalCredits = "";
module.exports.run = async function({ api, event, args }) {
  if (module.exports.config.credits !== originalCredits) {
    return api.sendMessage("Nhìn Cái Lồn", event.threadID);
  }
  if (!args[0]) {
    return api.sendMessage("Vui lòng nhập ID của tài khoản Free Fire.", event.threadID);
  }  
  const ffId = args[0];
  const apiUrl =`https://api.scaninfo.vn/freefire/info/?id=${ffId}&key=vay500k`;
  try {
    const response = await axios.get(apiUrl);
    const data = response.data;
    if (data) {
      let resultMessage = "⭓─────Info Free Fire─────⭓\n";

      resultMessage += "┌ 👤 Người Dùng\n";
      resultMessage += `├─ Tên: ${data["Account Name"]}\n`;
      resultMessage += `├─ ID: ${data["Account UID"]}\n`;
      resultMessage += `├─ Level: ${data["Account Level"]} (Exp: ${data["Account XP"]})\n`;
      resultMessage += `├─ Khu vực: ${data["Account Region"]}\n`;
      resultMessage += `├─ Like: ${data["Account Likes"]}\n`;
      resultMessage += `├─ Giới tính: ${data["Account Language"] === 'Language_VIETNAMESE' ? 'Nam' : 'Không xác định'}\n`;
      resultMessage += `├─ Uy Tín: ${data["Account Honor Score"]}\n`;
      resultMessage += `└─ Chữ ký: ${data["Account Signature"]}\n\n`;

      resultMessage += "┌ 🎮 Hoạt Động\n";
      resultMessage += `├─ Thẻ BP: ${data["Account Booyah Pass"]}\n`;
      resultMessage += `├─ Số huy hiệu BP: ${data["Account Booyah Pass Badges"]}\n`;
      resultMessage += `├─ Ngày tạo tài khoản: ${data["Account Create Time (GMT 0530)"]}\n`;
      resultMessage += `└─ Lần đăng nhập cuối: ${data["Account Last Login (GMT 0530)"]}\n\n`;

      if (data["Equipped Pet Information"]) {
        const petInfo = data["Equipped Pet Information"];
        resultMessage += "┌ 🐾 Thông Tin Pet\n";
        resultMessage += `├─ Tên Pet: ${petInfo["Pet Name"]}\n`;
        resultMessage += `├─ Loại Pet: ${petInfo["Pet Type"]}\n`;
        resultMessage += `├─ Level Pet: ${petInfo["Pet Level"]}\n`;
        resultMessage += `└─ EXP Pet: ${petInfo["Pet XP"]}\n\n`;
      }

      if (data["Guild Information"]) {
        const guildInfo = data["Guild Information"];
        const leaderInfo = data["Guild Leader Information"];
        resultMessage += "┌ 🛡️ Quân Đoàn\n";
        resultMessage += `├─ Tên: ${guildInfo["Guild Name"]}\n`;
        resultMessage += `├─ ID: ${guildInfo["Guild ID"]}\n`;
        resultMessage += `├─ Level: ${guildInfo["Guild Level"]}\n`;
        resultMessage += `├─ Thành viên: ${guildInfo["Guild Current Members"]}/${guildInfo["Guild Capacity"]}\n`;
        resultMessage += `└─ Chủ Quân Đoàn:\n`;
        resultMessage += `    ├─ Tên: ${leaderInfo["Leader Name"]}\n`;
        resultMessage += `    ├─ ID: ${leaderInfo["Leader UID"]}\n`;
        resultMessage += `    ├─ Level: ${leaderInfo["Leader Level"]} (Exp: ${leaderInfo["Leader XP"]})\n`;
        resultMessage += `    ├─ Ngày tạo tài khoản: ${leaderInfo["Leader Ac Created Time (GMT 0530)"]}\n`;
        resultMessage += `    └─ Lần đăng nhập cuối: ${leaderInfo["Leader Last Login Time (GMT 0530)"]}\n`;
      }

      api.sendMessage(resultMessage, event.threadID);
    } else {
      api.sendMessage("Không tìm thấy thông tin hoặc có lỗi xảy ra.", event.threadID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("Có lỗi xảy ra khi lấy thông tin tài khoản.", event.threadID);
  }
};
