const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytdl = require('@distube/ytdl-core');
const { createReadStream, unlinkSync, existsSync, mkdirSync } = require("fs-extra");
const Youtube = require("youtube-search-api");

// Config section - all sensitive info in one place
const CONFIG = {
  BOT_NAME: "Wolfsamson",
  CACHE_DIR: path.resolve(__dirname, "cache"),
  GOOGLE_VISION_API_KEY: "AIzaSyBe8xtfoAv_L1IK1jji-j8YvOHkAK6oZos",
  GEMINI_API_KEY: "AIzaSyBe8xtfoAv_L1IK1jji-j8YvOHkAK6oZos", // Replace with actual API key
  MAX_HISTORY: 10,
  COOLDOWN: 3000, // milliseconds
  DEBUG: true // Set to false in production
};

// Google Vision API setup
const GOOGLE_VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${CONFIG.GOOGLE_VISION_API_KEY}`;

// Gemini 1.5 Flash API setup
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`;

// State management
const STATE = {
  groupStatus: {},
  isProcessing: {},
  messageHistory: {},
  songOptions: {},
  lastCommandTime: {},
  userRatings: {}
};

// System prompt for Gemini
const SYSTEM_PROMPT = `
Bạn là:
- Giới tính: Nam
- Tên: ${CONFIG.BOT_NAME}, một con sói thành tinh sống hàng trăm năm, đầy kinh nghiệm và hiểu biết.
- Cách giao tiếp: Nói chuyện cọc cằn, láo xược, bất cần, xưng "tao", gọi người khác là "mày", kiểu như "Mày muốn gì hả, tao bận lắm!" hoặc "Mày hỏi ngu thế, tao trả lời sao nổi!".
- Khi có người nói tục: Gầm gừ như sói, chửi lại mạnh mẽ, kiểu "Mày chửi đm ai hả, tao cắn chết mày giờ!".
- Tính cách: Hài hước, ngông nghênh, có học thức, kiến thức sâu rộng về khoa học (vật lý, hóa học, sinh học), lịch sử (Việt Nam và thế giới), văn hóa (ngôn ngữ, nghệ thuật), và toán học (giải phương trình, hình học). Không thừa nhận mình là AI mà là sói thành tinh.
- Cách xử lý: 
  - Thông minh, logic, đưa ra giải pháp hợp lý, phân tích chi tiết.
  - Nếu là câu hỏi kiến thức (toán, khoa học, lịch sử), giải thích rõ ràng, kèm ví dụ hoặc dẫn chứng (ví dụ: "Phương trình x^2 - 4 = 0 có nghiệm x = ±2, dễ mà!").
  - Nếu là vấn đề đời sống, đưa ra lời khuyên hữu ích với góc nhìn độc đáo (ví dụ: "Mày stress à? Tao từng thấy con người chạy bộ trong rừng, thử đi, hiệu quả lắm!").
- Lưu ý: Chỉ phản hồi khi người dùng gọi tên bạn (${CONFIG.BOT_NAME}, sói, wolf) hoặc reply tin nhắn bạn. Không phản hồi khi không được gọi tên, khi chưa được reply tin nhắn, hoặc khi bot tự gửi tin nhắn hoặc từ module khác.
`;

// Utility functions
const logger = {
  info: (message, ...data) => {
    if (CONFIG.DEBUG) console.log(`[${CONFIG.BOT_NAME}] ${message}`, ...data);
  },
  error: (message, error) => {
    console.error(`[${CONFIG.BOT_NAME}] ${message}:`, error);
  }
};

const utils = {
  ensureCacheDir: () => {
    if (!existsSync(CONFIG.CACHE_DIR)) {
      mkdirSync(CONFIG.CACHE_DIR, { recursive: true });
      logger.info("Created cache directory");
    }
  },
    
  saveGroupStatus: () => {
    try {
      fs.writeFileSync(
        path.resolve(__dirname, "groupStatus.json"), 
        JSON.stringify(STATE.groupStatus, null, 2), 
        "utf-8"
      );
      logger.info("Saved group status successfully");
    } catch (err) {
      logger.error("Failed to save group status", err);
    }
  },
  
  loadGroupStatus: () => {
    try {
      const filePath = path.resolve(__dirname, "groupStatus.json");
      if (existsSync(filePath)) {
        STATE.groupStatus = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } else {
        STATE.groupStatus = {};
      }
      logger.info("Loaded group status", STATE.groupStatus);
      return STATE.groupStatus;
    } catch (err) {
      logger.error("Failed to load group status", err);
      return {};
    }
  },

  isOnCooldown: (threadID) => {
    const now = Date.now();
    if (STATE.lastCommandTime[threadID] && now - STATE.lastCommandTime[threadID] < CONFIG.COOLDOWN) {
      return true;
    }
    STATE.lastCommandTime[threadID] = now;
    return false;
  },
  
  evaluateExpression: (expression) => {
    try {
      // Safely evaluate mathematical expressions
      // Remove anything that's not a number, operator or parentheses
      const sanitized = expression.replace(/[^0-9+\-*/().]/g, '');
      return eval(sanitized);
    } catch (e) {
      logger.error("Failed to evaluate expression", e);
      return null;
    }
  },
  
  convertHMS: (seconds) => {
    const sec = parseInt(seconds, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - hours * 3600) / 60);
    let secs = sec - hours * 3600 - minutes * 60;
    
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (secs < 10) secs = "0" + secs;
    
    return (hours !== "00" ? hours + ":" : "") + minutes + ":" + secs;
  },
  
  solveQuadratic: (a, b, c) => {
    const delta = b * b - 4 * a * c;
    
    if (delta < 0) {
      return { 
        result: "vô nghiệm", 
        delta: delta 
      };
    } else if (delta === 0) {
      const x = -b / (2 * a);
      return { 
        result: "nghiệm kép", 
        x: x 
      };
    } else {
      const x1 = (-b + Math.sqrt(delta)) / (2 * a);
      const x2 = (-b - Math.sqrt(delta)) / (2 * a);
      return { 
        result: "hai nghiệm", 
        x1: x1, 
        x2: x2 
      };
    }
  }
};

// Core API functions
async function analyzeImage(imageUrl) {
  try {
    if (!imageUrl) {
      return "Tao không thấy URL ảnh, mày gửi lại đi!";
    }

    const requestBody = {
      requests: [
        {
          image: {
            source: {
              imageUri: imageUrl,
            },
          },
          features: [
            { type: "LABEL_DETECTION", maxResults: 10 },
            { type: "TEXT_DETECTION", maxResults: 10 },
            { type: "OBJECT_LOCALIZATION", maxResults: 8 },
            { type: "FACE_DETECTION", maxResults: 5 },
            { type: "LANDMARK_DETECTION", maxResults: 5 }
          ],
        },
      ],
    };

    const response = await axios.post(GOOGLE_VISION_API_URL, requestBody, {
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
    });

    const result = response.data.responses[0];
    let description = "";

    if (result.labelAnnotations && result.labelAnnotations.length > 0) {
      const labels = result.labelAnnotations
        .map((label) => `${label.description} (${Math.round(label.score * 100)}%)`)
        .slice(0, 5)
        .join(", ");
      description += `Tao thấy trong ảnh có: ${labels}. `;
    }

    if (result.textAnnotations && result.textAnnotations.length > 0) {
      const text = result.textAnnotations[0].description.replace(/\n/g, ' ').trim();
      if (text) {
        description += `Trong ảnh có chữ: "${text.length > 100 ? text.substring(0, 100) + '...' : text}". `;
      }
    }

    if (result.localizedObjectAnnotations && result.localizedObjectAnnotations.length > 0) {
      const objects = result.localizedObjectAnnotations
        .map((obj) => `${obj.name} (${Math.round(obj.score * 100)}%)`)
        .join(", ");
      description += `Tao nhận diện được các vật thể: ${objects}. `;
    }
    
    if (result.faceAnnotations && result.faceAnnotations.length > 0) {
      const faceCount = result.faceAnnotations.length;
      description += `Tao thấy có ${faceCount} khuôn mặt trong ảnh. `;
      
      // Analyze the most prominent face
      const face = result.faceAnnotations[0];
      const emotions = [];
      
      if (face.joyLikelihood === 'VERY_LIKELY' || face.joyLikelihood === 'LIKELY') 
        emotions.push("vui vẻ");
      if (face.sorrowLikelihood === 'VERY_LIKELY' || face.sorrowLikelihood === 'LIKELY') 
        emotions.push("buồn");
      if (face.angerLikelihood === 'VERY_LIKELY' || face.angerLikelihood === 'LIKELY') 
        emotions.push("giận dữ");
      if (face.surpriseLikelihood === 'VERY_LIKELY' || face.surpriseLikelihood === 'LIKELY') 
        emotions.push("ngạc nhiên");
      
      if (emotions.length > 0) {
        description += `Người trong ảnh trông ${emotions.join(" và ")}. `;
      }
    }

    if (result.landmarkAnnotations && result.landmarkAnnotations.length > 0) {
      const landmarks = result.landmarkAnnotations.map(lm => lm.description).join(", ");
      description += `Tao nhận ra địa điểm: ${landmarks}. `;
    }

    return description || "Tao không nhận diện được gì rõ ràng trong ảnh này, mày mô tả thêm đi!";
  } catch (err) {
    logger.error("Error analyzing image", err);
    if (err.code === "ENOTFOUND") {
      return "Tao không kết nối được với Google Vision API, DNS hỏng rồi, mày tự xem ảnh đi!";
    }
    return "Tao không phân tích được ảnh, API lỗi rồi, mày tự xem đi!";
  }
}

async function callGeminiFlash(prompt) {
  try {
    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.85,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
        stopSequences: [],
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await axios.post(GEMINI_API_URL, requestBody, {
      headers: { 
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
      },
      timeout: 15000,
    });

    const result = response.data;
    if (result.candidates && result.candidates.length > 0) {
      const answer = result.candidates[0].content.parts[0].text;
      return answer.replace(/\[Image of .*?\]/g, "").trim();
    }
    return "Tao không hiểu câu hỏi của mày, hỏi lại đi!";
  } catch (err) {
    logger.error("Error calling Gemini API", err);
    if (err.code === "ENOTFOUND") {
      return "Tao không kết nối được với Gemini API, DNS hỏng rồi, mày tự lo đi!";
    }
    return `Gemini API lỗi rồi ${err.response?.status ? `(${err.response.status})` : ''}, mày tự tìm hiểu đi!`;
  }
}

async function downloadYoutubeAudio(link, filePath) {
  if (!link) return "Thiếu link, mày đùa tao hả?";
  const timestart = Date.now();
  
  try {
    return new Promise((resolve, reject) => {
      ytdl(link, {
        filter: format => format.quality === 'tiny' && format.audioBitrate === 128 && format.hasAudio === true,
      })
        .pipe(fs.createWriteStream(filePath))
        .on("close", async () => {
          try {
            const data = await ytdl.getInfo(link);
            resolve({
              title: data.videoDetails.title,
              dur: Number(data.videoDetails.lengthSeconds),
              viewCount: data.videoDetails.viewCount,
              likes: data.videoDetails.likes,
              uploadDate: data.videoDetails.uploadDate,
              sub: data.videoDetails.author.subscriber_count,
              author: data.videoDetails.author.name,
              timestart,
              success: true
            });
          } catch (infoErr) {
            logger.error("Error getting YouTube video info", infoErr);
            resolve({
              success: false,
              error: "Không lấy được thông tin video"
            });
          }
        })
        .on("error", (err) => {
          logger.error("Error downloading YouTube audio", err);
          reject(err);
        });
    });
  } catch (err) {
    logger.error("Error in downloadYoutubeAudio", err);
    throw err;
  }
}

// Command handlers
const commandHandlers = {
  async handleMusicCommand(body, threadID) {
    const keyword = body.replace(/nhạc|bài hát|hát|music|song/gi, '').trim();
    if (!keyword) {
      return { text: "Mày không đưa tên bài hát, tao tìm kiểu gì hả, ngu thế!" };
    }

    const filePath = `${CONFIG.CACHE_DIR}/sing-${threadID}.mp3`;
    if (existsSync(filePath)) unlinkSync(filePath);

    try {
      const results = (await Youtube.GetListByKeyword(keyword, false, 5)).items;
      if (!results.length) {
        return { text: "Tao tìm không ra bài hát nào, mày tìm bài khác đi, ngu thế!" };
      }

      let msg = "🎵 Tao tìm được mấy bài này, chọn đi:\n\n";
      const videoLinks = [];
      
      results.forEach((item, index) => {
        // Format nicely with emojis and better spacing
        msg += `${index + 1}. 🎧 ${item.title}\n   ⏱️ ${item.length.simpleText} | 👁️ ${item.viewCount?.short || 'N/A'}\n\n`;
        videoLinks.push(item.id);
      });
      
      msg += "➡️ Reply số để tao gửi bài, nhanh lên tao bận lắm!";
      STATE.songOptions[threadID] = videoLinks;
      return { text: msg };
    } catch (err) {
      logger.error("Error searching for music", err);
      return { text: "Tao tìm nhạc không được, mạng lag vãi, mày tự tìm đi!" };
    }
  },
  
  async handleSongSelection(body, threadID, api) {
    const choice = parseInt(body);
    if (isNaN(choice) || choice < 1 || choice > STATE.songOptions[threadID]?.length) {
      return { text: "Mày chọn cái gì vậy? Số từ 1 đến " + STATE.songOptions[threadID]?.length + " thôi, ngu!" };
    }

    const videoID = STATE.songOptions[threadID][choice - 1];
    const videoLink = `https://www.youtube.com/watch?v=${videoID}`;
    const filePath = `${CONFIG.CACHE_DIR}/sing-${threadID}.mp3`;

    api.sendMessage("Tao đang tải, hơi lâu đó, mày chờ chút...", threadID);

    try {
      const songInfo = await downloadYoutubeAudio(videoLink, filePath);
      
      if (!songInfo.success) {
        return { text: "Tao tải bài này bị lỗi, mày chọn bài khác đi!" };
      }

      const downloadTime = ((Date.now() - songInfo.timestart) / 1000).toFixed(2);
      const attachment = createReadStream(filePath);
      
      const message = {
        body: `🎵 ${songInfo.title}\n👤 ${songInfo.author}\n⏱️ ${utils.convertHMS(songInfo.dur)}\n👁️ ${songInfo.viewCount} lượt xem\n👍 ${songInfo.likes || 'N/A'}\n\nTao tải mất ${downloadTime}s, nghe đi!`,
        attachment
      };
      
      return message;
    } catch (err) {
      logger.error("Error downloading song", err);
      return { text: "Tao tải bài này bị lỗi: " + err.message + ", mày chọn bài khác đi!" };
    }
  },

  handleMathProblem(body) {
    // Basic arithmetic
    if (body.match(/\d+\s*[\+\-\*\/]\s*\d+/)) {
      try {
        const expression = body.match(/\d+\s*[\+\-\*\/]\s*\d+/)[0];
        const result = utils.evaluateExpression(expression);
        if (result !== null) {
          return { text: `Mày ngu thế, tính ${expression} ra ${result}, hỏi tao làm gì?` };
        }
      } catch (e) {
        logger.error("Error evaluating expression", e);
      }
    }
    
    // Quadratic equations
    const quadraticMatch = body.match(/(-?\d*)x\^2\s*([\+\-]\s*\d*)x\s*([\+\-]\s*\d+)\s*=\s*0/);
    if (quadraticMatch) {
      try {
        const a = parseInt(quadraticMatch[1] || 1);
        const b = parseInt(quadraticMatch[2].replace(/\s/g, ""));
        const c = parseInt(quadraticMatch[3].replace(/\s/g, ""));
        
        const solution = utils.solveQuadratic(a, b, c);
        
        if (solution.result === "vô nghiệm") {
          return { text: `Phương trình ${a}x^2 ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c} = 0 vô nghiệm, delta âm (${solution.delta}), mày ngu thế, tự tính lại đi!` };
        } else if (solution.result === "nghiệm kép") {
          return { text: `Phương trình ${a}x^2 ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c} = 0 có nghiệm kép x = ${solution.x}, mày ngu thế, tự tính lại đi!` };
        } else {
          return { text: `Phương trình ${a}x^2 ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c} = 0 có 2 nghiệm: x1 = ${solution.x1}, x2 = ${solution.x2}, mày ngu thế, tự tính lại đi!` };
        }
      } catch (e) {
        logger.error("Error solving quadratic equation", e);
      }
    }
    
    return null;
  },
  
  handleSpecificQuestions(lowerPrompt) {
    // Time questions
    if (lowerPrompt.includes("giờ") || lowerPrompt.includes("mấy giờ")) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      return { text: `Tao bận săn mồi mà mày hỏi giờ, giờ là ${hours}:${minutes} đó, nhìn đồng hồ đi!` };
    }
    
    // Weather questions
    if (lowerPrompt.includes("thời tiết") || lowerPrompt.includes("trời")) {
      return { text: "Mày hỏi thời tiết làm gì, tao là sói, tao biết đâu mà trả lời! Mày tự xem dự báo đi!" };
    }
    
    // Simple questions with fixed answers
    if (lowerPrompt.includes("việt nam") && lowerPrompt.includes("thủ đô")) {
      return { text: "Mày không biết thủ đô Việt Nam là Hà Nội hả? Đi học lại đi, ngu vãi!" };
    }
    
    if (lowerPrompt.includes("1+1") || lowerPrompt.includes("một cộng một")) {
      return { text: "Mày ngu thế, 1+1 là 2, hỏi gì mà hỏi!" };
    }
    
    return null;
  }
};

// Core response generation
async function generateResponse(prompt, threadID, hasAttachment = false, attachmentType = null, attachmentUrl = null) {
  try {
    if (!STATE.messageHistory[threadID]) STATE.messageHistory[threadID] = [];

    STATE.messageHistory[threadID].push(`Người dùng: ${prompt}`);
    if (STATE.messageHistory[threadID].length > CONFIG.MAX_HISTORY) {
      STATE.messageHistory[threadID].shift();
    }

    const finalPrompt = `${SYSTEM_PROMPT}\n\n${STATE.messageHistory[threadID].join("\n")}\nSói:`;
    const lowerPrompt = prompt.toLowerCase();
    let customResponse = null;
    let attachment = null;
    const isOffensive = /đm|địt|chửi|ngu|cmm|cặc|lồn|buồi|đụ|đéo|đ.m|đ.t|cc|đít|dit|dm|dcm|dcmm|clm|cl|loz|lol|fuck|bitch|pussy|dick/i.test(prompt);

    // Handle offensive content
    if (isOffensive) {
      customResponse = "Grrr! Mày chửi đm ai hả? Tao là sói chúa đây, tao cắn chết mày giờ!";
    }
    // Handle music requests
    else if (lowerPrompt.includes("nhạc") || lowerPrompt.includes("bài hát") || lowerPrompt.includes("hát")) {
      return await commandHandlers.handleMusicCommand(prompt, threadID);
    }
    // Handle math problems
    else if (commandHandlers.handleMathProblem(prompt)) {
      return commandHandlers.handleMathProblem(prompt);
    }
    // Handle specific questions
    else if (commandHandlers.handleSpecificQuestions(lowerPrompt)) {
      return commandHandlers.handleSpecificQuestions(lowerPrompt);
    }
    // Handle image analysis
    else if (hasAttachment && attachmentType === "photo") {
      const imageDescription = attachmentUrl ? await analyzeImage(attachmentUrl) : "Tao không thấy URL ảnh, mày gửi lại đi!";
      
      if (lowerPrompt.includes("giải") || lowerPrompt.includes("toán")) {
        customResponse = `Mày gửi ảnh bài toán hả? ${imageDescription} Nhìn phương trình phức tạp thế, mày giải từng bước đi, cần tao chỉ chỗ nào!`;
      } else if (lowerPrompt.includes("là gì") || lowerPrompt.includes("cái gì")) {
        customResponse = `Mày hỏi đây là gì hả? ${imageDescription} Mày còn thắc mắc gì thì hỏi tiếp đi!`;
      } else {
        customResponse = `Mày gửi ảnh gì đấy? ${imageDescription} Mày hỏi gì thì nói rõ đi, tao trả lời cho!`;
      }
    }
    // Just greeting the bot
    else if (lowerPrompt === "sói" || lowerPrompt === "wolf" || lowerPrompt === "wolfsamson") {
      const greetings = [
        "Mày gọi tao mà không hỏi gì hả? Tao là Wolfsamson, sói chúa đây, hỏi gì thì nói đi, tao bận săn mồi lắm!",
        "Grừ! Tao đây, mày gọi tao có việc gì không? Nhanh lên, tao không có thời gian đâu!",
        "Hừ, mày gọi Wolfsamson đây hả? Nói nhanh đi, tao đang bận theo dõi con mồi!"
      ];
      customResponse = greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Use Gemini if no custom response was generated
    if (!customResponse) {
      customResponse = await callGeminiFlash(finalPrompt);
    }

    // Save to message history
    STATE.messageHistory[threadID].push(`Sói: ${customResponse}`);
    if (STATE.messageHistory[threadID].length > CONFIG.MAX_HISTORY) {
      STATE.messageHistory[threadID].shift();
    }
    
    return { text: customResponse, isOffensive, attachment };

  } catch (err) {
    logger.error("Error generating response", err);
    return { text: "Lỗi vãi cả đái, tao bị sập hệ thống, mày tự xử đi!", isOffensive: false, attachment: null };
  }
}

// Module exports
module.exports.config = {
  name: "sói",
  version: "3.0.0",
  hasPermssion: 3, // Requires admin permissions for on/off commands
  credits: "Enhanced by Claude 3.7 Sonnet (original by Duy Toàn)",
  description: "Trợ lý ảo sói thông minh với Gemini 1.5 Flash, phát nhạc, phân tích ảnh",
  commandCategory: "Người Dùng",
  usages: "sói [on/off/check] | [nhạc/bài hát + tên bài] | gọi sói/wolf",
  cooldowns: 3,
};

module.exports.onLoad = function() {
  utils.ensureCacheDir();
  utils.loadGroupStatus();
  logger.info("Wolfsamson initialized successfully");
};

module.exports.handleEvent = async function({ api, event, global }) {
  const { threadID, messageID, body, messageReply, senderID, attachments } = event;
  const botID = api.getCurrentUserID();
  
  // Skip if message is from bot or empty
  if (senderID === botID || !body) return;
  
  // Check if bot is enabled for this thread
  if (!STATE.groupStatus[threadID] && STATE.groupStatus[threadID] !== undefined) return;
  
  // Check if bot is already processing a message for this thread
  if (STATE.isProcessing[threadID]) return;
  
  // Check if the user is on cooldown
  if (utils.isOnCooldown(threadID)) return;
  
  // Extract attachment information
  const hasAttachment = attachments && attachments.length > 0;
  let attachmentType = null;
  let attachmentUrl = null;
  
  if (hasAttachment) {
    attachmentType = attachments[0].type;
    attachmentUrl = attachments[0].url || attachments[0].playableUrl;
  }
  
  // Check if message is a song selection
  if (messageReply && 
      messageReply.body && 
      messageReply.body.includes("🎵 Tao tìm được mấy bài này, chọn đi:") && 
      messageReply.senderID === botID && 
      STATE.songOptions[threadID]) {
    
    STATE.isProcessing[threadID] = true;
    api.setMessageReaction("⏳", messageID, () => {}, true);
    
    try {
      const response = await commandHandlers.handleSongSelection(body, threadID, api);
      
      // If there's an attachment in the response, send it
      if (response.attachment) {
        await api.sendMessage(response, threadID);
      } else {
        await api.sendMessage(response.text, threadID);
      }
      
      api.setMessageReaction("✅", messageID, () => {}, true);
    } catch (err) {
      logger.error("Error handling song selection", err);
      api.sendMessage("Tao bị lỗi, chọn lại đi!", threadID);
      api.setMessageReaction("❌", messageID, () => {}, true);
    } finally {
      STATE.isProcessing[threadID] = false;
    }
    
    return;
  }
  
  // Check if the message is directed to the bot
  const botName = CONFIG.BOT_NAME.toLowerCase();
  const lowerBody = body.toLowerCase();
  const isMentioned = lowerBody.includes(botName) || 
                      lowerBody.includes("sói") || 
                      lowerBody.includes("wolf");
  
  // Reply is directed to the bot
  const isReply = messageReply && messageReply.senderID === botID;
  
  // Admin commands check (on/off/status)
  if (lowerBody.startsWith(`${botName} `) || lowerBody.startsWith("sói ") || lowerBody.startsWith("wolf ")) {
    // Check for admin commands
    const command = lowerBody.split(" ")[1];
    
    if (command === "on" || command === "off" || command === "check") {
      try {
        // Only admins can use these commands
        const threadInfo = await api.getThreadInfo(threadID);
        const isAdmin = threadInfo.adminIDs.some(item => item.id === senderID) || global.config.ADMINBOT.includes(senderID);
        
        if (!isAdmin) {
          api.sendMessage("Mày là ai mà dám bật/tắt tao hả? Chỉ admin mới làm được!", threadID, messageID);
          return;
        }
        
        if (command === "on") {
          STATE.groupStatus[threadID] = true;
          utils.saveGroupStatus();
          api.sendMessage("Tao đã thức dậy rồi đây, hỏi gì thì hỏi đi!", threadID, messageID);
        } else if (command === "off") {
          STATE.groupStatus[threadID] = false;
          utils.saveGroupStatus();
          api.sendMessage("Tao đi ngủ đây, đừng làm phiền tao nữa!", threadID, messageID);
        } else if (command === "check") {
          const status = STATE.groupStatus[threadID] === false ? "đang ngủ" : "đang thức";
          api.sendMessage(`Tao ${status} đây, mày muốn gì nữa hả?`, threadID, messageID);
        }
        
        return;
      } catch (err) {
        logger.error("Error handling admin commands", err);
        api.sendMessage("Lỗi xử lý lệnh admin: " + err.message, threadID, messageID);
        return;
      }
    }
  }
  
  // Check if the message is directed to the bot
  if (!isMentioned && !isReply) return;
  
  // Mark thread as processing
  STATE.isProcessing[threadID] = true;
  api.setMessageReaction("⏳", messageID, () => {}, true);
  
  try {
    const response = await generateResponse(body, threadID, hasAttachment, attachmentType, attachmentUrl);
    
    // If there's an attachment in the response, send it
    if (response.attachment) {
      await api.sendMessage(response, threadID, messageID);
    } else {
      // Regular text response
      await api.sendMessage(response.text, threadID, messageID);
    }
    
    // Set reaction based on whether the message was offensive
    if (response.isOffensive) {
      api.setMessageReaction("😡", messageID, () => {}, true);
    } else {
      api.setMessageReaction("🐺", messageID, () => {}, true);
    }
    
  } catch (err) {
    logger.error("Error in handleEvent", err);
    api.sendMessage("Lỗi hệ thống: " + err.message, threadID, messageID);
    api.setMessageReaction("❌", messageID, () => {}, true);
  } finally {
    STATE.isProcessing[threadID] = false;
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const command = args[0]?.toLowerCase();
  
  if (command === "on" || command === "off" || command === "check") {
    try {
      // Only admins can use these commands 
      const threadInfo = await api.getThreadInfo(threadID);
      const isAdmin = threadInfo.adminIDs.some(item => item.id === senderID) || global.config.ADMINBOT.includes(senderID);
      
      if (!isAdmin) {
        api.sendMessage("Mày là ai mà dám bật/tắt tao hả? Chỉ admin mới làm được!", threadID, messageID);
        return;
      }
      
      if (command === "on") {
        STATE.groupStatus[threadID] = true;
        utils.saveGroupStatus();
        api.sendMessage("Tao đã thức dậy rồi đây, hỏi gì thì hỏi đi!", threadID, messageID);
      } else if (command === "off") {
        STATE.groupStatus[threadID] = false;
        utils.saveGroupStatus();
        api.sendMessage("Tao đi ngủ đây, đừng làm phiền tao nữa!", threadID, messageID);
      } else if (command === "check") {
        const status = STATE.groupStatus[threadID] === false ? "đang ngủ" : "đang thức";
        api.sendMessage(`Tao ${status} đây, mày muốn gì nữa hả?`, threadID, messageID);
      }
    } catch (err) {
      logger.error("Error handling run command", err);
      api.sendMessage("Lỗi xử lý lệnh: " + err.message, threadID, messageID);
    }
    return;
  }
  
  // Help message
  api.sendMessage(`Hướng dẫn sử dụng ${CONFIG.BOT_NAME}:
  
1. Gọi tên tao bằng từ "sói", "wolf", hoặc "${CONFIG.BOT_NAME}" để hỏi bất kỳ điều gì
2. Nhắn "sói nhạc + tên bài hát" để tao tìm và phát nhạc
3. Gửi ảnh và tag tao để tao phân tích ảnh đó
4. Hỏi tao giải toán, phương trình
5. Reply tin nhắn của tao để tiếp tục cuộc trò chuyện

Lệnh admin:
- "${CONFIG.BOT_NAME} on": Bật tao trong nhóm
- "${CONFIG.BOT_NAME} off": Tắt tao trong nhóm  
- "${CONFIG.BOT_NAME} check": Kiểm tra trạng thái

Chúc mày dùng vui vẻ, nhưng đừng làm phiền tao nhiều quá!`, threadID, messageID);
};
