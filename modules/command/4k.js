module.exports.config = {
  name: "4k",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "",
  description: "",
  commandCategory: "Tiện ích",
  usages: "[reply/link]",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args }) {
  const fs = global.nodemodule["fs-extra"];
  const axios = require('axios').default;
  const isLink = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(args[0]);
  var linkUp = (event.messageReply?.attachments?.[0]?.url) || (isLink ? args[0] : '');
  if (!linkUp) {
    return api.sendMessage('Vui lòng reply 1 ảnh hoặc nhập link ảnh!', event.threadID, event.messageID);
  }
  try {
    api.sendMessage("🔄 Đang tăng độ phân giải cho ảnh, chờ một chút...", event.threadID);
    if (isLink) {
      const response = await axios.get(linkUp, { responseType: "arraybuffer" });
      fs.writeFileSync(__dirname + `/cache/input_image.png`, Buffer.from(response.data, "binary"));
    } 
    else {
      const res = await axios.get(`https://api.sumiproject.net/imgur?link=${encodeURIComponent(linkUp)}`);
      linkUp = res.data.uploaded.image;
    }
    const upscaleRes = await axios.get(`https://www.hungdev.id.vn/ai/4k?apikey=HUNGDEV_ESmhnJ6Mem&url=${encodeURIComponent(linkUp)}`);
    const upscaleImageLink = upscaleRes.data.data; 
    const imageResponse = await axios.get(upscaleImageLink, { responseType: "arraybuffer" });
    fs.writeFileSync(__dirname + `/cache/upscaled_image.png`, Buffer.from(imageResponse.data, "binary"));
    return api.sendMessage({
      body: `Ảnh đã được làm nét xong!`,
      attachment: fs.createReadStream(__dirname + `/cache/upscaled_image.png`)
    }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/upscaled_image.png`), event.messageID);
  } catch (e) {
    return api.sendMessage(`Đã xảy ra lỗi: ${e.message}`, event.threadID, event.messageID);
  }
};
