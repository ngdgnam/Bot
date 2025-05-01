const request = require("request");
const fs = require("fs")
const axios = require("axios")
module.exports.config = {
  name: "ôm",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kaneki",
  description: "Ôm người bạn tag",
  commandCategory: "Tình Yêu",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async({ api, event, Threads, global }) => {
  var link = [    
"https://i.postimg.cc/CLVYFKnW/anime-hug-38.gif",
"https://i.postimg.cc/rFCTzLSz/anime-hug-cry-gif-4.gif",
"https://i.postimg.cc/ZnzkKfnr/g-DEE1-QGHMm-MAOJRb4-Q-ehq-F7ckhc-VAUyzog-C6-VP5v-LTa-MUavlk-FTEj-Yp-SFl-BPX1c-SJXC7qzk-D4s-Huogbit.gif",
"https://i.postimg.cc/sDyFk0tz/r9aU2xv.gif",
   ];
   var mention = Object.keys(event.mentions);
     let tag = event.mentions[mention].replace("@", "");
    if (!mention) return api.sendMessage("Vui lòng tag 1 người", threadID, messageID);
   var callback = () => api.sendMessage({body:`${tag}` + ` 𝗢̂𝗺𝗺 𝗺𝘂̣𝘁 𝗰𝗮́𝗶 𝗻𝗲̀ 💓`,mentions: [{tag: tag,id: Object.keys(event.mentions)[0]}],attachment: fs.createReadStream(__dirname + "/cache/ảnh/omhug.gif")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/ảnh/omhug.gif"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/ảnh/omhug.gif")).on("close",() => callback());
   }