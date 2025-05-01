const request = require("request");
const fs = require("fs")
const axios = require("axios")
module.exports.config = {
  name: "hôn",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kaneki",
  description: "Hôn người bạn tag",
  commandCategory: "Tình Yêu",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async({ api, event, Threads, global }) => {
  var link = [    
"https://i.postimg.cc/yxDKkJyH/02d4453f3eb0a76a87148433395b3ec3.gif",
"https://i.postimg.cc/nLTf2Kdx/1483589602-6b6484adddd5d3e70b9eaaaccdf6867e.gif",
"https://i.postimg.cc/Wpyjxnsb/574fcc797b21e-1533876813029926506824.gif",
"https://i.postimg.cc/xdsT8SVL/kiss-anime.gif",
   ];
   var mention = Object.keys(event.mentions);
     let tag = event.mentions[mention].replace("@", "");
    if (!mention) return api.sendMessage("Vui lòng tag 1 người", threadID, messageID);
   var callback = () => api.sendMessage({body:`${tag}` + ` 𝗕𝗮𝗲 𝗰𝗵𝗼 𝗮𝗻𝗵 𝘁𝗵𝗼̛𝗺 𝗺𝗼̣̂𝘁 𝗰𝗮́𝗶, 𝗻𝗲̂́𝘂 𝗲𝗺 𝗸𝗵𝗼̂𝗻𝗴 𝘁𝗵𝗶́𝗰𝗵 𝘁𝗵𝗶̀ 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝘁𝗿𝗮̉ 𝗹𝗮̣𝗶 𝗮𝗻𝗵 𝗻𝗲̀ 💞`,mentions: [{tag: tag,id: Object.keys(event.mentions)[0]}],attachment: fs.createReadStream(__dirname + "/cache/ảnh/honkiss.gif")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/ảnh/honkiss.gif"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/ảnh/honkiss.gif")).on("close",() => callback());
   }