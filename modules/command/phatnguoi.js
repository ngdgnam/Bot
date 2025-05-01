const axios = require('axios');
const moment = require('moment');

module.exports.config = {
  name: "phatnguoi",
  version: "1.0.0",
  hasPermission: 0,
  credits: "",
  description: "Lấy thông tin chi tiết về vi phạm giao thông qua biển số xe ô tô ",
  commandCategory: "Tiện ích",
  usages: "phatnguoi + biển số xe ô tô [ví dụ phatnguoi 51G69353]",
  cooldowns: 5,
};

const originalCredits = "";
module.exports.run = async function({ api, event, args }) {
  if (module.exports.config.credits !== originalCredits) {
    return api.sendMessage("Nhìn Cái Lồn", event.threadID);
  }
  if (!args[0]) {
    return api.sendMessage("Vui lòng nhập biển số xe.\n", event.threadID);
  }
  const licensePlate = args[0];
  const apiUrl = `https://api.sumiproject.net/checkpn?phatnguoi=${licensePlate}`;
  try {
    const response = await axios.get(apiUrl);
    const data = response.data.data;
    const dataInfo = response.data.data_info;

    if (data.length > 0) {
      let resultMessage = "╭───Thông Tin Vi Phạm Giao Thông───⭓\n";

      data.forEach((violation, index) => {
        resultMessage += `┌ 🚗 Vi Phạm ${index + 1}\n`;
        resultMessage += `├ Biển số: ${violation["Biển kiểm soát"]}\n`;
        resultMessage += `├ Màu biển: ${violation["Màu biển"]}\n`;
        resultMessage += `├ Loại phương tiện: ${violation["Loại phương tiện"]}\n`;
        resultMessage += `├ Thời gian vi phạm: ${violation["Thời gian vi phạm"]}\n`;
        resultMessage += `├ Địa điểm vi phạm: ${violation["Địa điểm vi phạm"]}\n`;
        resultMessage += `├ Hành vi vi phạm: ${violation["Hành vi vi phạm"]}\n`;
        resultMessage += `├ Trạng thái: ${violation["Trạng thái"]}\n`;
        resultMessage += `├ Đơn vị phát hiện vi phạm: ${violation["Đơn vị phát hiện vi phạm"]}\n`;
        resultMessage += `└─ Nơi giải quyết vụ việc: ${violation["Nơi giải quyết vụ việc"].join("\n")}\n\n`;
      });

      resultMessage += "┌ 📊 Thống Kê\n";
      resultMessage += `├ Tổng số vi phạm: ${dataInfo.total}\n`;
      resultMessage += `├ Chưa xử phạt: ${dataInfo.chuaxuphat}\n`;
      resultMessage += `├ Đã xử phạt: ${dataInfo.daxuphat}\n`;
      resultMessage += `└─ Time cập nhật: ${dataInfo.latest}\n\n`;
      resultMessage += "╰─────────────⭓";

      api.sendMessage(resultMessage, event.threadID);
    } else {
      api.sendMessage("Không tìm thấy thông tin hoặc có lỗi xảy ra.", event.threadID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("Có lỗi xảy ra khi lấy thông tin, có thể là do chưa có vi phạm nào.", event.threadID);
  }
};