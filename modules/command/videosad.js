let isVideoSadEnabled = true;

module.exports.config = {
  name: "videosad",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "includes",
  description: "chỉ cần nhắn Video buồn, video sad ",
  commandCategory: "Video",
  usages: "chỉ cần nhắn Video buồn, video sad ",
  cooldowns: 0,
  dependencies: {
    "fs-extra": "",
    "request": ""
  }
};

module.exports.handleEvent = async ({ api, event, Threads }) => {
  if (!isVideoSadEnabled) return;
  
  if (event.body.indexOf("video sad") == 0 || event.body.indexOf("Video buồn") == 0 || event.body.indexOf("video buồn") == 0) {
    const axios = global.nodemodule["axios"];
    const request = global.nodemodule["request"];
    const fs = global.nodemodule["fs-extra"];

    api.sendMessage("Hình như bạn đang buồn :(\nChờ mình một chút nha.", event.threadID, event.messageID);

    var link = [
      "https://i.imgur.com/26tBGNz.mp4",
      "https://i.imgur.com/bKahRyR.mp4",
      "https://i.imgur.com/nsAeBu9.mp4",
      "https://i.imgur.com/YBEqu4T.mp4",
      "https://i.imgur.com/Zq5iniZ.mp4",
      "https://i.imgur.com/eAue5PQ.mp4",
      "https://i.imgur.com/p0uF1JZ.mp4",
      "https://i.imgur.com/c9d9k8V.mp4",
      "https://i.imgur.com/Q7k7En2.mp4",
      "https://i.imgur.com/17QK9Ym.mp4",
      "https://i.imgur.com/RgXyYf6.mp4",
      "https://i.imgur.com/TPCfN2n.mp4",
      "https://i.imgur.com/5wFRzh6.mp4",
      "https://i.imgur.com/eKg22cS.mp4",
      "https://i.imgur.com/jPRR3s6.mp4",
      "https://i.imgur.com/LfW7EHr.mp4",
      "https://i.imgur.com/zy7sr6N.mp4",
      "https://i.imgur.com/jaKWRn4.mp4",
      "https://i.imgur.com/92xJwzd.mp4",
      "https://i.imgur.com/bVJ4yC4.mp4",
      "https://i.imgur.com/7u6af0D.mp4",
      "https://i.imgur.com/77oeeE4.mp4",
      "https://i.imgur.com/VeJ3zDB.mp4"
    ];

    var callback = () => api.sendMessage({ body: `Số video hiện có: ${link.length}`, attachment: fs.createReadStream(__dirname + "/cache/vdsad.mp4") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/vdsad.mp4"), event.messageID);
    return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/vdsad.mp4")).on("close", () => callback());
  }
};

module.exports.run = async ({ api, event, args }) => {
  if (args[0] === "on") {
    isVideoSadEnabled = true;
    api.sendMessage("Tự động gửi video sad khi nhắn 'Video buồn, video sad' đã được bật.", event.threadID, event.messageID);
  } else if (args[0] === "off") {
    isVideoSadEnabled = false;
    api.sendMessage("Tự động gửi video sad khi nhắn 'Video buồn, video sad' đã được tắt.", event.threadID, event.messageID);
  } else {
    api.sendMessage("Sử dụng: /videosad on hoặc /videosad off", event.threadID, event.messageID);
  }
};
