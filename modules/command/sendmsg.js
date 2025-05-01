let axios = require('axios')
let fs = require('fs')
let cc = require('moment-timezone')
module.exports.config = {
  name: "sendmsg",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "JRT",
  description: "Gửi lời nhắn cho các box",
  commandCategory: "Admin",
  usages: "sendmsg ID + lời nhắn",
  cooldowns: 5,
  dependencies: {
    "fs": "",
    "axios": "",
    "moment-timezone": ""
  }
}

let gio = cc.tz('Asia/Ho_Chi_Minh').format('HH:mm:ss - DD/MM/YYYY')

module.exports.run = async ({ api, event, handleReply, Users, args }) => {
  if (event.senderID != global.config.NDH[0]) return api.sendMessage(`Tuổi?`, event.threadID, event.messageID)
  let { threadID, messageID, senderID, type, messageReply } = event;
  let name = await Users.getNameUser(senderID)
  let threadInfo = await api.getThreadInfo(args[0])
  let NameText = threadInfo.threadName || await Users.getNameUser(args[0])
  let lydo = args.splice(1).join(" ")
  if (type == "message_reply") {
    if (messageReply.attachments[0].type == "audio") {
      path = __dirname + `/cache/snoti.m4a` ||  __dirname + `/cache/snoti.mp3`
    }
    if (messageReply.attachments[0].type == "photo") {
      path = __dirname + `/cache/snoti.jpg`
    }
    if (messageReply.attachments[0].type == "video") {
      path = __dirname + `/cache/snoti.mp4`
    }
    if (messageReply.attachments[0].type == "animated_image") {
      path = __dirname + `/cache/snoti.gif`
    }
    let abc = messageReply.attachments[0].url;
    let getdata = (await axios.get(`${abc}`, {
      responseType: 'arraybuffer'
    })).data
    fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'))
    api.sendMessage({body: `====== [ 𝐓𝐡𝐨̂𝐧𝐠 𝐁𝐚́𝐨 ] ======\n\n𝑩𝒂̣𝒏 𝒄𝒐́ 𝒕𝒊𝒏 𝒏𝒉𝒂̆́𝒏 𝒕𝒖̛̀ 𝒂𝒅𝒎𝒊𝒏: ${lydo}\n[🌐]→ 𝑻𝒊𝒎𝒆: ${gio}\n[📝]→ 𝑹𝒆𝒑𝒍𝒚 𝒕𝒊𝒏 𝒏𝒉𝒂̆́𝒏 𝒏𝒂̀𝒚 đ𝒆̂̉ 𝒑𝒉𝒂̉𝒏 𝒉𝒐̂̀𝒊!!!`, attachment: fs.createReadStream(path)}, args[0], (e, info) => {
      global.client.handleReply.push({
        type: "callad",
        name: this.config.name,
        author: threadID,
        ID: messageID,
        messageID: info.messageID
      })
    })
    api.sendMessage(`Đ𝒂̃ 𝒈𝒖̛̉𝒊 𝒕𝒉𝒂̀𝒏𝒉 𝒄𝒐̂𝒏𝒈 𝒕𝒊𝒏 𝒏𝒉𝒂̆́𝒏 đ𝒆̂́𝒏 ${NameText}`, threadID)
  } else {
    api.sendMessage({body: `====== [ 𝐓𝐡𝐨̂𝐧𝐠 𝐁𝐚́𝐨 ] ======\n\n𝑩𝒂̣𝒏 𝒄𝒐́ 𝒕𝒊𝒏 𝒏𝒉𝒂̆́𝒏 𝒕𝒖̛̀ 𝒂𝒅𝒎𝒊𝒏: ${lydo}\n[🌐]→ 𝑻𝒊𝒎𝒆: ${gio}\n[📝]→ 𝑹𝒆𝒑𝒍𝒚 𝒕𝒊𝒏 𝒏𝒉𝒂̆́𝒏 𝒏𝒂̀𝒚 đ𝒆̂̉ 𝒑𝒉𝒂̉𝒏 𝒉𝒐̂̀𝒊!!!`}, args[0], (e, info) => {
      global.client.handleReply.push({
        type: "callad",
        name: this.config.name,
        author: threadID,
        ID: messageID,
        messageID: info.messageID
      })
    })
    api.sendMessage(`Đ𝒂̃ 𝒈𝒖̛̉𝒊 𝒕𝒉𝒂̀𝒏𝒉 𝒄𝒐̂𝒏𝒈 𝒕𝒊𝒏 𝒏𝒉𝒂̆́𝒏 đ𝒆̂́𝒏 ${NameText}`, threadID)
  }
}

module.exports.handleReply = async ({ api, event, handleReply, Users }) => {
  let { body, threadID, senderID, messageID } = event;
  let index = body.split(" ")
  let gio = cc.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY - HH:mm:ss")
  let threadInfo = await api.getThreadInfo(threadID)
  let threadName = threadInfo.threadName || await Users.getNameUser(senderID)
  switch(handleReply.type) {
    case "callad": {
      let name = await Users.getNameUser(senderID)
      if (event.attachments.length != 0) {
        if (event.attachments[0].type == "audio") {
    path = __dirname + `/cache/snoti.m4a` ||  __dirname + `/cache/snoti.mp3`
  }
  if (event.attachments[0].type == "photo") {
    path = __dirname + `/cache/snoti.jpg`
  }
  if (event.attachments[0].type == "video") {
    path = __dirname + `/cache/snoti.mp4`
  }
  if (event.attachments[0].type == "animated_image") {
    path = __dirname + `/cache/snoti.gif`
  }
        let abc = event.attachments[0].url;
  let getdata = (await axios.get(`${abc}`, {
    responseType: 'arraybuffer'
  })).data
  fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'))
        api.sendMessage({body: `====== [ 𝐏𝐡𝐚̉𝐧 𝐡𝐨̂̀𝐢 ] ======\n\n𝑮𝒖̛̉𝒊 𝒕𝒖̛̀ 𝒏𝒉𝒐́𝒎: ${threadName}\n[🔎]→ 𝑻𝒆̂𝒏 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌: ${name}\n[❗]→ 𝑵𝒐̣̂𝒊 𝒅𝒖𝒏𝒈: ${index.join(" ")}\n[🌐]→ 𝑻𝒊𝒎𝒆: ${gio}`, attachment: fs.createReadStream(path)}, handleReply.author, (e, info) => {
          global.client.handleReply.push({
                type: "callad",
                name: this.config.name,
                author: threadID,
                ID: messageID,
                messageID: info.messageID
          })
        }, handleReply.ID)
      } else if (index.length != 0) {
        api.sendMessage({body: `====== [ 𝐏𝐡𝐚̉𝐧 𝐡𝐨̂̀𝐢 ] ======\n\n𝑮𝒖̛̉𝒊 𝒕𝒖̛̀ 𝒏𝒉𝒐́𝒎: ${threadName}\n[🔎]→ 𝑻𝒆̂𝒏 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌: ${name}\n[❗]→ 𝑵𝒐̣̂𝒊 𝒅𝒖𝒏𝒈: ${index.join(" ")}\n[🌐]→ 𝑻𝒊𝒎𝒆: ${gio}`}, handleReply.author, (e, info) => {
          global.client.handleReply.push({
                type: "callad",
                name: this.config.name,
                author: threadID,
                ID: messageID,
                messageID: info.messageID
          })
        }, handleReply.ID)
      }
    }
  }
}
