const request = require("request");
const fs = require("fs")
const axios = require("axios")
module.exports.config = {
  name: "đấm",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "huy hoàng và hoàng",
  description: "Đấm Người Bạn Muốn",
  commandCategory: "Thành Viên",
  usages: "@tag",
  cooldowns: 5,
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
        const request = require('request')
                const fs = require('fs')
                  var mention = Object.keys(event.mentions)[0];
let tag = event.mentions[mention].replace("@", "");
        var link = [
          "https://i.imgur.com/PrTvtfk.gif",
          "https://i.imgur.com/NCPTYvE.gif",
          "https://i.imgur.com/zmndZZb.gif"
             ];
   var callback = () => api.sendMessage({body: `${tag}\nĐấm nè đau hong 🤕` , mentions: [{
          tag: tag,
          id: Object.keys(event.mentions)[0]
        }],
  attachment: fs.createReadStream(__dirname + "/cache/đấm.gif")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/đấm.gif"));
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/đấm.gif")).on("close",() => callback());
   };