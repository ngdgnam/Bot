module.exports.config = {
  name: "ping",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "",
  description: "tag toàn bộ thành viên",
  commandCategory: "Quản Trị Viên",
  usages: "[Text]",
  cooldowns: 5
};
module.exports.run = async function({ api, event, args, Users }) {
  try {
    const botID = api.getCurrentUserID();
    const senderID = event.senderID;
    const listUserID = event.participantIDs.filter(ID => ID != botID && ID != senderID);
    const senderName = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
    var body = (args.length != 0) ? args.join(" ") : "{name} đã xoá bạn khỏi nhóm.";
    body = body.replace("{name}", senderName);
    var mentions = [], index = 0;
    for(const idUser of listUserID) {
        mentions.push({ id: idUser, tag: "‎", fromIndex: index - 1 });
        index -= 1;
    }
    return api.sendMessage({ body, mentions }, event.threadID, event.messageID);
  } catch (e) {
    return console.log(e);
  }
};
