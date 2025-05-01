const fs = require('fs');
const ytdl = require('@distube/ytdl-core');
const { resolve } = require('path');
const moment = require("moment-timezone");

async function downloadMusicFromYoutube(link, path) {
  const timestart = Date.now();
  if (!link) return 'Thiếu link';

  let resolveFunc, rejectFunc;
  const returnPromise = new Promise((resolve, reject) => {
    resolveFunc = resolve;
    rejectFunc = reject;
  });

  ytdl(link, {
    filter: format =>
      format.quality === 'tiny' && format.audioBitrate === 128 && format.hasAudio === true
  })
    .pipe(fs.createWriteStream(path))
    .on("close", async () => {
      try {
        const data = await ytdl.getInfo(link);
        const result = {
          title: data.videoDetails.title,
          dur: Number(data.videoDetails.lengthSeconds),
          viewCount: data.videoDetails.viewCount,
          likes: data.videoDetails.likes,
          uploadDate: data.videoDetails.uploadDate,
          sub: data.videoDetails.author.subscriber_count,
          author: data.videoDetails.author.name,
          timestart
        };
        resolveFunc(result);
      } catch (error) {
        rejectFunc(error);
      }
    });

  return returnPromise;
}

module.exports.config = {
  name: "sing",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "D-Jukie",
  description: "Phát nhạc thông qua link YouTube hoặc từ khoá tìm kiếm",
  commandCategory: "Tìm kiếm",
  usages: "[searchMusic]",
  cooldowns: 0,
}

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const axios = require('axios');
  const timeNow = moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss');
  const { createReadStream, unlinkSync, statSync } = require("fs-extra");

  try {
    const path = `${__dirname}/cache/sing-${event.senderID}.mp3`;
    const data = await downloadMusicFromYoutube('https://www.youtube.com/watch?v=' + handleReply.link[event.body - 1], path);

    if (fs.statSync(path).size > 87426214400) {
      return api.sendMessage('Không thể gửi file, vui lòng chọn bài khác', event.threadID, () => fs.unlinkSync(path), event.messageID);
    }

    const inputTime = data.uploadDate;
    const convertedTime = moment(inputTime).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');

    api.unsendMessage(handleReply.messageID);
    return api.sendMessage({
      body: `🎬 Title: ${data.title} (${this.convertHMS(data.dur)})\n📆 Ngày tải lên: ${convertedTime}\n🔍 Tên kênh: ${data.author} (${data.sub})\n🌐 Lượt xem: ${data.viewCount}\n⏳ Thời gian xử lý: ${Math.floor((Date.now() - data.timestart) / 1000)} giây\n⏰ Bây giờ là: ${timeNow}`,
      attachment: fs.createReadStream(path)
    }, event.threadID, () => fs.unlinkSync(path), event.messageID);
  } catch (e) {
    console.log(e);
  }
}

module.exports.convertHMS = function (value) {
  const sec = parseInt(value, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - (hours * 3600)) / 60);
  let seconds = sec - (hours * 3600) - (minutes * 60);
  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return (hours != '00' ? hours + ':' : '') + minutes + ':' + seconds;
}

module.exports.run = async function ({ api, event, args }) {
  let axios = require('axios');
  const timeNow = moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss');
  if (args.length == 0 || !args) return api.sendMessage('❎ Phần tìm kiếm không được để trống!', event.threadID, event.messageID);

  const keywordSearch = args.join(" ");
  const path = `${__dirname}/cache/sing-${event.senderID}.mp3`;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }

  if (args.join(" ").indexOf("https://") === 0) {
    try {
      const data = await downloadMusicFromYoutube(args.join(" "), path);
      if (fs.statSync(path).size > 8742621440000) {
        return api.sendMessage('⚠️ Không thể gửi file', event.threadID, () => fs.unlinkSync(path), event.messageID);
      }

      const inputTime = data.uploadDate;
      const convertedTime = moment(inputTime).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
      return api.sendMessage({
        body: `🎬 Title: ${data.title} (${this.convertHMS(data.dur)})\n📆 Ngày tải lên: ${convertedTime}\n🔍 Tên kênh: ${data.author} (${data.sub})\n🌐 Lượt xem: ${data.viewCount}\n⏳ Thời gian xử lý: ${Math.floor((Date.now() - data.timestart) / 1000)} giây\n⏰ Bây giờ là: ${timeNow}`,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    } catch (e) {
      console.log(e);
    }
  } else {
    try {
      const link = [];
      let msg = "";
      let num = 0;
      let numb = 0;
      const imgthumnail = [];
      const Youtube = require('youtube-search-api');
      const data = (await Youtube.GetListByKeyword(keywordSearch, false, 12)).items;

      for (let value of data) {
        link.push(value.id);
        const folderthumnail = __dirname + `/cache/${numb += 1}.png`;
        const linkthumnail = `https://img.youtube.com/vi/${value.id}/hqdefault.jpg`;
        const getthumnail = (await axios.get(`${linkthumnail}`, { responseType: 'arraybuffer' })).data;
        const datac = (await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${value.id}&key=AIzaSyBkmMKDjvpyTPXTgjCKKkAaTuF3TCpY1dI`)).data;

        fs.writeFileSync(folderthumnail, Buffer.from(getthumnail, 'utf-8'));
        imgthumnail.push(fs.createReadStream(__dirname + `/cache/${numb}.png`));

        const channel = datac.items[0].snippet.channelTitle;
        num += 1;

        msg += (`${num}. ${value.title}\n⏰ Time: ${value.length.simpleText}\n🌐 Tên Kênh: ${channel}\n\n`);
      }

      const body = `📝 Có ${link.length} kết quả trùng với từ khóa tìm kiếm của bạn:\n\n${msg}\nReply (phản hồi) tin nhắn này chọn một trong những tìm kiếm trên`;
      return api.sendMessage({
        attachment: imgthumnail,
        body: body
      }, event.threadID, (error, info) => global.client.handleReply.push({
        type: 'reply',
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        link
      }), event.messageID);
    } catch (e) {
      console.log(e);
    }
  }
}
