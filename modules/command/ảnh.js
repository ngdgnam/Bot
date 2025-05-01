module.exports.config = {
    name: "ảnh",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Lương Trường Khôi",
    description: "Gửi ảnh theo keyword",
    commandCategory: "Media",
    usages: "[keyword]",
    prefix: false, // Bot VIP hơn
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const axios = require("axios");
    const fs = require("fs");
    const path = require("path");

    const { threadID, messageID, mentions, type, messageReply } = event;
    const uid =
        type === "message_reply" && messageReply
            ? messageReply.senderID
            : mentions && Object.keys(mentions).length > 0
            ? Object.keys(mentions)[0]
            : event.senderID;

    // API URLs
    const API_URL1 = "https://imgs-api.vercel.app/"; // API chính
    const API_URL2 = "https://api.sumiproject.net/images/"; // API cho anime & 6mui
    const API_KEY = "mk001"; // API key

    // Từ khóa chỉ dùng API_URL2
    const api2Keywords = ["anime", "6mui"];

    // Danh sách từ khóa hợp lệ
    const keywords = {
        "anime": "Ảnh anime",
        "6mui": "Ảnh 6 múi",
        "girl": "Ảnh gái xinh",
        "du": "Ảnh dú",
        "mong": "Ảnh mông",
        "capdoi": "Ảnh cặp đôi",
        "gainhat": "Ảnh gái nhật",
        "hana": "Ảnh hana",
        "ausand": "Ảnh ausand",
        "jimmy": "Ảnh jimmy",
        "jack": "Ảnh jack",
        "khanhuyen": "Ảnh khánh huyền",
        "lebong": "Ảnh lê bống",
        "linhngocdam": "Ảnh linh ngọc đàm",
        "ngoctrinh": "Ảnh ngọc trinh",
        "naughty": "Ảnh naughty",
        "japcosplay": "Ảnh japan cosplay",
        "loli": "Ảnh loli",
        "caidloli": "Ảnh caid loli",
        "tw": "Ảnh gái trung quốc",
        "nsfw": "Ảnh NSFW",
        "aqua": "Ảnh aqua",
        "chitanda": "Ảnh chitanda",
        "kana": "Ảnh kana",
        "kurumi": "Ảnh kurumi",
        "lucy": "Ảnh lucy",
        "mirai": "Ảnh mirai",
        "rem": "Ảnh rem",
        "sagiri": "Ảnh sagiri",
        "umaru": "Ảnh umaru",
        "rushia": "Ảnh rushia"
    };

    // Nếu không có keyword, hiển thị menu
    if (!args[0]) {
        let menu = "✨===== 『 𝗠𝗘𝗡𝗨 𝗔̉𝗡𝗛 』 =====✨\n";
        menu += "🎭 𝗗𝗔𝗡𝗛 𝗦Á𝗖𝗛 𝗧𝗨̛̀ 𝗞𝗛Ó𝗔 🎭\n";
        menu += "━━━━━━━━━━━━━━━━━\n";
        for (const [key, description] of Object.entries(keywords)) {
            menu += `➢ ${key.toUpperCase()}: ${description}\n`;
        }
        menu += "━━━━━━━━━━━━━━━━━\n";
        menu += "📌 𝗦𝗨̛̉ 𝗗𝗨̣𝗡𝗚: /ảnh [𝘁𝘂̛̀ 𝗸𝗵𝗼́𝗮] 📌";

        return api.sendMessage(menu, threadID, messageID);
    }

    // Lấy từ khóa nhập vào
    const keyword = args[0];

    // Kiểm tra từ khóa hợp lệ
    if (!keywords[keyword]) {
        return api.sendMessage("❌ 𝗧𝘂̛̀ 𝗸𝗵𝗼́𝗮 𝗸𝗵𝗼̂𝗻𝗴 𝗵𝗼̛̣𝗽 𝗹𝗲̣̂. 𝗡𝗵𝗮̣̂𝗽 `/ảnh` đ𝗲̂̉ 𝘅𝗲𝗺 𝗱𝗮𝗻𝗵 𝘀𝗮́𝗰𝗵!", threadID, messageID);
    }

    try {
        // Kiểm tra và tạo thư mục cache nếu chưa có
        const cacheDir = path.resolve(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }

        // Xác định API sử dụng
        const isAPI2 = api2Keywords.includes(keyword);
        const imageURL = isAPI2 ? `${API_URL2}${keyword}` : `${API_URL1}${keyword}?apikey=${API_KEY}`;

        // Gọi API lấy ảnh
        const response = await axios.get(imageURL);
        if (!response.data || !response.data.url) {
            return api.sendMessage("❌ 𝗞𝗵𝗼̂𝗻𝗴 𝘁𝗶̀𝗺 𝘁𝗵𝗮̂́𝘆 𝗮̉𝗻𝗵. 𝗩𝘂𝗶 𝗹𝗼̀𝗻𝗴 𝘁𝗵𝘂̛̉ 𝗹𝗮̣𝗶!", threadID, messageID);
        }

        const { url, author } = response.data;
        const ext = path.extname(url);
        const filePath = path.resolve(cacheDir, `${keyword}${ext}`);

        // Tải ảnh về
        const writer = fs.createWriteStream(filePath);
        const imageStream = await axios({
            url: url,
            method: "GET",
            responseType: "stream"
        });
        imageStream.data.pipe(writer);

        writer.on("finish", () => {
            let messageBody = `🖼️ 𝗛Ì𝗡𝗛 Ả𝗡𝗛 𝗖𝗛𝗢 𝗧Ừ 𝗞𝗛Ó𝗔: ${keyword.toUpperCase()}\n━━━━━━━━━━━━━━━━━`;
            if (!isAPI2 && author) messageBody += `\n📌 𝗧𝗮́𝗰 𝗴𝗶𝗮̉: ${author}`;

            api.sendMessage({
                body: messageBody,
                attachment: fs.createReadStream(filePath)
            }, threadID, () => {
                fs.unlinkSync(filePath); // Xóa file sau khi gửi
            }, messageID);
        });

        writer.on("error", (err) => {
            console.error("Lỗi khi tải ảnh:", err);
        });

    } catch (error) {
        console.error("Lỗi xảy ra:", error);
        api.shareContact("❌ 𝗖𝗼́ 𝗹𝗼̂̃𝗶 𝘅𝗮̉𝘆 𝗿𝗮. 𝗧𝗵𝘂̛̉ 𝗹𝗮̣𝗶 𝗵𝗼𝗮̣̆𝗰 𝗹𝗶𝗲̂𝗻 𝗵𝗲̣̂ 𝗮𝗱𝗺𝗶𝗻!", `100018277053087`, threadID, messageID);
    }
};
