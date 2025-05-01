module.exports.config = {
  name: "setmoney",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "CatalizCS",
  description: "Điều chỉnh thông tin của người dùng",
  commandCategory: "Admin",
  usages: "[add/set/clean/reset] [Số tiền] [Tag người dùng]",
  cooldowns: 5
};

module.exports.languages = {
  vi: {
    invalidAmount: '❎ Số tiền phải là một số hợp lệ.',
    addSuccess: '✅ Đã cộng thêm %1$ cho %2 người.',
    addFailure: '❎ Không thể cộng thêm tiền cho %1 người.',
    setSuccess: '✅ Đã set thành công %1$ cho %2 người.',
    setFailure: '❎ Không thể set tiền cho %1 người.',
    cleanSuccess: '✅ Đã xóa thành công toàn bộ tiền của %1 người.',
    cleanFailure: '❎ Không thể xóa toàn bộ tiền của %1 người.',
    resetSuccess: '✅ Đã xóa toàn bộ dữ liệu tiền của %1 người.',
    resetFailure: '❎ Không thể xóa dữ liệu tiền của %1 người.',
    unknownCommand: '❎ Lệnh không hợp lệ.'
  }
};

module.exports.run = async function({ event, api, Currencies, args }) {
  const { threadID, messageID, senderID } = event;
  const { languages } = module.exports;
  const mentionID = Object.keys(event.mentions);
  const money = Number(args[1]); // Chuyển đổi money thành kiểu số

  var message = [];
  var error = [];

  const getText = (key, ...values) => {
    const lang = languages.vi; // Chọn ngôn ngữ vi
    let text = lang[key] || languages.vi.unknownCommand;
    values.forEach((value, index) => {
      text = text.replace(`%${index + 1}`, value);
    });
    return text;
  };

  try {
    switch (args[0]) {
      case "add": {
        if (mentionID.length != 0) {
          for (const singleID of mentionID) {
            if (isNaN(money) || money <= 0) return api.sendMessage(getText('invalidAmount'), threadID, messageID);
            try {
              await Currencies.increaseMoney(singleID, money);
              message.push(singleID);
            } catch (e) {
              error.push(e);
              console.log(e);
            }
          }
          return api.sendMessage(getText('addSuccess', formatNumber(money), message.length), threadID, function() {
            if (error.length != 0) return api.sendMessage(getText('addFailure', error.length), threadID);
          }, messageID);
        } else {
          if (isNaN(money) || money <= 0) return api.sendMessage(getText('invalidAmount'), threadID, messageID);
          try {
            var uid = event.senderID;
            if (event.type == "message_reply") {
              uid = event.messageReply.senderID;
            } else if (args.length === 3) {
              uid = args[2];
            }
            await Currencies.increaseMoney(uid, money);
            message.push(uid);
          } catch (e) {
            error.push(e);
            console.log(e);
          }
          return api.sendMessage(getText('addSuccess', formatNumber(money), uid !== senderID ? '1 người' : 'bản thân'), threadID, function() {
            if (error.length != 0) return api.sendMessage(getText('addFailure', '1 người'), threadID);
          }, messageID);
        }
      }
      case 'all': {
        const allUserID = event.participantIDs;
        for (const singleUser of allUserID) {
          await Currencies.increaseMoney(singleUser, money);
        }
        api.sendMessage(getText('addSuccess', formatNumber(money), allUserID.length), threadID);
        break;
      }
      case "set": {
        if (mentionID.length != 0) {
          for (const singleID of mentionID) {
            if (isNaN(money) || money < 0) return api.sendMessage(getText('invalidAmount'), threadID, messageID);
            try {
              await Currencies.setData(singleID, { money });
              message.push(singleID);
            } catch (e) {
              error.push(e);
              console.log(e);
            }
          }
          return api.sendMessage(getText('setSuccess', formatNumber(money), message.length), threadID, function() {
            if (error.length != 0) return api.sendMessage(getText('setFailure', error.length), threadID);
          }, messageID);
        } else {
          if (isNaN(money) || money < 0) return api.sendMessage(getText('invalidAmount'), threadID, messageID);
          try {
            var uid = event.senderID;
            if (event.type == "message_reply") {
              uid = event.messageReply.senderID;
            }
            await Currencies.setData(uid, { money });
            message.push(uid);
          } catch (e) {
            error.push(e);
            console.log(e);
          }
          return api.sendMessage(getText('setSuccess', formatNumber(money), uid !== senderID ? '1 người' : 'bản thân'), threadID, function() {
            if (error.length != 0) return api.sendMessage(getText('setFailure', uid !== senderID ? '1 người' : 'bản thân'), threadID);
          }, messageID);
        }
      }
      case "clean": {
        if (args[1] === 'all') {
          const data = event.participantIDs;
          for (const userID of data) {
            const datas = (await Currencies.getData(userID)).data;
            if (datas !== undefined) {
              datas.money = '0';
              await Currencies.setData(userID, datas);
            }
          }
          return api.sendMessage(getText('cleanSuccess', data.length), threadID);
        }
        if (mentionID.length != 0) {
          for (const singleID of mentionID) {
            try {
              await Currencies.setData(singleID, { money: 0 });
              message.push(singleID);
            } catch (e) {
              error.push(e);
              console.log(e);
            }
          }
          return api.sendMessage(getText('cleanSuccess', message.length), threadID, function() {
            if (error.length != 0) return api.sendMessage(getText('cleanFailure', error.length), threadID);
          }, messageID);
        } else {
          try {
            var uid = event.senderID;
            if (event.type == "message_reply") {
              uid = event.messageReply.senderID;
            }
            await Currencies.setData(uid, { money: 0 });
            message.push(uid);
          } catch (e) {
            error.push(e);
            console.log(e);
          }
          return api.sendMessage(getText('cleanSuccess', uid !== senderID ? '1 người' : 'bản thân'), threadID, function() {
            if (error.length != 0) return api.sendMessage(getText('cleanFailure', uid !== senderID ? '1 người' : 'bản thân'), threadID);
          }, messageID);
        }
      }
      case "reset": {
        const allUserData = await Currencies.getAll(['userID']);
        for (const userData of allUserData) {
          const userID = userData.userID;
          try {
            await Currencies.setData(userID, { money: 0 });
            message.push(userID);
          } catch (e) {
            error.push(e);
            console.log(e);
          }
        }
        return api.sendMessage(getText('resetSuccess', message.length), threadID, function() {
          if (error.length != 0) return api.sendMessage(getText('resetFailure', error.length), threadID);
        }, messageID);
      }
      default: {
        return api.sendMessage(getText('unknownCommand'), threadID, messageID);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
