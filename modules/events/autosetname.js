module.exports.config = {
    name: "autosetname",
    eventType: ["log:subscribe"],
    version: "1.0.3",
    credits: "D-Jukie",
    description: "Tự động đặt biệt danh cho thành viên mới"
};

module.exports.run = async function ({ api, event, Users }) {
    const { threadID } = event;
    const memJoin = event.logMessageData.addedParticipants;

    const { readFileSync, existsSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const moment = require('moment-timezone');
    const pathData = join(__dirname, '../commands/cache/data/autosetname.json');

    if (!existsSync(pathData)) {
        writeFileSync(pathData, "[]", "utf-8");
        console.log("✅ Đã tạo file autosetname.json mới.");
    }

    let dataJson;
    try {
        dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    } catch (error) {
        console.error("Lỗi khi đọc dữ liệu autosetname:", error);
        return api.sendMessage("⚠️ Không thể đọc dữ liệu autosetname!", threadID);
    }

    const thisThread = dataJson.find(item => item.threadID == threadID);
    if (!thisThread || thisThread.nameUser.length === 0) return;

    const setNameTemplate = thisThread.nameUser[0];

    for (const { userFbId: idUser, fullName } of memJoin) {
        const nickname = setNameTemplate
            .replace(/{name}/g, fullName)
            .replace(/{time}/g, moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss | DD/MM/YYYY'));

        await new Promise(resolve => setTimeout(resolve, 1000));
        api.changeNickname(nickname, threadID, idUser);
    }

    return api.sendMessage("🔄 Đang tiến hành tự động set name cho thành viên mới...", threadID, event.messageID);
};
