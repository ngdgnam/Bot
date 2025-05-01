module.exports.config = {
  name: "txglobal",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Niio-team (Vtuan)",
  description: "no",
  commandCategory: "Trò Chơi",
  usages: "[on/off]",
  cooldowns: 1,
};

const fs = require("fs");
const path = "./modules/commands/cache/data/taixiu/";

if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });

const data = path + 'data/'
if (!fs.existsSync(data)) fs.mkdirSync(data, { recursive: true });

const lichsugiaodich = data + 'lichsugiaodich/'
if (!fs.existsSync(lichsugiaodich)) fs.mkdirSync(lichsugiaodich, { recursive: true });

const betHistoryPath = data + 'betHistory/';
if (!fs.existsSync(betHistoryPath)) fs.mkdirSync(betHistoryPath, { recursive: true });

const moneyFile = path + 'money.json';
const phiênFile = path + 'phiên.json';
const fileCheck = path + 'file_check.json';

if (!fs.existsSync(moneyFile)) fs.writeFileSync(moneyFile, "[]", "utf-8");
if (!fs.existsSync(phiênFile)) fs.writeFileSync(phiênFile, "[]", "utf-8");
if (!fs.existsSync(fileCheck)) fs.writeFileSync(fileCheck, "[]", "utf-8");

class Command {
  constructor(config) {
      this.config = config;
      this.count_req = 0;
  }

  run({ messageID, text, api, threadID }) {
      mqttClient.publish('/ls_req', JSON.stringify({
          "app_id": "2220391788200892",
          "payload": JSON.stringify({
              tasks: [{
                  label: '742',
                  payload: JSON.stringify({
                      message_id: messageID,
                      text: text,
                  }),
                  queue_name: 'edit_message',
                  task_id: Math.random() * 1001 << 0,
                  failure_count: null,
              }],
              epoch_id: this.generateOfflineThreadingID(),
              version_id: '6903494529735864',
          }),
          "request_id": ++this.count_req,
          "type": 3
      }));
  }

  generateOfflineThreadingID() {
      var ret = Date.now();
      var value = Math.floor(Math.random() * 4294967295);
      var str = ("0000000000000000000000" + value.toString(2)).slice(-22);
      var msgs = ret.toString(2) + str;
      return this.binaryToDecimal(msgs);
  }

  binaryToDecimal(data) {
      var ret = "";
      while (data !== "0") {
          var end = 0;
          var fullName = "";
          var i = 0;
          for (; i < data.length; i++) {
              end = 2 * end + parseInt(data[i], 10);
              if (end >= 10) {
                  fullName += "1";
                  end -= 10;
              } else {
                  fullName += "0";
              }
          }
          ret = end.toString() + ret;
          data = fullName.slice(fullName.indexOf("1"));
      }
      return ret;
  }
}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function playGame() {
  const dice1 = rollDice();
  const dice2 = rollDice();
  const dice3 = rollDice();
  const total = dice1 + dice2 + dice3;
  const result = (total >= 4 && total <= 10) ? 'xỉu' : 'tài';
  return {
      total,
      result,
      dice1,
      dice2,
      dice3
  };
}

function vtuandzs1tg(api, content, threadID) {
  return new Promise((resolve, reject) => {
      api.sendMessage(content, threadID, (e, i) => {
          if (e) return reject(e);
          resolve(i);
      });
  });
}

let i = 0;

module.exports.onLoad = async function ({ api, model }) {
  let results = null;
  setInterval(async () => {
      i += 1;
      const phiênData = JSON.parse(fs.readFileSync(phiênFile, "utf-8"));
      const checkData = JSON.parse(fs.readFileSync(fileCheck, "utf-8"));
      let phiên = phiênData.length ? phiênData[phiênData.length - 1].phien : 1;
      let betTime = 50;

      if (i == 1) {
          results = playGame();
          for (let threadID of checkData) {
              api.sendMessage(`🔄 Bắt đầu phiên ${phiên + 1}!\n⏳ Bạn có ${betTime} giây để đặt cược.`, threadID);
          }
      } else if (i == 45) {
          for (let threadID of checkData) {
              const message = await vtuandzs1tg(api, `⚠️Hết thời gian đặt cược!!\nChuẩn bị lắc...\nCòn 5 giây`, threadID);
              for (let num = 4; num >= 0; num--) {
                  setTimeout(async () => {
                      if (num > 0) {
                          let response = await new Command().run({
                              messageID: message.messageID,
                              text: `⚠️Hết thời gian đặt cược!!\nChuẩn bị lắc...\nCòn ${num} giây`,
                              api,
                              threadID
                          });
                      }
                  }, (4 - num) * 1000);
              }
          }
      } else if (i == 50) {
          const checkmn = JSON.parse(fs.readFileSync(moneyFile, "utf-8"));
          let winList = [];
          let loseList = [];

          for (let user of checkmn) {
              const userBetFile = betHistoryPath + `${user.senderID}.json`;
              if (!fs.existsSync(userBetFile)) continue;
              const userBetData = JSON.parse(fs.readFileSync(userBetFile, "utf-8"));

              userBetData.forEach(entry => {
                  if (entry.phien === phiên) {
                      if (entry.choice === results.result) {
                          if ((results.dice1 == 6 && results.dice2 == 6 && results.dice3 == 6) || (results.dice1 == 1 && results.dice2 == 1 && results.dice3 == 1)) {
                              user.input += entry.betAmount * 5;
                          } else {
                              user.input += entry.betAmount;
                          }
                          winList.push(user.senderID);
                      } else {
                          user.input -= entry.betAmount;
                          loseList.push(user.senderID);
                      }
                  }
              });
              fs.writeFileSync(userBetFile, JSON.stringify(userBetData, null, 4), 'utf-8');
          }

          fs.writeFileSync(moneyFile, JSON.stringify(checkmn, null, 4), 'utf-8');


          let last10Phien = [];

          if (phiênData.length > 10) {
              last10Phien = phiênData.slice(phiênData.length - 10);
          } else {
              last10Phien = phiênData;
          }
          const messagesMapping = {
              'tài': '⚫️',
              'xỉu': '⚪️'
          };
          let msgs = '';
          last10Phien.forEach(phiên => {
              const { phien, result, dice1, dice2, dice3 } = phiên;
              msgs += messagesMapping[result] || '';
          });

          let dcm = ``
          if (results.result == 'tài') {
              dcm = `⚫️`
          } else {
              dcm = `⚪️`
          }

          for (let threadID of checkData) {
              let msgd = ``
              if ((results.dice1 == 6 && results.dice2 == 6 && results.dice3 == 6) || (results.dice1 == 1 && results.dice2 == 1 && results.dice3 == 1)) {
                  msgd = `🎉 Nổ hũ: Tiền cược nhân 5`
              }

              let message = `📊 Kết quả phiên ${phiên + 1}: [ ${results.dice1} | ${results.dice2} | ${results.dice3} ]\nKết quả: ${results.result.toUpperCase()} - ${results.dice1 + results.dice2 + results.dice3}\n${msgd}` +
                  `Thắng: ${winList.length} người\n` +
                  `Thua: ${loseList.length} người\n` +
                  `Phiên gần đây:\n${msgs}${dcm}`;
              api.sendMessage(message, threadID);
          }
          phiênData.push({
              phien: phiên + 1,
              result: results.result,
              dice1: results.dice1,
              dice2: results.dice2,
              dice3: results.dice3,
          });
          fs.writeFileSync(phiênFile, JSON.stringify(phiênData, null, 4), 'utf-8');
      } else if (i == 60) {
          i = 0;
      }
  }, 1000);
}

module.exports.run = async function ({ api, event, args, Users }) {
  const { ADMINBOT } = global.config;
  const { senderID, threadID, messageReply, mentions } = event;
  const checkmn = JSON.parse(fs.readFileSync(moneyFile, "utf-8"));

  const phiênData = JSON.parse(fs.readFileSync(phiênFile, "utf-8"));
  const checkData = JSON.parse(fs.readFileSync(fileCheck, "utf-8"));

  let phiên = phiênData.length ? phiênData[phiênData.length - 1].phien : 1;

  if (args[0] === 'set') {
      if (!ADMINBOT.includes(senderID)) {
          return api.sendMessage(`⚠️ Bạn không có quyền sử dụng lệnh này!`, threadID);
      }

      let newSenderID, input;
      if (event.messageReply) {
          newSenderID = parseInt(event.messageReply.senderID);
          input = parseInt(args[1].trim());
      } else if (event.mentions && Object.keys(event.mentions).length > 0) {
          newSenderID = parseInt(Object.keys(event.mentions)[0]);
          input = parseInt(args[2]);
      } else {
          [newSenderID, input] = args.slice(1).join(' ').split('|').map(str => parseInt(str.trim()));
      }

      const userHistoricFile = lichsugiaodich + `${newSenderID}.json`;
      let userHistoricData = [];
      if (fs.existsSync(userHistoricFile)) {
          userHistoricData = JSON.parse(fs.readFileSync(userHistoricFile, "utf-8"));
      }

      let e = checkmn.findIndex(entry => entry.senderID == newSenderID);
      let time = Date.now();

      if (e !== -1) {
          const historicInput = checkmn[e].input;
          checkmn[e].input += input;
          userHistoricData.push({ senderID: newSenderID, time: time, input: input, historic_input: historicInput });
      } else {
          const newEntry = {
              senderID: newSenderID,
              input: input
          };
          checkmn.push(newEntry);
          userHistoricData.push({ senderID: newSenderID, time: time, input: input, historic_input: 0 });
      }

      fs.writeFileSync(moneyFile, JSON.stringify(checkmn, null, 4), 'utf-8');
      fs.writeFileSync(userHistoricFile, JSON.stringify(userHistoricData, null, 4), 'utf-8');
      const nêm = await Users.getNameUser(newSenderID)
      const message = `✅ Đã nạp thành công\n✨  ID Người Dùng: ${newSenderID}\n💰 Số tiền: ${input} VND\n⏰ Vào lúc ${new Date(time).toLocaleString()}.`;
      return api.sendMessage(message, threadID);
  } else if (args[0] === 'tài' || args[0] === 'xỉu') {
      if (!checkData.includes(threadID)) {
          return api.sendMessage(`Nhóm chưa bật bàn tài xỉu!`, threadID);
      }
      if (i >= 45) {
          return api.sendMessage(`⌛ Hết thời gian đặt cược`, threadID);
      }

      let betAmount;
      const player = checkmn.find(entry => entry.senderID == senderID);
      
      if (!player || player.input < betAmount) {
          return api.sendMessage(`⚠️ Xin lỗi, số tiền của bạn không đủ`, threadID);
      }
      
      if (args[1] === "all") {
          betAmount = player.input;
          if (betAmount == 0) return api.sendMessage(`⚠️ Xin lỗi, bạn không có tiền!`, threadID);
      } else {
          betAmount = parseInt(args[1]);
      
          if (isNaN(betAmount)) {
              return api.sendMessage(`⚠️ Xin lỗi, số tiền đặt cược phải là một số hợp lệ!`, threadID);
          }
      }
      
      if (betAmount < 1000 && args[1] !== "all") {
          return api.sendMessage(`⚠️ Xin lỗi, số tiền đặt cược phải lớn hơn 1000 VND!`, threadID);
      }
      

      const userBetFile = betHistoryPath + `${senderID}.json`;
      let userBetData = [];
      if (fs.existsSync(userBetFile)) {
          userBetData = JSON.parse(fs.readFileSync(userBetFile, "utf-8"));
      }

      const hasBet = userBetData.some(entry => entry.senderID === senderID && entry.phien === phiên);
      if (hasBet) {
          return api.sendMessage(`⚠️ Bạn chỉ được đặt cược một lần mỗi phiên.`, threadID);
      }

      userBetData.push({
          senderID: senderID,
          choice: args[0],
          betAmount: betAmount,
          phien: phiên,
          time: Date.now()
      });
      fs.writeFileSync(userBetFile, JSON.stringify(userBetData, null, 4), 'utf-8');

      return api.sendMessage(`✅ Bạn đã đặt ${args[0]} với số tiền ${betAmount} VND cho phiên ${phiên + 1}!\nTime còn lại: ${50-i}`, threadID);
  } else if (args[0] === 'on' || args[0] === 'off') {
      const dataThread = global.data.threadInfo.get(threadID) || await Threads.getInfo(threadID);
      if (!dataThread.adminIDs.some(item => item.id === senderID)) {
          return api.sendMessage('❎ Bạn không đủ quyền hạn để sử dụng!', threadID, event.messageID);
      }
      if (args[0] === 'on') {
          if (!checkData.includes(threadID)) {
              checkData.push(threadID);
              fs.writeFileSync(fileCheck, JSON.stringify(checkData, null, 4), 'utf-8');
              return api.sendMessage(`✅ Đã bật trò chơi cho nhóm này!`, threadID);
          }
      } else if (args[0] === 'off') {
          const index = checkData.indexOf(threadID);
          if (index > -1) {
              checkData.splice(index, 1);
              fs.writeFileSync(fileCheck, JSON.stringify(checkData, null, 4), 'utf-8');
              return api.sendMessage(`Đã tắt trò chơi cho nhóm này!`, threadID);
          }
      }
  } else if (args[0] == 'check') {
      const uid = messageReply && messageReply.senderID || (mentions && Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : event.senderID);
      const player = checkmn.find(entry => entry.senderID == uid);
  
      if (!player) {
          return api.sendMessage(`Người chơi chưa có dữ liệu!`, threadID);
      }

      const playerName = await Users.getNameUser(uid);
      api.sendMessage(`Name: ${playerName}\nMoney: ${player.input}`, threadID);
  } else {
      api.sendMessage(`[ Tài Xỉu ]\n- txglobal on/off để bật/tắt sever trong nhóm!!\n- txglobal tài/xỉu + số tiền/all\n- txglobal set + số tiền (rep hoặc tag người cần set) để set tiền\n- txglobal check để kiểm tra số dư( hoàn thành 1 vòng cược mới dùng được )\nChú Ý: sever liên kết với tất cả các nhóm!!`, threadID);
  }
}