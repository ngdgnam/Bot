const fs = require('fs-extra');
const path = require('path');
const pathData = path.join(__dirname, '../commands/cache/antiemoji.json');

module.exports.config = {
    name: "antiemoji",
    eventType: ["log:thread-icon"],
    version: "1.0.0",
    credits: "",
    description: "Ngăn chặn việc thay đổi emoji của nhóm",
};

module.exports.run = async function ({ event, api, Threads }) {
    const { threadID, logMessageData } = event;

    try {
        let antiData = await fs.readJSON(pathData);
        let threadEntry = antiData.find(entry => entry.threadID === threadID);
        if (!threadEntry) {
            api.sendMessage("⚠️ Nhóm này chưa bật tính năng chống đổi emoji.", threadID);
            return;
        }

        const originalEmoji = threadEntry.emoji;
        const newEmoji = logMessageData.thread_icon;

        if (newEmoji !== originalEmoji) {
            api.sendMessage("❌ Phát hiện thay đổi emoji, đang khôi phục lại...", threadID);

            api.changeThreadEmoji(originalEmoji, threadID, (err) => {
                if (err) {
                    api.sendMessage("⚠️ Đã xảy ra lỗi khi khôi phục emoji. Vui lòng kiểm tra quyền hạn của bot.", threadID);
                } else {
                    api.sendMessage("✅ Emoji của nhóm đã được khôi phục!", threadID);
                }
            });
        }
    } catch (error) {
        api.sendMessage("❌ Đã xảy ra lỗi trong quá trình xử lý.", threadID);
    }
};
