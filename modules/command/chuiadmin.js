module.exports.config = {
  name: "chuiadmin",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "ManhG",
  description: "Người chửi bot sẽ tự động bị ban khỏi hệ thống <3",
  commandCategory: "Admin",
  usages: "",
  cooldowns: 0,
  dependencies: {}
};

module.exports.handleReply = async function ({ api, args, Users, event, handleReply }) {
  const { threadID, messageID } = event;
  const { reason } = handleReply;
  var name = await Users.getNameUser(event.senderID);

  var arg = event.body.split(" ");
  var uidUser = handleReply.author;
  var nameU = handleReply.nameU;

  switch (handleReply.type) {
    case "reply":
      {
        var idad = global.config.ADMINBOT;
        for (let ad of idad) {
          api.sendMessage({
            body: "➝ Phản hồi từ người xúc phạm: " + name + ":\n " + event.body,
            mentions: [{
              id: event.senderID,
              tag: name
            }]
          }, ad, (e, data) => global.client.handleReply.push({
            name: this.config.name,
            messageID: data.messageID,
            messID: event.messageID,
            author: event.senderID,
            id: event.threadID,
            nameU: name,
            type: "banU"
          }))
        }
        break;
      }

    case "banU":
      {
        if (arg[0] == "unban" || arg[0] == "Unban") {

          let data = (await Users.getData(uidUser)).data || {};
          data.banned = 0;
          data.reason = null;
          data.dateAdded = null;
          await Users.setData(uidUser, { data });
          global.data.userBanned.delete(uidUser, 1);

          api.sendMessage(`➝ Thông Báo Từ Admin  ${name}\n\n ${nameU}\n➝ Bạn đã được gỡ ban từ Admin\n➝ Lần sau tái phạm sẽ phải nộp phạt để sử dụng bot.🥳`, uidUser, () =>
            api.sendMessage(`${global.data.botID}`, () =>
              api.sendMessage(`Gỡ ban thành công\n\n🔷${nameU} \n✅TID:${uidUser} `, threadID)));
        } else {
          api.sendMessage({ body: `➝ Admin phản hồi bạn:\n\n${event.body}\n\n➝ Reply tin nhắn này để nói lời ân xá đến Admin.`, mentions: [{ tag: name, id: event.senderID }] }, handleReply.id, (e, data) => global.client.handleReply.push({
            name: this.config.name,
            author: event.senderID,
            messageID: data.messageID,
            type: "reply"
          }), handleReply.messID);
          break;

        }
      }

    case "chuibot":
      {
        api.sendMessage({ body: `➝ Admin phản hồi:\n\n${event.body}\n\n➝ Reply tin nhắn này để nói lời ân xá đến Admin.`, mentions: [{ tag: name, id: event.senderID }] }, handleReply.id, (e, data) => global.client.handleReply.push({
          name: this.config.name,
          author: event.senderID,
          messageID: data.messageID,
          type: "reply"
        }), handleReply.messID);
        break;
      }
  }
};

module.exports.handleEvent = async ({ event, api, Users, Threads }) => {
  var { threadID, messageID, body, senderID } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss D/MM/YYYY");

  const thread = global.data.threadData.get(threadID) || {};
  if (typeof thread["fixspam"] !== "undefined" && thread["fixspam"] == false) return;

  if (senderID == global.data.botID) return;
  let name = await Users.getNameUser(event.senderID);
  var idbox = event.threadID;
  var threadInfo = (await Threads.getData(threadID)).threadInfo;

  // Check if sender is admin
  const { ADMINBOT } = global.config;
  if (ADMINBOT.includes(senderID)) return;

  // Reply message
  var msg = {
    body: `[ AUTOBAN ]\n\n➝ ${name}, Bạn vừa chửi Admin của tôi nên đã bị cấm dùng Bot vĩnh viễn. Nếu muốn được ân xá vui lòng liên hệ Admin.`
  }

  // Ban logic
  const arr = ["Admin lol", "Admin lồn", "Admin gà", "con Admin lol", "Admin ngu lol", "Admin chó", "dm Admin", "đm Admin", "dmm Admin", "dmm Admin", "đmm Admin", "đb Admin", "Admin điên", "Admin dở", "Admin khùng", "đĩ Admin", "Admin paylac rồi", "con Admin lòn", "cmm Admin", "clap Admin", "Admin ncc", "Admin oc", "Admin óc", "Admin óc chó", "cc Admin", "Admin tiki", "lozz Admintt", "lol Admin", "loz Admin", "lồn Admin", "Admin lồn", "Admin lon", "Admin cac", "Admin nhu lon", "Admin như cc", "Admin như bìu", "Admin sida", "Admin sida", "Admin fake", "bằng ngu", "Admin shoppee","Admin đểu", "Admin dỡm"];
  arr.forEach(async i => {
    let str = i[0].toUpperCase() + i.slice(1);
    if (body === i.toUpperCase() || body === i || str === body) {
      const uidUser = event.senderID;
      console.log(name, "chui bot:", i);
      let data = await Users.getData(uidUser).data || {};
      data.banned = 1;
      data.reason = i || null;
      data.dateAdded = time;
      await Users.setData(uidUser, { data });
      global.data.userBanned.set(uidUser, { reason: data.reason, dateAdded: data.dateAdded });

      api.sendMessage(msg, threadID, () => {
        var listAdmin = global.config.ADMINBOT;
        for (var idad of listAdmin) {
          let namethread = threadInfo.threadName;
          api.sendMessage(`➝ ${name}\n➝ UID : ${uidUser}\n➝ Box: ${namethread}\n➝ Lời xúc phạm: ${i}\n\n➝${name} đã bị cấm dùng bot.\nReply để phản hồi đến ${name}`, idad, (error, info) =>
            global.client.handleReply.push({
              name: this.config.name,
              author: senderID,
              messageID: info.messageID,
              messID: messageID,
              id: idbox,
              type: "chuibot"
            })
          );
        }
      });
    }
  });

};
module.exports.languages = {
  "vi": { "on": "Bật", "off": "Tắt", "successText": "autoban nhóm này thành công" },
  "en": { "on": "on", "off": "off", "successText": "autoban success!" }
}
module.exports.run = async function ({ api, event, Users, Threads, getText }) {
  const { threadID, messageID, senderID, body } = event;
  const threadSetting = global.data.threadData.get(threadID) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  const userData = await Users.getData(senderID);
  if (userData && userData.data && userData.data.banned) {
    return api.sendMessage(`Bạn đã bị cấm sử dụng bot này vì chửi Admin: ${userData.data.reason}.`, threadID);
  }
  let data = (await Threads.getData(threadID)).data;
  if (typeof data["autoban"] == "undefined" || data["autoban"] == true) data["autoban"] = false;
  else data["autoban"] = true;
  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);
  return api.sendMessage(`${(data["autoban"] == false) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
}