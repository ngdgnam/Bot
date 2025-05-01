module.exports.config = {
    name: "qtvonly",
    version: "1.0.0",
    hasPermssion: 1, 
    credits: "",
    description: "Quản lý admin bot",
    commandCategory: "Quản Trị Viên",
    usages: "qtvonly",
    cooldowns: 5,
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onLoad = async function({ api }) {
    const { writeFileSync, existsSync } = require('fs-extra');
    const { resolve } = require("path");
    const path = resolve(__dirname, 'cache', 'qtvonly.json');
    if (!existsSync(path)) {
        const obj = {
            qtvbox: {}
        };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    }
    const data = require(path);
    if (!data.hasOwnProperty('qtvbox')) data.qtvbox = {};
    writeFileSync(path, JSON.stringify(data, null, 4));
    for (const threadID in data.qtvbox) {
        if (data.qtvbox[threadID] === true) {
            api.sendMessage("Bot vừa khởi động lại, tiến hành bật chế độ chỉ Quản Trị Viên dùng BOT.", threadID);
        }
    }
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;
    const { writeFileSync } = require('fs-extra');
    const { resolve } = require("path");
    const pathData = resolve(__dirname, 'cache', 'qtvonly.json');
    const database = require(pathData);
    const { qtvbox } = database;
    qtvbox[threadID] = !qtvbox[threadID];
    writeFileSync(pathData, JSON.stringify(database, null, 4));
    if (qtvbox[threadID]) {
        api.sendMessage("✅ Bật thành công chế độ qtvonly (chỉ admin với qtv box mới có thể sử dụng bot).", threadID, messageID);
    } else {
        api.sendMessage("❌ Tắt thành công chế độ qtvonly (tất cả mọi người đều có thể sử dụng bot).", threadID, messageID);
    }
};
