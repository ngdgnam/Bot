module.exports.config = {
  name: "rs",
  version: "2.0.2",
  hasPermssion: 3,
  credits: "Jukie",
  description: "Khởi động lại bot",
  commandCategory: "Admin",
  usages: "rs",
  cooldowns: 5,
  dependencies: {}
}

module.exports.run = async function({ api, args, Users, event }) {
  const { threadID, messageID } = event;
  const moment = require("moment-timezone");
  var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH");
  var phut = moment.tz("Asia/Ho_Chi_Minh").format("mm");
  var giay = moment.tz("Asia/Ho_Chi_Minh").format("ss");
  let name = await Users.getNameUser(event.senderID);
  if (args.length == 0) api.sendMessage(`Bot đang khởi động lại, sẽ hoạt động sau 5 giây nữa nhoaaa !!`, threadID, () => process.exit(1));
}