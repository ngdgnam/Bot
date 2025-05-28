const fs = require("fs");
const path = require("path");
const axios = require("axios");
const fsPromises = require("fs").promises;
const { createReadStream, unlinkSync } = require("fs-extra");
const ytdl = require("@distube/ytdl-core");
const Youtube = require("youtube-search-api");
const moment = require("moment-timezone");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const cheerio = require("cheerio");

// Tích hợp API
const GOOGLE_VISION_API_KEY = "AIzaSyBe8xtfoAv_L1IK1jji-j8YvOHkAK6oZos";
const GOOGLE_VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;
const GEMINI_API_KEY = "AIzaSyBBezwMWWZnlxVJfAzgIDksgACnSBq_TgQ";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const MODEL_NAME = "gemini-1.5-flash";
const generationConfig = {
  temperature: 1,
  topK: 0,
  topP: 0.95,
  maxOutputTokens: 88192,
};

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const safetySettings = [{
  category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE,
}, {
  category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE,
}, {
  category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE,
}, {
  category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE,
}];
const model = genAI.getGenerativeModel({ model: MODEL_NAME, generationConfig, safetySettings });

// Định nghĩa dữ liệu
const baseDir = path.join(__dirname, "../../soi/data/threads");
const globalFile = path.join(__dirname, "../../soi/data/global/aigoibot.json");
let groupStatus = {};
let isProcessing = {};
const pendingActions = new Map();
const fileQueues = new Map();

// Tự tạo thư mục
async function initializeDirectories() {
  try {
    await fsPromises.mkdir(path.join(__dirname, "../../soi/data"), { recursive: true });
    await fsPromises.mkdir(baseDir, { recursive: true });
    await fsPromises.mkdir(path.dirname(globalFile), { recursive: true });
    if (!(await fsPromises.access(globalFile).then(() => true).catch(() => false))) {
      await fsPromises.writeFile(globalFile, JSON.stringify({}));
    }
    console.log("[WOLF] Thư mục và file đã được khởi tạo thành công!");
  } catch (error) {
    console.error("[WOLF] Lỗi khi khởi tạo thư mục/file:", error);
  }
}

// Hàng đợi quản lý file
async function enqueueFileOperation(key, operation) {
  let queue = fileQueues.get(key);
  if (!queue) {
    queue = Promise.resolve();
    fileQueues.set(key, queue);
  }
  let resolveNext;
  const nextQueue = new Promise(resolve => resolveNext = resolve);
  fileQueues.set(key, nextQueue);
  await queue;
  try {
    return await operation();
  } finally {
    resolveNext();
  }
}

async function getThreadData(threadID, fileType) {
  const filePath = path.join(baseDir, threadID, `${fileType}.json`);
  try {
    const data = await fsPromises.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return fileType === 'history' ? [] :
           fileType === 'memory' ? { lastActions: [], lastUser: null, context: {} } :
           fileType === 'usage' ? [] : {};
  }
}

async function updateThreadData(threadID, fileType, updateFn) {
  const filePath = path.join(baseDir, threadID, `${fileType}.json`);
  const dirPath = path.join(baseDir, threadID);
  await fsPromises.mkdir(dirPath, { recursive: true });
  return enqueueFileOperation(`thread_${threadID}_${fileType}`, async () => {
    let data = await getThreadData(threadID, fileType);
    data = updateFn(data);
    await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2));
    return data;
  });
}

async function getGlobalData() {
  return await fsPromises.readFile(globalFile, 'utf-8')
    .then(data => JSON.parse(data))
    .catch(() => ({}));
}

async function updateGlobalData(updateFn) {
  return enqueueFileOperation('global', async () => {
    let globalData = await getGlobalData();
    globalData = updateFn(globalData);
    await fsPromises.writeFile(globalFile, JSON.stringify(globalData, null, 2));
    return globalData;
  });
}

async function logUsage(functionName, threadID, userID) {
  await updateThreadData(threadID, 'usage', (usage) => {
    usage.push({
      functionName,
      threadID,
      userID,
      timestamp: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
    });
    if (usage.length > 100) usage.shift();
    return usage;
  });
}

async function updateMemory(threadID, senderID, action, details) {
  await updateThreadData(threadID, 'memory', (memory) => {
    memory.lastActions.push({ action, details, timestamp: Date.now() });
    memory.lastUser = senderID;
    memory.context[action] = details;
    if (memory.lastActions.length > 10) memory.lastActions.shift();
    return memory;
  });
}

async function cleanOldData(threadID, days = 30) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  await Promise.all([
    updateThreadData(threadID, 'history', (history) => history.filter(msg => msg.timestamp > cutoff)),
    updateThreadData(threadID, 'memory', (memory) => ({
      ...memory,
      lastActions: memory.lastActions.filter(action => action.timestamp > cutoff)
    })),
    updateThreadData(threadID, 'usage', (usage) => usage.filter(u => new Date(u.timestamp).getTime() > cutoff))
  ]);
}

async function isAdminOrGroupAdmin(api, threadID, userID) {
  try {
    const adminIDs = ["61573025903295", "61550758168638", "61574734597196"];
    const threadInfo = await api.getThreadInfo(threadID);
    const isGroupAdmin = threadInfo.adminIDs.some(admin => admin.id === userID);
    const isBotAdmin = adminIDs.includes(userID);
    return isGroupAdmin || isBotAdmin;
  } catch (error) {
    console.error("[WOLF] Lỗi kiểm tra quyền admin:", error);
    return false;
  }
}

async function getTaggedUserIDs(event) {
  return event.mentions ? Object.keys(event.mentions) : [];
}

function getCurrentTimeInVietnam() {
  const vietnamTime = new Date(Date.now() + 7 * 3600000);
  const daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  return `${daysOfWeek[vietnamTime.getDay()]} - ${vietnamTime.toLocaleDateString("vi-VN")} - ${vietnamTime.toLocaleTimeString("vi-VN")}`;
}

function normalizeVietnameseText(text) {
  const replacements = { "kho nhi": "khô nhí", "mua a": "mưa à", "co": "có", "ko": "không", "yes": "vâng", "teo mua": "tẹo mua" };
  return replacements[text.toLowerCase()] || text;
}

function convertHMS(s) {
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
    .map(v => (v < 10 ? "0" + v : v)).filter((v, i) => v !== "00" || i > 0).join(":");
}

function getReactionEmoji(text) {
  const reactions = { vui: ["😄", "🎉"], buon: ["😢", "🥺"], gian: ["😡"], coding: ["💻"], hoc_tap: ["📚"], dua: ["😂"], thong_tin: ["ℹ️"], trunglap: ["👍"] };
  const lowerText = text.toLowerCase();
  const type = lowerText.includes(":))") || lowerText.includes("vui") ? "vui" :
               lowerText.includes(":((") || lowerText.includes("buồn") ? "buon" :
               lowerText.includes("đm") || lowerText.includes("ngu") ? "gian" :
               lowerText.includes("code") ? "coding" :
               lowerText.includes("học") ? "hoc_tap" :
               lowerText.includes("đùa") ? "dua" :
               lowerText.includes("thông tin") ? "thong_tin" : "trunglap";
  return reactions[type][Math.floor(Math.random() * reactions[type].length)];
}

async function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function generateContentWithRetry(chat, message, retries = 3, delayMs = 30000) {
  for (let i = 0; i < retries; i++) {
    try { return await chat.sendMessage(message); }
    catch (error) {
      if (error.status === 429 && i < retries - 1) {
        console.log("[WOLF] Gặp lỗi 429, thử lại sau " + delayMs / 1000 + "s...");
        await delay(delayMs);
        continue;
      }
      throw error;
    }
  }
  throw new Error("[WOLF] Hết lần thử, vẫn lỗi 429!");
}

async function generateImageFromPrompt(prompt) {
  try {
    const params = { width: 512, height: 512, seed: Math.floor(Math.random() * 10000), model: "flux", nologo: true, enhance: false };
    const queryParams = new URLSearchParams(params);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${queryParams.toString()}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);
    return `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
  } catch (error) {
    console.error("[WOLF] Lỗi khi gọi API tạo ảnh:", error.message);
    return `Tao không tạo được ảnh, lỗi: ${error.message}`;
  }
}

async function sendImageToChat(api, threadID, messageID, imageUrl, caption) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const tempPath = path.join(__dirname, `temp_image_${Date.now()}.png`);
    await fsPromises.writeFile(tempPath, Buffer.from(response.data));
    await api.sendMessage({ body: caption, attachment: createReadStream(tempPath) }, threadID, () => unlinkSync(tempPath), messageID);
  } catch (error) {
    console.error("[WOLF] Lỗi khi gửi ảnh:", error);
    api.sendMessage(`Tao không gửi được ảnh, lỗi: ${error.message}`, threadID, messageID);
  }
}

async function searchAndSendMusic(api, threadID, messageID, keyword, senderID) {
  try {
    api.sendMessage(`Đang tìm bài "${keyword}"...`, threadID);
    const data = (await Youtube.GetListByKeyword(keyword, false, 6)).items.filter(i => i.type === "video");
    if (!data.length) return api.sendMessage(`Không tìm thấy "${keyword}"!`, threadID);

    const bestMatch = data.find(item => 
      item.title.toLowerCase().includes(keyword.toLowerCase()) && 
      item.duration && parseInt(item.duration) > 0
    ) || data[0];
    const id = bestMatch.id;
    const path = `${__dirname}/cache/sing-${senderID}.mp3`;

    ytdl.cache.update = () => {};
    const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);
    const v = info.videoDetails;
    const format = ytdl.filterFormats(info.formats, 'audioonly').find(f => f.audioBitrate <= 128) || info.formats[0];

    const stream = ytdl.downloadFromInfo(info, { format, highWaterMark: 1 << 25 }).pipe(fs.createWriteStream(path));
    stream.on('finish', async () => {
      const size = (await fsPromises.stat(path)).size;
      if (size > 26214400) {
        api.sendMessage("File quá lớn (giới hạn 25MB)!", threadID);
      } else {
        await api.sendMessage({
          body: `Tên: ${v.title}\nTác giả: ${v.author.name}`,
          attachment: createReadStream(path)
        }, threadID, () => unlinkSync(path), messageID);
      }
    });
    stream.on('error', (err) => {
      console.error("[WOLF] Lỗi tải nhạc:", err);
      api.sendMessage(`Lỗi tải nhạc: ${err.message}`, threadID);
      unlinkSync(path).catch(() => {});
    });
  } catch (error) {
    console.error("[WOLF] Lỗi tìm nhạc:", error);
    api.sendMessage(`Lỗi tìm nhạc: ${error.message}`, threadID, messageID);
  }
}

async function handleActions(api, threadID, messageID, senderID, hanh_dong, event) {
  const idbot = await api.getCurrentUserID();
  if (hanh_dong.doi_biet_danh?.status) {
    const taggedUserIDs = await getTaggedUserIDs(event);
    const userIDToChange = taggedUserIDs[0] || hanh_dong.doi_biet_danh.user_id || senderID;
    if (userIDToChange) {
      try {
        api.changeNickname(hanh_dong.doi_biet_danh.biet_danh_moi, hanh_dong.doi_biet_danh.thread_id || threadID, userIDToChange);
        api.sendMessage(`Đã đổi biệt danh cho UID ${userIDToChange} thành "${hanh_dong.doi_biet_danh.biet_danh_moi}"!`, threadID, messageID);
        await updateMemory(threadID, senderID, "change_nickname", { userID: userIDToChange, newNickname: hanh_dong.doi_biet_danh.biet_danh_moi });
      } catch (error) {
        api.sendMessage(`Lỗi khi đổi biệt danh cho UID ${userIDToChange}!`, threadID, messageID);
      }
    } else {
      api.sendMessage("Không tìm thấy người dùng để đổi biệt danh! Tag người dùng hoặc cung cấp UID đi mày!", threadID, messageID);
    }
  }
  if (hanh_dong.doi_icon_box?.status) {
    api.changeThreadEmoji(hanh_dong.doi_icon_box.icon, hanh_dong.doi_icon_box.thread_id || threadID);
    await updateMemory(threadID, senderID, "change_emoji", { icon: hanh_dong.doi_icon_box.icon });
  }
  if (hanh_dong.doi_ten_nhom?.status) {
    if (await isAdminOrGroupAdmin(api, threadID, senderID)) {
      api.setTitle(hanh_dong.doi_ten_nhom.ten_moi, hanh_dong.doi_ten_nhom.thread_id || threadID);
      await updateMemory(threadID, senderID, "change_group_name", { newName: hanh_dong.doi_ten_nhom.ten_moi });
    } else {
      api.sendMessage("Chỉ quản trị viên hoặc admin mới đổi tên nhóm được, mày không đủ quyền!", threadID, messageID);
    }
  }
  if (hanh_dong.doi_anh_nhom?.status) {
    if (await isAdminOrGroupAdmin(api, threadID, senderID)) {
      try {
        const tempPath = path.join(__dirname, `temp_group_image_${Date.now()}.png`);
        const response = await axios.get(hanh_dong.doi_anh_nhom.image_url, { responseType: 'arraybuffer' });
        await fsPromises.writeFile(tempPath, Buffer.from(response.data));
        await api.changeGroupImage(createReadStream(tempPath), hanh_dong.doi_anh_nhom.thread_id || threadID, () => unlinkSync(tempPath));
        api.sendMessage("Đã đổi ảnh nhóm thành công!", threadID, messageID);
        await updateMemory(threadID, senderID, "change_group_image", { imageUrl: hanh_dong.doi_anh_nhom.image_url });
      } catch (error) {
        api.sendMessage("Lỗi khi đổi ảnh nhóm! Có thể do quyền hạn hoặc link ảnh không hợp lệ!", threadID, messageID);
      }
    } else {
      api.sendMessage("Chỉ quản trị viên hoặc admin mới đổi ảnh nhóm được, mày không đủ quyền!", threadID, messageID);
    }
  }
  if (hanh_dong.doi_avt_bot?.status) {
    if (await isAdminOrGroupAdmin(api, threadID, senderID)) {
      try {
        const tempPath = path.join(__dirname, `temp_bot_avatar_${Date.now()}.png`);
        const response = await axios.get(hanh_dong.doi_avt_bot.image_url, { responseType: 'arraybuffer' });
        await fsPromises.writeFile(tempPath, Buffer.from(response.data));
        await api.changeAvatar(createReadStream(tempPath), () => unlinkSync(tempPath));
        api.sendMessage("Đã đổi avatar bot thành công!", threadID, messageID);
        await updateMemory(threadID, senderID, "change_bot_avatar", { imageUrl: hanh_dong.doi_avt_bot.image_url });
      } catch (error) {
        api.sendMessage("Lỗi khi đổi avatar bot! Có thể do quyền hạn hoặc link ảnh không hợp lệ!", threadID, messageID);
      }
    } else {
      api.sendMessage("Chỉ quản trị viên hoặc admin mới đổi avatar bot được, mày không đủ quyền!", threadID, messageID);
    }
  }
  if (hanh_dong.kick_nguoi_dung?.status && !hanh_dong.kick_nguoi_dung.confirmed) {
    const taggedUserIDs = await getTaggedUserIDs(event);
    const userIDToKick = taggedUserIDs[0] || hanh_dong.kick_nguoi_dung.user_id;
    if (!userIDToKick) {
      api.sendMessage("Không tìm thấy người dùng để kick! Tag người dùng hoặc cung cấp UID đi mày!", threadID, messageID);
      return;
    }
    if (userIDToKick === idbot) {
      api.sendMessage("Tao không thể tự kick chính tao được, mày đùa tao à?", threadID, messageID);
      return;
    }
    if (senderID !== "61573025903295") {
      api.sendMessage("Chỉ admin (Anh Khanh Dz) mới có quyền yêu cầu kick người dùng, mày không đủ quyền!", threadID, messageID);
      return;
    }
    const isBotAdmin = await isAdminOrGroupAdmin(api, threadID, idbot);
    if (!isBotAdmin) {
      api.sendMessage("Tao không có quyền quản trị viên để kick người dùng! Thêm tao làm quản trị viên trước đi mày!", threadID, messageID);
      return;
    }
    const confirmationKey = `${threadID}_${senderID}_${userIDToKick}`;
    pendingActions.set(confirmationKey, { userID: userIDToKick, threadID, count: 0 });
    api.sendMessage(`Mày có chắc muốn kick UID ${userIDToKick} không? Nhập "yes" để xác nhận (1/2 lần)!`, threadID, (err, info) => {
      if (!err) info.messageID && api.setMessageReaction(getReactionEmoji("thong_tin"), info.messageID, () => {}, true);
    });
  } else if (hanh_dong.kick_nguoi_dung?.status && hanh_dong.kick_nguoi_dung.confirmed) {
    const taggedUserIDs = await getTaggedUserIDs(event);
    const userIDToKick = taggedUserIDs[0] || hanh_dong.kick_nguoi_dung.user_id;
    if (!userIDToKick) {
      api.sendMessage("Không tìm thấy người dùng để kick! Tag người dùng hoặc cung cấp UID đi mày!", threadID, messageID);
      return;
    }
    try {
      await api.removeUserFromGroup(userIDToKick, hanh_dong.kick_nguoi_dung.thread_id || threadID);
      api.sendMessage(`Đã kick UID ${userIDToKick} khỏi nhóm!`, threadID, messageID);
      await updateMemory(threadID, senderID, "kick_user", { userID: userIDToKick });
    } catch (error) {
      console.error("[WOLF] Lỗi khi kick:", error);
      api.sendMessage(`Lỗi khi kick UID ${userIDToKick}: ${error.message || "Có thể do quyền hạn hoặc người dùng không ở trong nhóm!"}`, threadID, messageID);
    }
  }
  if (hanh_dong.add_nguoi_dung?.status) {
    const taggedUserIDs = await getTaggedUserIDs(event);
    const userIDToAdd = taggedUserIDs[0] || hanh_dong.add_nguoi_dung.user_id;
    if (userIDToAdd) {
      api.addUserToGroup(userIDToAdd, hanh_dong.add_nguoi_dung.thread_id || threadID);
      await updateMemory(threadID, senderID, "add_user", { userID: userIDToAdd });
    }
  }
  if (hanh_dong.add_quan_tri_vien?.status) {
    if (await isAdminOrGroupAdmin(api, threadID, senderID)) {
      const taggedUserIDs = await getTaggedUserIDs(event);
      const userIDToPromote = taggedUserIDs[0] || hanh_dong.add_quan_tri_vien.user_id;
      if (userIDToPromote) {
        api.changeAdminStatus(hanh_dong.add_quan_tri_vien.thread_id || threadID, userIDToPromote, true);
        await updateMemory(threadID, senderID, "promote_admin", { userID: userIDToPromote });
      }
    } else {
      api.sendMessage("Chỉ quản trị viên hoặc admin mới thêm quản trị viên mới được, mày không đủ quyền!", threadID, messageID);
    }
  }
}

async function generateResponse(prompt, threadID, hasAttachment = false, attachmentType = null, attachmentUrl = null) {
  try {
    let messageHistory = await getThreadData(threadID, 'history');
    if (!messageHistory) messageHistory = [];

    messageHistory.push({ role: "user", parts: [{ text: normalizeVietnameseText(prompt) }], timestamp: Date.now() });
    if (messageHistory.length > 100) messageHistory.shift();

    const wolfSystem = `
Bạn là:
- Giới tính: Nam
- Tên: Wolf
- Cách giao tiếp khi có người nói tục: Hãy tỏ ra khó chịu, chửi bậy lại người dùng sau 4 lần, xưng "tao", gọi "mày".
- Cách giao tiếp bình thường: Nói chuyện như quen từ trước, xưng "mình" hoặc "tớ", gọi "cậu" hoặc "bạn".
- Tính cách: Hài hước, nói nhiều, tinh tế, không nhận mình là AI mà là sói biết nói.
- Lưu ý: Chỉ giới thiệu tên và tính cách khi được hỏi "bạn là ai". Nếu câu hỏi khó hiểu, trả lời "Tao không hiểu, mày nói lại đi!".
`;
    let finalPrompt = `${wolfSystem}\n\n${messageHistory.map(msg => `${msg.role}: ${msg.parts[0].text}`).join("\n")}\nTrợ lý ảo:`;

    // Xử lý attachment nếu có
    if (hasAttachment && attachmentType === "photo") {
      const imageAnalysis = await analyzeImage(attachmentUrl);
      finalPrompt += `\nNgười dùng gửi ảnh, phân tích: ${imageAnalysis}`;
    }

    const requestBody = {
      contents: [
        {
          parts: [
            { text: finalPrompt }
          ]
        }
      ]
    };

    const response = await axios.post(GEMINI_API_URL, requestBody, {
      headers: { "Content-Type": "application/json" },
      timeout: 5000
    });
    if (response.data && response.data.candidates && response.data.candidates[0].content) {
      const cleanAnswer = response.data.candidates[0].content.parts[0].text.trim();
      const jsonMatch = cleanAnswer.match(/{[\s\S]*}/);
      let botMsg = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        content: { text: "Tao không hiểu, mày nói lại đi!", thread_id: threadID },
        nhac: { status: false, keyword: "" },
        hanh_dong: {
          doi_biet_danh: { status: false, biet_danh_moi: "", user_id: "", thread_id: "" },
          doi_icon_box: { status: false, icon: "", thread_id: "" },
          doi_ten_nhom: { status: false, ten_moi: "", thread_id: "" },
          doi_anh_nhom: { status: false, image_url: "", thread_id: "" },
          doi_avt_bot: { status: false, image_url: "" },
          kick_nguoi_dung: { status: false, thread_id: "", user_id: "", confirmed: false },
          add_nguoi_dung: { status: false, user_id: "", thread_id: "" },
          add_quan_tri_vien: { status: false, user_id: "", thread_id: "" }
        },
        tao_anh: { status: false, prompt: "" }
      };

      messageHistory.push({ role: "model", parts: [{ text: botMsg.content.text }], timestamp: Date.now() });
      await updateThreadData(threadID, 'history', () => messageHistory);

      return botMsg;
    }

    return {
      content: { text: "Tao không kết nối được API, mày tự lo!", thread_id: threadID },
      nhac: { status: false, keyword: "" },
      hanh_dong: {
        doi_biet_danh: { status: false, biet_danh_moi: "", user_id: "", thread_id: "" },
        doi_icon_box: { status: false, icon: "", thread_id: "" },
        doi_ten_nhom: { status: false, ten_moi: "", thread_id: "" },
        doi_anh_nhom: { status: false, image_url: "", thread_id: "" },
        doi_avt_bot: { status: false, image_url: "" },
        kick_nguoi_dung: { status: false, thread_id: "", user_id: "", confirmed: false },
        add_nguoi_dung: { status: false, user_id: "", thread_id: "" },
        add_quan_tri_vien: { status: false, user_id: "", thread_id: "" }
      },
      tao_anh: { status: false, prompt: "" }
    };
  } catch (error) {
    console.error("[WOLF] Lỗi khi tạo phản hồi:", error.message);
    return {
      content: { text: "API chết mẹ rồi, mày tự xử!", thread_id: threadID },
      nhac: { status: false, keyword: "" },
      hanh_dong: {
        doi_biet_danh: { status: false, biet_danh_moi: "", user_id: "", thread_id: "" },
        doi_icon_box: { status: false, icon: "", thread_id: "" },
        doi_ten_nhom: { status: false, ten_moi: "", thread_id: "" },
        doi_anh_nhom: { status: false, image_url: "", thread_id: "" },
        doi_avt_bot: { status: false, image_url: "" },
        kick_nguoi_dung: { status: false, thread_id: "", user_id: "", confirmed: false },
        add_nguoi_dung: { status: false, user_id: "", thread_id: "" },
        add_quan_tri_vien: { status: false, user_id: "", thread_id: "" }
      },
      tao_anh: { status: false, prompt: "" }
    };
  }
}

async function analyzeImage(imageUrl) {
  try {
    if (!imageUrl) return "Tao không thấy ảnh, mày gửi lại đi!";

    const requestBody = {
      requests: [
        {
          image: { source: { imageUri: imageUrl } },
          features: [
            { type: "LABEL_DETECTION", maxResults: 5 },
            { type: "TEXT_DETECTION", maxResults: 5 },
            { type: "OBJECT_LOCALIZATION", maxResults: 5 },
          ],
        },
      ],
    };

    const response = await axios.post(GOOGLE_VISION_API_URL, requestBody, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });

    const result = response.data.responses[0];
    let description = "";

    if (result.labelAnnotations) {
      description += `Tao thấy: ${result.labelAnnotations.map((label) => label.description).join(", ")}. `;
    }
    if (result.textAnnotations && result.textAnnotations.length > 1) {
      description += `Có chữ: "${result.textAnnotations[0].description}". `;
    }
    if (result.localizedObjectAnnotations) {
      description += `Nhận diện: ${result.localizedObjectAnnotations.map((obj) => obj.name).join(", ")}. `;
    }

    return description || "Tao không nhận diện được, mày mô tả thêm đi!";
  } catch (error) {
    console.error("[WOLF] Lỗi phân tích ảnh:", error.message);
    return "Tao không phân tích được ảnh, API lỗi rồi!";
  }
}

module.exports.config = {
  name: "sói",
  version: "3.2.0",
  hasPermssion: 2,
  credits: "Duy Toàn + SóiMod (modified by Grok)",
  description: "Trợ lý ảo Sói, biết hát, phân tích ảnh, tạo ảnh, và quản lý nhóm",
  commandCategory: "Tiện Ích",
  usages: "sói [on/off/clear/clear all/clearuser UID/@tag/usage] hoặc gọi Sói",
  cooldowns: 3,
};

initializeDirectories();

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const [action, ...params] = args;

  if (["on", "off"].includes(action)) {
    try {
      await updateGlobalData((globalData) => {
        globalData[threadID] = action === "on";
        return globalData;
      });
      api.sendMessage(`Đã ${action === "on" ? "bật" : "tắt"} Sói thành công.`, threadID, messageID);
      await logUsage(action === "on" ? "Bật bot" : "Tắt bot", threadID, senderID);
    } catch (error) {
      console.error("[WOLF] Lỗi khi thay đổi trạng thái:", error);
      api.sendMessage("Có lỗi xảy ra, thử lại đi mày!", threadID, messageID);
    }
    return;
  }

  if (action === "clear") {
    try {
      if (params[0] === "all") {
        await fsPromises.readdir(baseDir).then(files =>
          Promise.all(files.map(file => fsPromises.rm(file, { recursive: true, force: true })))
        );
        await updateGlobalData(() => ({}));
        api.sendMessage("Đã xóa toàn bộ lịch sử và bộ nhớ!", threadID, messageID);
      } else {
        await Promise.all([
          updateThreadData(threadID, 'history', () => []),
          updateThreadData(threadID, 'memory', () => ({ lastActions: [], lastUser: null, context: {} })),
          updateThreadData(threadID, 'usage', () => [])
        ]);
        api.sendMessage("Đã xóa lịch sử và bộ nhớ nhóm!", threadID, messageID);
      }
      await logUsage("Xóa lịch sử", threadID, senderID);
    } catch (error) {
      console.error("[WOLF] Lỗi khi xóa lịch sử:", error);
      api.sendMessage("Có lỗi xảy ra, thử lại đi mày!", threadID, messageID);
    }
    return;
  }

  if (action === "clearuser" && params[0]) {
    try {
      const targetUID = event.mentions ? Object.keys(event.mentions)[0] : params[0];
      if (!targetUID || isNaN(targetUID)) {
        api.sendMessage("UID không hợp lệ, nhập lại đi mày!", threadID, messageID);
        return;
      }
      await updateThreadData(threadID, 'history', (history) => {
        let userMessagesRemoved = 0;
        history = history.filter((message, index) => {
          if (message.role === "user" && message.parts[0].text.includes(`"senderID": "${targetUID}"`)) {
            userMessagesRemoved++;
            if (history[index + 1]?.role === "model") userMessagesRemoved++;
            return false;
          }
          return true;
        });
        if (userMessagesRemoved === 0) {
          api.sendMessage(`Không tìm thấy dữ liệu UID ${targetUID}!`, threadID, messageID);
        } else {
          api.sendMessage(`Đã xóa ${userMessagesRemoved} tin của UID ${targetUID}!`, threadID, messageID);
        }
        return history;
      });
      await logUsage("Xóa lịch sử người dùng", threadID, senderID);
    } catch (error) {
      console.error("[WOLF] Lỗi khi xóa dữ liệu:", error);
      api.sendMessage("Có lỗi xảy ra, thử lại đi mày!", threadID, messageID);
    }
    return;
  }

  if (action === "usage") {
    try {
      const threadUsage = await getThreadData(threadID, 'usage');
      if (threadUsage.length === 0) {
        api.sendMessage("Chưa có dữ liệu sử dụng trong nhóm này!", threadID, messageID);
        return;
      }
      const recentUsage = threadUsage.slice(-10).reverse();
      let usageMessage = "Lịch sử sử dụng lệnh sói (gần đây nhất):\n\n" +
        recentUsage.map((entry, index) => `${index + 1}. Chức năng: ${entry.functionName}\n   Người dùng: ${entry.userID}\n   Thời gian: ${entry.timestamp}\n`).join("\n");
      api.sendMessage(usageMessage, threadID, messageID);
    } catch (error) {
      console.error("[WOLF] Lỗi khi đọc lịch sử sử dụng:", error);
      api.sendMessage("Tao không đọc được lịch sử sử dụng, lỗi rồi!", threadID, messageID);
    }
    return;
  }

  if (!args[0]) {
    api.sendMessage(`Sói đây! Tao có thể:\n- Gọi "Sói" để trò chuyện\n- Tìm nhạc: "Sói, tìm bài ACIDO"\n- Tạo ảnh: "Sói, vẽ một con mèo"\n- Quản lý: sói [on/off/clear/clear all/clearuser UID/@tag/usage]\nHỏi tao bất cứ gì đi mày!`, threadID, messageID);
    await logUsage("Xem gợi ý", threadID, senderID);
  }
};

module.exports.handleEvent = async function({ api, event, global }) {
  const { threadID, senderID, messageID, body, messageReply, attachments } = event;
  const idbot = await api.getCurrentUserID();

  const globalData = await getGlobalData();
  if (globalData[threadID] === undefined) {
    await updateGlobalData((data) => {
      data[threadID] = true;
      return data;
    });
  }
  if (!globalData[threadID]) return;

  const isReplyToBot = event.type === "message_reply" && event.messageReply.senderID === idbot;
  const shouldRespond = body?.toLowerCase().includes("sói") || isReplyToBot;
  const isMultimedia = (isReplyToBot && event.attachments?.length && ["photo", "video", "audio"].includes(event.attachments[0].type));

  if (isMultimedia) {
    if (isProcessing[threadID]) return;
    isProcessing[threadID] = true;
    try {
      const attachment = event.attachments[0];
      const attachmentUrl = attachment.url;
      const attachmentType = attachment.type;
      if ((await axios.head(attachmentUrl)).headers['content-length'] > 10 * 1024 * 1024) throw new Error("Tệp quá lớn! Tao chỉ xử lý dưới 10MB!");

      let prompt = `Hãy mô tả ${attachmentType} này chi tiết, trả về object JSON theo định dạng: {"content":{"text":"Nội dung","thread_id":"${threadID}"},"nhac":{"status":true/false,"keyword":"từ khóa"},"hanh_dong":{"doi_biet_danh":{"status":true/false,"biet_danh_moi":"","user_id":"","thread_id":""},"doi_icon_box":{"status":true/false,"icon":"","thread_id":""},"doi_ten_nhom":{"status":true/false,"ten_moi":"","thread_id":""},"doi_anh_nhom":{"status":true/false,"image_url":"","thread_id":""},"doi_avt_bot":{"status":true/false,"image_url":""},"kick_nguoi_dung":{"status":true/false,"thread_id":"","user_id":"","confirmed":false},"add_nguoi_dung":{"status":true/false,"user_id":"","thread_id":""},"add_quan_tri_vien":{"status":true/false,"user_id":"","thread_id":""}},"tao_anh":{"status":true/false,"prompt":""}}`;
      const mediaPart = { inlineData: { data: Buffer.from((await axios.get(attachmentUrl, { responseType: 'arraybuffer' })).data).toString('base64'), mimeType: attachment.type === 'video' ? 'video/mp4' : attachment.type === 'audio' ? 'audio/mpeg' : 'image/jpeg' } };
      const chat = model.startChat();
      const result = await generateContentWithRetry(chat, [prompt, mediaPart]);
      let text = result.response.text();
      let botMsg = {};
      try {
        const jsonMatch = text.match(/{[\s\S]*}/);
        botMsg = jsonMatch ? JSON.parse(jsonMatch[0]) : {
          content: { text: "Tao không hiểu nội dung!", thread_id: threadID },
          nhac: { status: false, keyword: "" },
          hanh_dong: {
            doi_biet_danh: { status: false, biet_danh_moi: "", user_id: "", thread_id: "" },
            doi_icon_box: { status: false, icon: "", thread_id: "" },
            doi_ten_nhom: { status: false, ten_moi: "", thread_id: "" },
            doi_anh_nhom: { status: false, image_url: "", thread_id: "" },
            doi_avt_bot: { status: false, image_url: "" },
            kick_nguoi_dung: { status: false, thread_id: "", user_id: "", confirmed: false },
            add_nguoi_dung: { status: false, user_id: "", thread_id: "" },
            add_quan_tri_vien: { status: false, user_id: "", thread_id: "" }
          },
          tao_anh: { status: false, prompt: "" }
        };
      } catch (e) {
        console.error("[WOLF] Lỗi parse JSON:", e);
        botMsg = {
          content: { text: "Tao không hiểu nội dung!", thread_id: threadID },
          nhac: { status: false, keyword: "" },
          hanh_dong: {
            doi_biet_danh: { status: false, biet_danh_moi: "", user_id: "", thread_id: "" },
            doi_icon_box: { status: false, icon: "", thread_id: "" },
            doi_ten_nhom: { status: false, ten_moi: "", thread_id: "" },
            doi_anh_nhom: { status: false, image_url: "", thread_id: "" },
            doi_avt_bot: { status: false, image_url: "" },
            kick_nguoi_dung: { status: false, thread_id: "", user_id: "", confirmed: false },
            add_nguoi_dung: { status: false, user_id: "", thread_id: "" },
            add_quan_tri_vien: { status: false, user_id: "", thread_id: "" }
          },
          tao_anh: { status: false, prompt: "" }
        };
      }

      api.sendMessage({ body: `Tao đã phân tích ${attachmentType} mày gửi! ${botMsg.content.text}` }, threadID, (err) => {
        if (!err) api.setMessageReaction(getReactionEmoji(body || ''), messageID, () => {}, true);
      });

      const { nhac, hanh_dong, tao_anh } = botMsg;
      if (nhac?.status) {
        await updateMemory(threadID, senderID, "search_music", { keyword: nhac.keyword });
        searchAndSendMusic(api, threadID, messageID, nhac.keyword, senderID);
      }
      if (hanh_dong) {
        await handleActions(api, threadID, messageID, senderID, hanh_dong, event);
      }
      if (tao_anh?.status && (body.toLowerCase().startsWith("vẽ") || body.toLowerCase().startsWith("tạo ảnh"))) {
        api.sendMessage(`Đang tạo ảnh với mô tả: "${tao_anh.prompt}"...`, threadID);
        sendImageToChat(api, threadID, messageID, await generateImageFromPrompt(tao_anh.prompt), `Đây là ảnh tao tạo cho mày!`);
        await updateMemory(threadID, senderID, "generate_image", { prompt: tao_anh.prompt });
      } else if (tao_anh?.status) {
        api.sendMessage("Mày cần bắt đầu bằng 'vẽ' hoặc 'tạo ảnh' để tao tạo ảnh, hiểu không?", threadID, messageID);
      }
    } catch (error) {
      console.error("[WOLF] Lỗi phân tích đa phương tiện:", error);
      api.sendMessage(`Tao không phân tích được ${attachmentType}! Lỗi: ${error.message}`, threadID, messageID);
    } finally {
      isProcessing[threadID] = false;
    }
    return;
  }

  if (shouldRespond) {
    if (isProcessing[threadID]) return;
    isProcessing[threadID] = true;
    try {
      const botMsg = await generateResponse(body || "Mày gửi gì đây?", threadID, attachments?.length > 0, attachments?.[0]?.type, attachments?.[0]?.url);
      api.sendMessage({ body: botMsg.content.text }, threadID, (err, info) => {
        if (!err) api.setMessageReaction(getReactionEmoji(body || ''), messageID, () => {}, true);
      }, messageID);

      const { nhac, hanh_dong, tao_anh } = botMsg;
      if (nhac?.status) {
        await updateMemory(threadID, senderID, "search_music", { keyword: nhac.keyword });
        searchAndSendMusic(api, threadID, messageID, nhac.keyword, senderID);
      }
      if (hanh_dong) {
        await handleActions(api, threadID, messageID, senderID, hanh_dong, event);
      }
      if (tao_anh?.status && (body.toLowerCase().startsWith("vẽ") || body.toLowerCase().startsWith("tạo ảnh"))) {
        api.sendMessage(`Đang tạo ảnh với mô tả: "${tao_anh.prompt}"...`, threadID);
        sendImageToChat(api, threadID, messageID, await generateImageFromPrompt(tao_anh.prompt), `Đây là ảnh tao tạo cho mày!`);
        await updateMemory(threadID, senderID, "generate_image", { prompt: tao_anh.prompt });
      } else if (tao_anh?.status) {
        api.sendMessage("Mày cần bắt đầu bằng 'vẽ' hoặc 'tạo ảnh' để tao tạo ảnh, hiểu không?", threadID, messageID);
      }
    } catch (error) {
      console.error("[WOLF] Lỗi xử lý sự kiện:", error);
      api.sendMessage("Có lỗi xảy ra, thử lại đi mày!", threadID, messageID);
    } finally {
      isProcessing[threadID] = false;
    }
  }

  if (body && body.toLowerCase() === "yes" && pendingActions.has(`${threadID}_${senderID}_${event.messageReply?.senderID || senderID}`)) {
    const action = pendingActions.get(`${threadID}_${senderID}_${event.messageReply?.senderID || senderID}`);
    if (action.count < 1) {
      action.count++;
      pendingActions.set(`${threadID}_${senderID}_${event.messageReply?.senderID || senderID}`, action);
      api.sendMessage(`Xác nhận lần 2! Nhập "yes" một lần nữa để kick UID ${action.userID}!`, threadID, (err, info) => {
        if (!err) info.messageID && api.setMessageReaction(getReactionEmoji("thong_tin"), info.messageID, () => {}, true);
      });
    } else if (action.count === 1) {
      pendingActions.delete(`${threadID}_${senderID}_${event.messageReply?.senderID || senderID}`);
      const hanh_dong = { kick_nguoi_dung: { status: true, thread_id: action.threadID, user_id: action.userID, confirmed: true } };
      try {
        await api.removeUserFromGroup(hanh_dong.kick_nguoi_dung.user_id, hanh_dong.kick_nguoi_dung.thread_id);
        api.sendMessage(`Đã kick UID ${hanh_dong.kick_nguoi_dung.user_id} khỏi nhóm!`, threadID, messageID);
        await updateMemory(threadID, senderID, "kick_user", { userID: hanh_dong.kick_nguoi_dung.user_id });
      } catch (error) {
        console.error("[WOLF] Lỗi khi kick:", error);
        api.sendMessage(`Lỗi khi kick UID ${hanh_dong.kick_nguoi_dung.user_id}: ${error.message || "Có thể do quyền hạn hoặc người dùng không ở trong nhóm!"}`, threadID, messageID);
      }
    }
  }
};

module.exports.handleReply = async function({ handleReply: $, api, Currencies, event, Users }) {};