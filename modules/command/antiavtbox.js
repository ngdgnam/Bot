const fs = require('fs-extra');
const path = require('path');
const axios = require('axios'); 

const pathData = path.join(__dirname, '../commands/cache/antiavtbox.json');

const crFile = (f, i = []) => {
    if (!fs.existsSync(f)) {
        const data = JSON.stringify(i, null, 2);
        fs.writeFileSync(f, data);
    }
};

// Khởi tạo file nếu chưa tồn tại
crFile(pathData);

module.exports.config = {
    name: "antiavtbox",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "",
    description: "Chống đổi ảnh nhóm",
    commandCategory: "Quản Trị Viên",
    usages: "No",
    cooldowns: 0
};

module.exports.run = async ({ api, event, Threads }) => {
    const { threadID } = event;

    try {
        // Đọc dữ liệu từ file
        let antiData = await fs.readJSON(pathData);

        // Tìm kiếm thông tin nhóm trong danh sách
        let threadEntry = antiData.find(entry => entry.threadID === threadID);

        if (threadEntry) {
            // Nếu đã bật chế độ chống đổi ảnh, tắt chế độ
            antiData = antiData.filter(entry => entry.threadID !== threadID);
            await fs.writeFile(pathData, JSON.stringify(antiData, null, 4), 'utf-8');
            api.sendMessage("✅ Đã tắt chế độ chống đổi ảnh nhóm", threadID);
        } else {
            let url;
            let msg = await api.sendMessage("🔄 Đang khởi động chế độ chống đổi ảnh nhóm, vui lòng chờ...", threadID);
            const thread = (await Threads.getInfo(threadID));

            try {
                // Lưu ảnh hiện tại lên dịch vụ bên ngoài
                const response = await axios.get(`https://catbox-mnib.onrender.com/upload?url=${encodeURIComponent(thread.imageSrc)}`);
                url = response.data.url;

                // Thêm thông tin nhóm và ảnh đại diện vào danh sách
                const Data = { 
                    threadID: threadID, 
                    url: url,
                    report: {}
                };
                antiData.push(Data);

                await fs.writeFile(pathData, JSON.stringify(antiData, null, 4), 'utf-8');
                api.unsendMessage(msg.messageID);
                api.sendMessage("✅ Đã bật chế độ chống đổi ảnh nhóm", threadID);
            } catch (error) {
                console.error("Lỗi khi upload ảnh:", error);
                api.sendMessage("⚠️ Đã xảy ra lỗi khi bật chế độ chống đổi ảnh nhóm", threadID);
            }
        }
    } catch (error) {
        console.error("Lỗi khi xử lý chống đổi ảnh nhóm:", error);
        api.sendMessage("❌ Đã xảy ra lỗi trong quá trình xử lý.", threadID);
    }
};
