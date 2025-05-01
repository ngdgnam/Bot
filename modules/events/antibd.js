const fs = require('fs-extra');
const path = require('path');
const pathData = path.join(__dirname, '../commands/cache/antibd.json');

module.exports.config = {
    name: "antibd",
    eventType: ["log:user-nickname"],
    version: "1.0.1",
    credits: "",
    description: "Ngăn chặn việc thay đổi biệt danh trong nhóm",
};

module.exports.run = async function ({ event, api, Threads }) {
    const { threadID, logMessageData } = event;
    const botID = api.getCurrentUserID(); 
    try {
        let antiData = await fs.readJSON(pathData);
        let threadEntry = antiData.find(entry => entry.threadID === threadID);
        if (!threadEntry) {
            return;
        }
        const originalNicknames = threadEntry.data;
        const changedUserID = logMessageData.participant_id;
        const oldNickname = originalNicknames[changedUserID];
        const newNickname = logMessageData.nickname;
        if (changedUserID === botID) {
            return;
        }
        if (newNickname !== oldNickname) {
            api.changeNickname(oldNickname || "", threadID, changedUserID, (err) => {
                if (err) {
                    api.sendMessage("⚠️ Đã xảy ra lỗi khi khôi phục biệt danh", threadID);
                } else {
                    api.sendMessage(`✅ Lệnh antibd đã được bật, tiến hành khôi phục lại biệt danh của người dùng vừa đổi !`, threadID);
                }
            });
        }
    } catch (error) {
        console.error("Lỗi khi xử lý sự kiện đổi biệt danh:", error);
    }
};
