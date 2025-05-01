const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const pathData = path.join(__dirname, '../commands/cache/antiavtbox.json');

module.exports.config = {
    name: "antiavtbox",
    eventType: ["log:thread-icon"],
    version: "1.0.0",
    credits: "",
    description: "Ngăn chặn việc thay đổi ảnh đại diện nhóm",
};

module.exports.run = async function ({ event, api, Threads }) {
    const { logMessageData, threadID } = event;
    try {
        let antiData = await fs.readJSON(pathData);
        let threadEntry = antiData.find(entry => entry.threadID === threadID);
        if (!threadEntry) return;
        const thread = await Threads.getInfo(threadID);
        const currentImgSrc = thread.imageSrc;
        if (currentImgSrc !== threadEntry.url) {
            api.sendMessage("❌ Phát hiện thay đổi ảnh đại diện, đang khôi phục lại...", threadID);
            try {
                const response = await axios.get(threadEntry.url, { responseType: 'stream' });
                await api.changeThreadImage(response.data, threadID, (err) => {
                    if (err) {
                        api.sendMessage("⚠️ Đã xảy ra lỗi khi khôi phục ảnh đại diện", threadID);
                    } else {
                        api.sendMessage("✅ Ảnh đại diện nhóm đã được khôi phục thành công!", threadID);
                    }
                });
            } catch (error) {
                api.sendMessage("⚠️ Đã xảy ra lỗi khi khôi phục ảnh đại diện nhóm", threadID);
            }
        }
    } catch (error) {
        api.sendMessage("⚠️ Đã xảy ra lỗi khi xử lý sự kiện đổi ảnh đại diện", threadID);
    }
};
