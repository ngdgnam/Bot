const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "ntbonly",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "",
    description: "Chỉ người thuê bot hoặc ADMIN mới được dùng lệnh bot",
    commandCategory: "Quản Trị Viên",
    usages: "ntbonly",
    cooldowns: 5
};

module.exports.onLoad = function() {
    const thuebotPath = path.resolve(__dirname, 'cache', 'ntbonly.json');
    if (!fs.existsSync(thuebotPath)) {
        fs.writeFileSync(thuebotPath, JSON.stringify({}), 'utf-8');
    }
};

module.exports.run = function({ api, event }) {
    const { threadID, messageID } = event;
    const thuebotPath = path.resolve(__dirname, 'cache', 'ntbonly.json');
    const thuebotData = JSON.parse(fs.readFileSync(thuebotPath, 'utf-8'));

    // Toggle trạng thái chế độ ntbonly cho thread hiện tại
    thuebotData[threadID] = !thuebotData[threadID];
    fs.writeFileSync(thuebotPath, JSON.stringify(thuebotData, null, 4), 'utf-8');

    if (thuebotData[threadID]) {
        api.sendMessage("✅ Bật thành công chế độ ntbonly (chỉ người thuê bot hoặc ADMIN mới có thể sử dụng bot).", threadID, messageID);
    } else {
        api.sendMessage("❌ Tắt thành công chế độ ntbonly (mọi người đều có thể sử dụng bot).", threadID, messageID);
    }
};

module.exports.handleCommand = function({ event, next }) {
    const { threadID, senderID, body } = event;
    const thuebotPath = path.resolve(__dirname, 'cache', 'ntbonly.json');
    const thuebotData = JSON.parse(fs.readFileSync(thuebotPath, 'utf-8'));
    const { PREFIX } = global.config;
    const commandPrefix = (global.data.threadData.get(threadID) || {}).PREFIX || PREFIX;

    // Kiểm tra xem tin nhắn có phải là lệnh hợp lệ không
    if (!body || !body.startsWith(commandPrefix)) {
        return next(); // Không phải lệnh bot, bỏ qua
    }

    // Lấy tên lệnh từ tin nhắn
    const commandName = body.slice(commandPrefix.length).trim().split(/\s+/).shift().toLowerCase();

    // Kiểm tra xem lệnh có tồn tại không
    const commands = Array.from(global.client.commands.keys());
    if (!commands.includes(commandName)) {
        return next(); // Lệnh không tồn tại, bỏ qua
    }

    // Kiểm tra nếu chế độ ntbonly được bật cho thread hiện tại
    if (thuebotData[threadID]) {
        const thuebotInfo = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'cache', 'data', 'thuebot.json')));
        const renterIDs = thuebotInfo.map(item => item.id);
        const adminIDs = global.config.ADMIN;

        // Kiểm tra xem người dùng có quyền sử dụng lệnh hay không
        if (renterIDs.includes(senderID) || adminIDs.includes(senderID)) {
            return next();
        } else {
            return api.sendMessage(`❌ Bạn không có quyền sử dụng bot trong chế độ ntbonly.`, threadID);
        }
    } else {
        return next(); // Nếu chế độ ntbonly không bật, bỏ qua kiểm tra
    }
};

