const fs = require('fs-extra');
const path = require('path');
const pathData = path.join(__dirname, '../commands/cache/antinamebox.json');

module.exports.config = {
    name: "antinamebox",
    eventType: ["log:thread-name"],
    version: "1.0.0",
    credits: "",
    description: "Ngăn chặn việc thay đổi tên nhóm",
};

module.exports.run = async function ({ event, api, Threads }) {
    const { logMessageData, threadID } = event;

    try {
        let antiData = await fs.readJSON(pathData);
        let threadEntry = antiData.find(entry => entry.threadID === threadID);
        if (!threadEntry) return;
        if (logMessageData.name !== threadEntry.namebox) {
            api.sendMessage("❌ Phát hiện thay đổi tên nhóm, đang khôi phục lại...", threadID);
            api.changeThreadTitle(threadEntry.namebox, threadID);
            api.sendMessage(`✅ Tên nhóm đã được khôi phục lại thành "${threadEntry.namebox}"`, threadID);
        }
    } catch (error) {
        api.sendMessage("❌ Đã xảy ra lỗi khi xử lý đổi tên nhóm.", threadID);
    }
};
