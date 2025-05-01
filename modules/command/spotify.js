const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "spotify",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "DongDev",
  description: "Tìm kiếm và tải nhạc trên Spotify",
  commandCategory: "Tìm kiếm",
  usages: "[]",
  images: [],
  cooldowns: 2,
};

async function searchSpotify(keywords, limit = 7) {
  try {
    const res = await axios.get(`https://subhatde.id.vn/spotify?q=${encodeURI(keywords)}`);
    return res.data.slice(0, limit); // Giới hạn kết quả tìm kiếm
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    throw error;
  }
}

async function downloadSpotify(url) {
  try {
    const res = await axios.get(`https://subhatde.id.vn/spotify/down?url=${encodeURI(url)}`);
    return res.data;
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports.run = async function ({ api, event, args }) {
  try {
    const keyword = args.join(" ");

    if (!keyword) {
      api.sendMessage("⚠️ Vui lòng nhập từ khóa để tìm nhạc trên Spotify", event.threadID, event.messageID);
      return;
    }

    const dataSearch = await searchSpotify(keyword);

    if (dataSearch.length === 0) {
      api.sendMessage(`❎ Không tìm thấy kết quả nào cho từ khóa: ${keyword}`, event.threadID, event.messageID);
      return;
    }

    const img = dataSearch.map(t => t.thumbnail);
    const image = [];
    for (let i = 0; i < img.length; i++) {
      const stream = (await axios.get(img[i], { responseType: "stream" })).data;
      image.push(stream);
    }

    const messages = dataSearch.map((item, index) => {
      return `\n${index + 1}. ${item.title} - Độ phổ biến: ${item.popularity} - Thời gian: ${item.duration}`;
    });

    const listTrack = {
      body: `\n${messages.join("\n")}\n\n📌 Reply (phản hồi) theo STT tương ứng để tải nhạc`,
      attachment: image,
    };

    api.sendMessage(listTrack, event.threadID, (error, info) => {
      global.client.handleReply.push({
        type: "choose",
        name: module.exports.config.name,
        author: info.senderID,
        messageID: info.messageID,
        dataTrack: dataSearch,
      });
    });
  } catch (error) {
    console.error(error);
    api.sendMessage("Lỗi: " + error.message, event.threadID);
  }
};

module.exports.handleReply = async function ({ event, api, handleReply }) {
  const { threadID: tid, body } = event;

  if (handleReply.type === 'choose') {
    const choose = parseInt(body);

    if (isNaN(choose)) {
      return api.sendMessage('⚠️ Vui lòng nhập 1 con số hợp lệ', tid);
    }

    if (choose > handleReply.dataTrack.length || choose < 1) {
      return api.sendMessage('❎ Lựa chọn không nằm trong danh sách', tid);
    }

    const chosenItem = handleReply.dataTrack[choose - 1];

    api.sendMessage(`🔄 Đang tải xuống bài hát "${chosenItem.title}"...`, tid);

    try {
      const downloadData = await downloadSpotify(chosenItem.url);

      if (downloadData.success) {
        const filePath = path.resolve(__dirname, `${chosenItem.title}.mp3`);

        // Download và lưu file MP3 từ link downloadUrl
        const writer = fs.createWriteStream(filePath);
        const response = await axios({
          url: downloadData.downloadUrl,
          method: 'GET',
          responseType: 'stream'
        });

        response.data.pipe(writer);

        writer.on('finish', () => {
          api.sendMessage({
            body: `🎧 Đang phát: ${downloadData.title}\n• Nghệ sĩ: ${downloadData.artist}\n• Album: ${downloadData.album}\n• Ngày phát hành: ${downloadData.released}`,
            attachment: fs.createReadStream(filePath)
          }, tid, (err, info) => {
            if (!err) {
              // Gỡ tin nhắn sau 10 giây
              setTimeout(() => {
                api.unsendMessage(handleReply.messageID); // Gỡ tin nhắn kết quả tìm kiếm
              }, 10000);

              // Xóa file sau khi gửi
              fs.unlinkSync(filePath);
            }
          });
        });

        writer.on('error', () => {
          api.sendMessage('❌ Có lỗi xảy ra khi tải file âm thanh. Vui lòng thử lại sau.', tid);
        });

      } else {
        api.sendMessage('❎ Không thể tải bài hát này. Vui lòng thử lại sau.', tid);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage('❌ Đã xảy ra lỗi khi tải xuống. Vui lòng thử lại.', tid);
    }
  }
};
