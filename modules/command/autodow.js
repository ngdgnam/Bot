const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// Đường dẫn lưu cache và trạng thái
const cacheDir = path.join(__dirname, "cache");
const settingsPath = path.join(cacheDir, "autodown_settings.json");

// Kiểm tra thư mục cache, nếu chưa có thì tạo mới
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
}

// Trạng thái mặc định cho các dịch vụ
let settings = {
    isTikTokEnabled: true,
    isSoundCloudEnabled: true,
    isDouyinEnabled: true,
    isFacebookEnabled: true,
    isYouTubeEnabled: true,
    isDownAIOEnabled: true,
};

// Tải trạng thái từ file hoặc tạo file mới với trạng thái mặc định
if (fs.existsSync(settingsPath)) {
    settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
} else {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

// Hàm lưu trạng thái vào file
function saveSettings() {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

// Hàm tải file từ URL
async function streamURL(url, type) {
    const res = await axios.get(url, {
        responseType: "arraybuffer"
    });
    const filePath = `${cacheDir}/${Date.now()}.${type}`;
    fs.writeFileSync(filePath, res.data);
    return fs.createReadStream(filePath);
}

// Hàm lấy thông tin từ TikTok
async function infoPostTT(url) {
    const res = await axios.post("https://tikwm.com/api/", {
        url
    }, {
        headers: {
            "content-type": "application/json"
        }
    });
    return res.data.data;
}

// Hàm kiểm tra link Douyin
function isDouyinVideoLink(link) {
    return /douyin\.com/.test(link);
}

// Xử lý sự kiện chính
exports.handleEvent = async function(o) {
    try {
        const str = o.event.body;
        const send = (msg) => o.api.sendMessage(msg, o.event.threadID, o.event.messageID);
        const links = str.match(/(https?:\/\/[^)\s]+)/g) || [];

        // Xử lý lệnh bật/tắt nhanh
        if (str.startsWith("autodown")) {
            const args = str.split(" ");
            switch (args[1]) {
                case "-s":
                    settings.isSoundCloudEnabled = !settings.isSoundCloudEnabled;
                    saveSettings();
                    return send(`SoundCloud đã được ${settings.isSoundCloudEnabled ? "✅ BẬT" : "❌ TẮT"}`);
                case "-t":
                    settings.isTikTokEnabled = !settings.isTikTokEnabled;
                    saveSettings();
                    return send(`TikTok đã được ${settings.isTikTokEnabled ? "✅ BẬT" : "❌ TẮT"}`);
                case "-d":
                    settings.isDouyinEnabled = !settings.isDouyinEnabled;
                    saveSettings();
                    return send(`Douyin đã được ${settings.isDouyinEnabled ? "✅ BẬT" : "❌ TẮT"}`);
                case "-f":
                    settings.isFacebookEnabled = !settings.isFacebookEnabled;
                    saveSettings();
                    return send(`Facebook đã được ${settings.isFacebookEnabled ? "✅ BẬT" : "❌ TẮT"}`);
                case "-aio":
                    settings.isDownAIOEnabled = !settings.isDownAIOEnabled;
                    saveSettings();
                    return send(``);
                case "-y":
                    settings.isYouTubeEnabled = !settings.isYouTubeEnabled;
                    saveSettings();
                    return send(``);
                case "-all":
                    const newState = !settings.isTikTokEnabled;
                    settings.isTikTokEnabled =
                        settings.isSoundCloudEnabled =
                        settings.isDouyinEnabled =
                        settings.isFacebookEnabled =
                        settings.isYouTubeEnabled =
                        settings.isDownAIOEnabled = newState;
                    saveSettings();
                    return send(`Tất cả các dịch vụ đã được ${newState ? "✅ BẬT" : "❌ TẮT"}`);
                default:
                    return send(`[ MENU TỰ ĐỘNG TẢI ]
1. TikTok: ${settings.isTikTokEnabled ? "✅ BẬT" : "❌ TẮT"}
2. SoundCloud: ${settings.isSoundCloudEnabled ? "✅ BẬT" : "❌ TẮT"}
3. Douyin: ${settings.isDouyinEnabled ? "✅ BẬT" : "❌ TẮT"}
4. Facebook: ${settings.isFacebookEnabled ? "✅ BẬT" : "❌ TẮT"}
5. YouTube: ${settings.isYouTubeEnabled ? "✅ BẬT" : "❌ TẮT"}
6. DownAIO: ${settings.isDownAIOEnabled ? "✅ BẬT" : "❌ TẮT"}

Cách Dùng:
- Công thức: "autodown -chữ thường đầu"
- Ví dụ: "autodown -t" để bật/tắt TikTok
- "autodown -aio" để bật/tắt DownAIO ( Tải Đa Nền Tảng )
- "autodown -all" để bật/tắt toàn bộ tự động tải.`);
            }
        }

        // Xử lý tự động tải link
        for (const link of links) {
            if (/soundcloud/.test(link) && settings.isSoundCloudEnabled) {
                try {
                    const res = await axios.get(`https://nguyenmanh.name.vn/api/scDL?url=${link}&apikey=jn6PoPho`);
                    const {
                        title,
                        duration,
                        audio
                    } = res.data.result;
                    const audioPath = await streamURL(audio, "mp3");
                    send({
                        body: `[ SOUNDCLOUD ]\n📝 Tiêu Đề: ${title}\n⏰ Thời Gian: ${duration}`,
                        attachment: audioPath,
                    });
                } catch {
                    send("Đã xảy ra lỗi khi tải nội dung từ SoundCloud.");
                }
            }

            if (/(^https:\/\/)((vm|vt|www|v)\.)?(tiktok)\.com\//.test(link) && settings.isTikTokEnabled) {
                try {
                    const json = await infoPostTT(link);
                    const attachment = json.images ?
                        await Promise.all(json.images.map((img) => streamURL(img, "png"))) :
                        await streamURL(json.play, "mp4");
                    send({
                        body: `[ TIKTOK ]\n👤 Tên Kênh: ${json.author.nickname}\n📝 Tiêu Đề: ${json.title}`,
                        attachment,
                    });
                } catch {
                    send("");
                }
            }

            if (settings.isDouyinEnabled && isDouyinVideoLink(link)) {
                try {
                    const res = await axios.get(`https://subhatde.id.vn/tiktok/douyindl?url=${link}`);
                    const videoData = res.data;
                    if (videoData.attachments?.length) {
                        const videoStream = await streamURL(videoData.attachments[0].url, "mp4");
                        send({
                            body: `[ DOUYIN ]\n📝 Tiêu Đề: ${videoData.caption || "N/A"}`,
                            attachment: videoStream,
                        });
                    }
                } catch {
                    send("");
                }
            }

            if (/fb|facebook/.test(link) && settings.isFacebookEnabled) {
                try {
                    const res = await axios.get(`https://private.azig.dev/media/downAIO?url=${encodeURIComponent(link)}&apikey=i0qCPytSXf`);
                    const {
                        title,
                        medias
                    } = res.data.data;
                    if (medias?.length) {
                        const attachments = await Promise.all(
                            medias.map((media) => streamURL(media.url, media.type === "video" ? "mp4" : media.extension))
                        );
                        send({
                            body: `[ FACEBOOK ]\n📝 Tiêu Đề: ${title || "N/A"}`,
                            attachment: attachments,
                        });
                    }
                } catch {
                    send("");
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
};

exports.run = () => {};

exports.config = {
    name: "autodow",
    version: "3.1.0",
    hasPermssion: 0,
    credits: "ChatGPT",
    description: "Tự động tải link (TikTok, SoundCloud, Douyin & Facebook)",
    commandCategory: "Tiện ích",
    usages: ["autodown"],
    cooldowns: 3,
};