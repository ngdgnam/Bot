const path = require('path');
const fs = require('fs');

module.exports.config = {
  name: 'thinh',
  version: '1.0.0',
  hasPermission: 0,
  credits: '',
  description: 'Random thính',
  commandCategory: 'Tìm kiếm',
  usages: '[]',
  cooldowns: 3,
  images: [],
};

const loadThinh = () => {
  const filePath = path.resolve(__dirname, '../../includes/datajson/thinh.json');
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('Tệp thinh.json không tồn tại.');
    }

    let data = fs.readFileSync(filePath, 'utf8');
    if (data.charCodeAt(0) === 0xFEFF) {
      data = data.slice(1);
    }

    const parsedData = JSON.parse(data);
    if (!Array.isArray(parsedData.thinh)) {
      throw new Error('Dữ liệu trong tệp thinh.json không hợp lệ.');
    }

    return parsedData.thinh;
  } catch (error) {
    console.error('Lỗi khi đọc thinh.json:', error.message);
    return [];
  }
};

module.exports.run = async function({ api, event }) {
  const thinh = loadThinh();
  if (thinh.length === 0) {
    return api.sendMessage("Không có dữ liệu nào trong tệp thinh.json.", event.threadID);
  }

  const randomThinh = thinh[Math.floor(Math.random() * thinh.length)];
  return api.sendMessage(randomThinh, event.threadID);
};
