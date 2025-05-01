module.exports.config = {
  name: "codelixi",
  version: "1.3.1",
  hasPermssion: 0,
  credits: "",
  description: "Tạo code lì xì, chia đều hoặc ngẫu nhiên.",
  commandCategory: "Kiếm Tiền",
  usages: "/codelixi chiadeu/random [tiền] [số lượng]",
  cooldowns: 0
};
const activeCodes = {};
module.exports.run = async function({ api, event, args, Currencies }) {
  const { threadID, senderID } = event;
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const totalMoney = parseInt(args[1]);
  const numPeople = parseInt(args[2]);
  if (isNaN(totalMoney) || isNaN(numPeople) || totalMoney <= 0 || numPeople <= 0) {
      return api.sendMessage("❌ Vui lòng nhập đúng định dạng: /codelixi chiadeu/random [tiền] [số lượng]", threadID);
  }
  const userData = await Currencies.getData(senderID);
  const userBalance = userData.money;
  if (userBalance < totalMoney) {
      return api.sendMessage(`❌ Số dư của bạn không đủ để tạo code lì xì !\nSố dư hiện tại của bạn là: ${userBalance}$`, threadID);
  }
  await Currencies.decreaseMoney(senderID, totalMoney);
  if (args[0] === "random") {
      let firstMoney = Math.floor(Math.random() * (0.8 - 0.5) * totalMoney + 0.5 * totalMoney); // Người đầu tiên nhận 50% - 80%
      let remainingMoney = totalMoney - firstMoney;
      const amounts = [firstMoney];
      for (let i = 1; i < numPeople - 1; i++) {
          const randomAmount = Math.floor(Math.random() * remainingMoney);
          amounts.push(randomAmount);
          remainingMoney -= randomAmount;
      }
      amounts.push(remainingMoney);
      activeCodes[code] = { totalMoney, numPeople, amounts, redeemed: 0, usedBy: [], creatorID: senderID };
      api.sendMessage(`🎉 Code lì xì random đã được tạo!\nCode: ${code}\nNhập code để nhận tiền lì xì, giới hạn cho ${numPeople} người.`, threadID);
  } else if (args[0] === "chiadeu") {
      const perPerson = Math.floor(totalMoney / numPeople);
      const amounts = Array(numPeople).fill(perPerson); 
      activeCodes[code] = { totalMoney, numPeople, amounts, redeemed: 0, usedBy: [], creatorID: senderID };
      api.sendMessage(`🎉 Code lì xì chia đều đã được tạo!\nCode: ${code}\nNhập code để nhận ${perPerson}$, giới hạn cho ${numPeople} người.`, threadID);
  } else {
      return api.sendMessage("❌ Vui lòng nhập đúng định dạng: /codelixi chiadeu/random [tiền] [số lượng]", threadID);
  }
};
module.exports.handleEvent = async function({ api, event, Currencies }) {
  const { body, threadID, senderID } = event;
  if (!body) return;
  const codeEntered = body.trim().toUpperCase();
  const name = (await api.getUserInfo(senderID))[senderID].name;
  if (activeCodes[codeEntered]) {
      const codeData = activeCodes[codeEntered];
      if (codeData.redeemed >= codeData.numPeople) {
          return api.sendMessage("❌ Code lì xì đã hết lượt sử dụng !", threadID);
      }
      if (codeData.usedBy.find(user => user.id === senderID)) {
          return api.sendMessage("❌ Bạn đã sử dụng code này rồi !\nMỗi người chỉ được sử dụng code một lần.", threadID);
      }
      const creatorID = codeData.creatorID;
      if (senderID === creatorID) {
          return;
      }
      const moneyToGive = codeData.amounts[codeData.redeemed];
      await Currencies.increaseMoney(senderID, moneyToGive);
      codeData.usedBy.push({ id: senderID, name, amount: moneyToGive });
      codeData.redeemed++;
      api.sendMessage(`✅ ${name} đã nhận được ${moneyToGive}$ từ lì xì !`, threadID);
      if (codeData.redeemed >= codeData.numPeople) {
          const result = codeData.usedBy
              .sort((a, b) => b.amount - a.amount)
              .map(user => `${user.name} - ${user.amount}$`)
              .join("\n");
          api.sendMessage(`🎉 Code lì xì đã hết lượt sử dụng !\nTổng cộng ${codeData.numPeople} người đã nhận được lì xì:\n${result}`, threadID);
      }
  }
};
