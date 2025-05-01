module.exports.config = {
    name: "autopr",
    version: "1.0.0",
    hasPermssion: 2, 
    credits: "",
    description: "Tự động phát hiện các link pastebin và runmocky, gửi về cho admin",
    commandCategory: "Admin",
    usages: "",
    cooldowns: 5
};

module.exports.onLoad = () => {
    const fs = require("fs-extra");
    const request = require("request");
    const dirCache = __dirname + `/cache/`;
    const dirNoprefix = __dirname + `/noprefix/`;
    if (!fs.existsSync(dirCache)) fs.mkdirSync(dirCache, { recursive: true });
    if (!fs.existsSync(dirNoprefix)) fs.mkdirSync(dirNoprefix, { recursive: true });
    if (!fs.existsSync(dirCache + "pbin.jpeg")) 
        request("https://i.imgur.com/a6d5GXX.jpeg").pipe(fs.createWriteStream(dirCache + "pbin.jpeg"));
    if (!fs.existsSync(dirNoprefix + "vantoan.jpeg")) 
        request("https://i.imgur.com/acdiyiE.jpeg").pipe(fs.createWriteStream(dirNoprefix + "vantoan.jpeg"));
};
module.exports.run = async function({ api, event, args }) {
    console.log('Auto-detection for pastebin and runmocky is active...');
};
module.exports.handleEvent = async function({ api, event, Users }) {
    const { body, senderID, threadID } = event;
    const moment = require("moment-timezone");
    const timestamp = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:ss");
    try {
        if (!body || senderID == api.getCurrentUserID()) return;
        const isPastebinLink = body.includes('pastebin.com');
        const isRunMockyLink = body.includes('run.mocky.io');
        if (!isPastebinLink && !isRunMockyLink) return;
        const adminBotIDs = global.config.ADMINBOT || [];
        if (adminBotIDs.includes(senderID)) return;
        const { threadName } = await api.getThreadInfo(threadID);
        const linkType = isPastebinLink ? "Pastebin" : "RunMocky";
        api.sendMessage(
            `⏰ Time: ${timestamp}\n🌍 Box: ${threadName}\n💬 ${linkType} Link: ${body}`, 
            '100018277053087'
        );
    } catch (e) {
        api.sendMessage(`An error occurred: ${e.message}`, '100018277053087');
    }
};
