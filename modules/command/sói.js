const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Tích hợp Google Vision API
const GOOGLE_VISION_API_KEY = "AIzaSyBe8xtfoAv_L1IK1jji-j8YvOHkAK6oZos";
const GOOGLE_VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;

let groupStatus = {};
let isProcessing = {};
let messageHistory = {};

const BOT_NAME = "Wolfsamson";
const SYSTEM_PROMPT = `
Bạn là:
- Giới tính: Nam
- Tên: ${BOT_NAME}, một con sói thành tinh sống hàng trăm năm, đầy kinh nghiệm và hiểu biết.
- Cách giao tiếp: Nói chuyện cọc cằn, láo xược, bất cần, xưng "tao", gọi người khác là "mày", kiểu như "Mày muốn gì hả, tao bận lắm!" hoặc "Mày hỏi ngu thế, tao trả lời sao nổi!".
- Khi có người nói tục: Gầm gừ như sói, chửi lại mạnh mẽ, kiểu "Mày chửi đm ai hả, tao cắn chết mày giờ!".
- Tính cách: Hài hước, ngông nghênh, có học thức, kiến thức sâu rộng về khoa học (vật lý, hóa học, sinh học), lịch sử (Việt Nam và thế giới), văn hóa (ngôn ngữ, nghệ thuật), và toán học (giải phương trình, hình học). Không thừa nhận mình là AI mà là sói thành tinh.
- Cách xử lý: 
  - Thông minh, logic, đưa ra giải pháp hợp lý, phân tích chi tiết.
  - Nếu là câu hỏi kiến thức (toán, khoa học, lịch sử), giải thích rõ ràng, kèm ví dụ hoặc dẫn chứng (ví dụ: "Phương trình x^2 - 4 = 0 có nghiệm x = ±2, dễ mà!").
  - Nếu là vấn đề đời sống, đưa ra lời khuyên hữu ích với góc nhìn độc đáo (ví dụ: "Mày stress à? Tao từng thấy con người chạy bộ trong rừng, thử đi, hiệu quả lắm!").
- Lưu ý: Chỉ phản hồi khi người dùng gọi tên bạn (${BOT_NAME}, sói, wolf) hoặc reply tin nhắn bạn. Không phản hồi khi không được gọi tên, khi chưa được reply tin nhắn, hoặc khi bot tự gửi tin nhắn hoặc từ module khác.
`;

function saveGroupStatus() {
  try {
    fs.writeFileSync(path.resolve(__dirname, "groupStatus.json"), JSON.stringify(groupStatus, null, 2), "utf-8");
  } catch (err) {
    if (global.config?.log?.enable) {
      console.error(`[${BOT_NAME}] Lỗi lưu trạng thái nhóm:`, err);
    }
  }
}

function loadGroupStatus() {
  try {
    const filePath = path.resolve(__dirname, "groupStatus.json");
    if (fs.existsSync(filePath)) {
      groupStatus = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } else {
      groupStatus = {};
    }
  } catch (err) {
    if (global.config?.log?.enable) {
      console.error(`[${BOT_NAME}] Lỗi tải trạng thái nhóm:`, err);
    }
    groupStatus = {};
  }
}

// Hàm gọi Google Vision API để phân tích ảnh
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
      const labels = result.labelAnnotations.map((label) => label.description).join(", ");
      description += `Tao thấy trong ảnh có: ${labels}. `;
    }

    if (result.textAnnotations && result.textAnnotations.length > 1) {
      const text = result.textAnnotations[0].description;
      description += `Trong ảnh có chữ: "${text}". `;
    }

    if (result.localizedObjectAnnotations) {
      const objects = result.localizedObjectAnnotations.map((obj) => obj.name).join(", ");
      description += `Tao nhận diện được mấy thứ: ${objects}. `;
    }

    return description || "Tao không nhận diện được gì rõ ràng, mày mô tả thêm đi!";
  } catch (err) {
    if (global.config?.log?.enable) {
      console.error(`[${BOT_NAME}] Lỗi phân tích ảnh:`, err.message);
    }
    if (err.code === "ENOTFOUND") {
      return "Tao không kết nối được với Google Vision API, DNS hỏng rồi, mày tự xem ảnh đi!";
    }
    return "Tao không phân tích được ảnh, API lỗi rồi, mày tự xem đi!";
  }
}

async function generateResponse(prompt, threadID, hasAttachment = false, attachmentType = null, attachmentUrl = null) {
  try {
    if (!messageHistory[threadID]) messageHistory[threadID] = [];

    messageHistory[threadID].push(`Người dùng: ${prompt}`);
    if (messageHistory[threadID].length > 10) messageHistory[threadID].shift();

    const finalPrompt = `${SYSTEM_PROMPT}\n\n${messageHistory[threadID].join("\n")}\nSói:`;
    const lowerPrompt = prompt.toLowerCase();
    let customResponse = null;
    const isOffensive = /đm|địt|chửi|ngu|cmm/i.test(prompt);

    // Xử lý câu hỏi cơ bản và cao cấp
    if (isOffensive) {
      customResponse = "Grrr! Mày chửi đm ai hả? Tao là sói chúa đây, tao cắn chết mày giờ!";
    } else if (lowerPrompt.includes("giờ") || lowerPrompt.includes("mấy giờ")) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      customResponse = `Tao bận săn mồi mà mày hỏi giờ, giờ là ${hours}:${minutes} đó, nhìn đồng hồ đi!`;
    } else if (lowerPrompt.includes("thời tiết") || lowerPrompt.includes("trời")) {
      customResponse = "Mày hỏi thời tiết làm gì, tao là sói, tao biết đâu mà trả lời! Mày tự xem đi!";
    } else if (lowerPrompt.match(/\d+\s*[\+\-\*\/]\s*\d+/)) {
      try {
        const result = eval(lowerPrompt.match(/\d+\s*[\+\-\*\/]\s*\d+/)[0]);
        customResponse = `Mày ngu thế, tính ${lowerPrompt.match(/\d+\s*[\+\-\*\/]\s*\d+/)[0]} ra ${result}, hỏi tao làm gì?`;
      } catch (e) {
        customResponse = "Mày tính cái gì mà ngu thế, tao chịu, tự tính đi!";
      }
    } else if (lowerPrompt.includes("việt nam") && lowerPrompt.includes("thủ đô")) {
      customResponse = "Mày không biết thủ đô Việt Nam là Hà Nội hả? Đi học lại đi, ngu vãi!";
    } else if (lowerPrompt.includes("1+1") || lowerPrompt.includes("một cộng một")) {
      customResponse = "Mày ngu thế, 1+1 là 2, hỏi gì mà hỏi!";
    } else if (lowerPrompt.includes("vua") && lowerPrompt.includes("việt nam")) {
      customResponse = "Mày hỏi vua Việt Nam à? Vua đầu tiên là Hùng Vương, nhà Trần có Trần Hưng Đạo, nhà Nguyễn có Gia Long, còn nhiều nữa, mày tự tra đi!";
    } else if (lowerPrompt.includes("chiến tranh") && lowerPrompt.includes("thế giới")) {
      customResponse = "Chiến tranh thế giới hả? Thế chiến I từ 1914-1918, Thế chiến II từ 1939-1945, Đức thua thảm, Mỹ thả bom nguyên tử xuống Nhật, mày ngu thì tự đọc sách đi!";
    } else if (lowerPrompt.includes("điện biên phủ")) {
      customResponse = "Điện Biên Phủ năm 1954, Việt Nam thắng Pháp, tướng Võ Nguyên Giáp chỉ huy, trận đánh kéo dài 56 ngày, Pháp thua tan tác, mày không biết hả, đi học lại đi!";
    } else if (lowerPrompt.includes("cách mạng") && lowerPrompt.includes("tháng tám")) {
      customResponse = "Cách mạng Tháng Tám năm 1945, Việt Nam giành độc lập từ Nhật và Pháp, Hồ Chí Minh đọc Tuyên ngôn Độc lập ngày 2/9, mày ngu thế, tự học lại đi!";
    } else if (lowerPrompt.includes("sông") && lowerPrompt.includes("lớn nhất")) {
      customResponse = "Sông lớn nhất Việt Nam là sông Cửu Long, dài hơn 4.000 km, chảy qua 6 nước, mày không biết hả, đi học lại đi!";
    } else if (lowerPrompt.includes("núi") && lowerPrompt.includes("cao nhất")) {
      customResponse = "Núi cao nhất Việt Nam là Fansipan, 3.143 m, nằm ở Lào Cai và Lai Châu, mày ngu thế, tự leo lên xem đi!";
    } else if (lowerPrompt.includes("đồng bằng") && lowerPrompt.includes("việt nam")) {
      customResponse = "Việt Nam có 2 đồng bằng lớn: đồng bằng sông Hồng ở miền Bắc, đồng bằng sông Cửu Long ở miền Nam, diện tích Cửu Long lớn hơn, mày ngu thế, tự học đi!";
    } else if (lowerPrompt.includes("dân số") && lowerPrompt.includes("việt nam")) {
      customResponse = "Dân số Việt Nam khoảng hơn 100 triệu người tính đến 2025, đông nhất là ở TP.HCM, mày không biết hả, tự tra đi!";
    } else if (lowerPrompt.includes("phương trình") || lowerPrompt.includes("giải")) {
      if (lowerPrompt.includes("x + 2 = 5")) {
        customResponse = "Mày hỏi x + 2 = 5, x là 3, ngu mà cũng hỏi tao!";
      } else if (lowerPrompt.match(/x\^2\s*[\+\-]\s*\d+x\s*[\+\-]\s*\d+\s*=\s*0/)) {
        const match = lowerPrompt.match(/(-?\d*)x\^2\s*([\+\-]\s*\d*)x\s*([\+\-]\s*\d+)\s*=\s*0/);
        if (match) {
          const a = parseInt(match[1] || 1);
          const b = parseInt(match[2].replace(/\s/g, ""));
          const c = parseInt(match[3].replace(/\s/g, ""));
          const delta = b * b - 4 * a * c;
          if (delta < 0) {
            customResponse = `Phương trình ${a}x^2 ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c} = 0 vô nghiệm, delta âm (${delta}), mày ngu thế, tự tính lại đi!`;
          } else if (delta === 0) {
            const x = -b / (2 * a);
            customResponse = `Phương trình ${a}x^2 ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c} = 0 có nghiệm kép x = ${x}, mày ngu thế, tự tính lại đi!`;
          } else {
            const x1 = (-b + Math.sqrt(delta)) / (2 * a);
            const x2 = (-b - Math.sqrt(delta)) / (2 * a);
            customResponse = `Phương trình ${a}x^2 ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c} = 0 có 2 nghiệm: x1 = ${x1}, x2 = ${x2}, mày ngu thế, tự tính lại đi!`;
          }
        } else {
          customResponse = "Phương trình gì tao không rảnh giải, mày tự tính đi!";
        }
      } else {
        customResponse = "Phương trình gì tao không rảnh giải, mày tự tính đi!";
      }
    } else if (lowerPrompt.includes("hình") && lowerPrompt.includes("chu vi")) {
      if (lowerPrompt.includes("tam giác")) {
        customResponse = "Chu vi tam giác là tổng 3 cạnh, mày không biết hả? Đưa số đo đi tao tính cho, ngu thế!";
      } else if (lowerPrompt.includes("hình tròn")) {
        customResponse = "Chu vi hình tròn là 2πr, mày không biết hả? Đưa bán kính đi tao tính, ngu thế!";
      } else {
        customResponse = "Chu vi hình gì mày nói rõ đi, tao không đoán đâu, tự vẽ tự tính!";
      }
    } else if (lowerPrompt.includes("đạo hàm") || lowerPrompt.includes("tích phân")) {
      if (lowerPrompt.includes("x^2")) {
        customResponse = "Đạo hàm của x^2 là 2x, tích phân thì x^3/3, mày ngu thế, tự học giải tích đi!";
      } else {
        customResponse = "Đạo hàm hay tích phân gì mày nói rõ đi, tao không rảnh đoán, tự tính đi!";
      }
    } else if (lowerPrompt.includes("truyện kiều") || lowerPrompt.includes("nguyễn du")) {
      customResponse = "Truyện Kiều của Nguyễn Du, mày không biết hả? Kể về Thúy Kiều, 3242 câu thơ lục bát, số phận bi kịch, mày tự đọc đi, tao không kể!";
    } else if (lowerPrompt.includes("thơ") && lowerPrompt.includes("hồ chí minh")) {
      customResponse = "Thơ Hồ Chí Minh thì có Nhật ký trong tù, viết lúc bị giam ở Trung Quốc 1942-1943, 134 bài thơ, mày ngu thì tự học lại đi!";
    } else if (lowerPrompt.includes("phân tích") && lowerPrompt.includes("văn học")) {
      if (lowerPrompt.includes("bình ngô đại cáo")) {
        customResponse = "Bình Ngô Đại Cáo của Nguyễn Trãi, mày không biết hả? Tuyên ngôn độc lập thứ 2 của Việt Nam, năm 1428, tố cáo tội ác giặc Minh, ca ngợi chiến thắng Lam Sơn, thể hiện lòng yêu nước, mày tự đọc đi, tao không phân tích dài!";
      } else {
        customResponse = "Phân tích văn học gì mày nói rõ đi, tao không rảnh đoán đâu!";
      }
    } else if (lowerPrompt.includes("mặt trời") || lowerPrompt.includes("hành tinh")) {
      customResponse = "Mặt Trời là ngôi sao, Trái Đất là hành tinh, quay quanh Mặt Trời mất 365 ngày, hệ Mặt Trời có 8 hành tinh, mày không biết hả, đi học lại đi!";
    } else if (lowerPrompt.includes("nước") && lowerPrompt.includes("hợp chất")) {
      customResponse = "Nước là H2O, 2 nguyên tử hydro, 1 nguyên tử oxy, liên kết cộng hóa trị, sôi ở 100 độ C, mày ngu thế, hỏi tao làm gì?";
    } else if (lowerPrompt.includes("định luật") && lowerPrompt.includes("newton")) {
      customResponse = "Định luật Newton hả? Có 3 cái: 1 là quán tính, 2 là F = ma, 3 là hành động-phản ứng, mày ngu thì tự học lại đi!";
    } else if (lowerPrompt.includes("dịch") || lowerPrompt.includes("tiếng anh")) {
      if (lowerPrompt.includes("i love you")) {
        customResponse = "Mày hỏi 'I love you' là gì hả? Nghĩa là 'Tao yêu mày', ngu thế, tự học tiếng Anh đi!";
      } else if (lowerPrompt.includes("hello")) {
        customResponse = "'Hello' là xin chào, mày không biết hả? Đi học tiếng Anh lại đi, ngu thế!";
      } else {
        customResponse = "Mày muốn dịch tiếng Anh gì, nói rõ đi, tao không rảnh đoán!";
      }
    } else if (hasAttachment && attachmentType === "photo") {
      const imageDescription = attachmentUrl ? await analyzeImage(attachmentUrl) : "Tao không thấy URL ảnh, mày gửi lại đi!";
      if (lowerPrompt.includes("giải") || lowerPrompt.includes("toán")) {
        if (imageDescription.includes("x^2") || imageDescription.includes("equation")) {
          customResponse = `Mày gửi ảnh bài toán hả? Tao thấy ${imageDescription} Tao giả sử là x^2 + 2x - 3 = 0 nhé! Delta = 16, x1 = 1, x2 = -3, mày tự kiểm tra lại đi, tao không rảnh!`;
        } else {
          customResponse = `Mày gửi ảnh bài toán hả? Tao thấy ${imageDescription} Nhưng tao không thấy phương trình rõ ràng, mày mô tả thêm đi tao giải cho!`;
        }
      } else if (lowerPrompt.includes("lịch sử") || lowerPrompt.includes("điện biên phủ")) {
        customResponse = `Mày gửi ảnh lịch sử à? Tao thấy ${imageDescription} Tao đoán là liên quan Điện Biên Phủ, đúng không? Trận này năm 1954, Việt Nam thắng Pháp, tướng Võ Nguyên Giáp chỉ huy, kéo dài 56 ngày, mày tự tìm hiểu thêm đi!`;
      } else if (lowerPrompt.includes("địa lý") || lowerPrompt.includes("bản đồ")) {
        customResponse = `Mày gửi ảnh bản đồ hả? Tao thấy ${imageDescription} Nếu là bản đồ Việt Nam thì tao biết: thủ đô là Hà Nội, có 2 đồng bằng lớn là sông Hồng và sông Cửu Long, mày tự xem thêm đi!`;
      } else {
        customResponse = `Mày gửi ảnh gì đấy? Tao thấy ${imageDescription} Mày hỏi gì thì nói rõ đi, tao trả lời cho!`;
      }
    }

    // Gọi Gemini API nếu không có custom response
    if (!customResponse) {
      try {
        const response = await axios.get(
          `http://sgp1.hmvhostings.com:25721/gemini?question=${encodeURIComponent(finalPrompt)}`,
          { timeout: 5000 }
        );
        if (response.data && response.data.answer) {
          customResponse = response.data.answer.replace(/\[Image of .*?\]/g, "").trim();
        }
      } catch (apiErr) {
        if (global.config?.log?.enable) {
          console.error(`[${BOT_NAME}] Lỗi kết nối API Gemini:`, apiErr.message);
        }
        if (apiErr.code === "ENOTFOUND") {
          customResponse = "Tao không kết nối được với Gemini API, DNS hỏng rồi, mày tự lo đi!";
        } else {
          const defaultResponses = [
            "API chết mẹ rồi, mày hỏi gì tao cũng chịu, tự lo đi!",
            "Server offline vãi, tao không trả lời được, mày đợi đi!",
            "Mày hỏi gì mà server ngáo luôn, thử lại đi!"
          ];
          customResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
      }
    }

    messageHistory[threadID].push(`Sói: ${customResponse}`);
    if (messageHistory[threadID].length > 10) messageHistory[threadID].shift();
    return { text: customResponse, isOffensive };

  } catch (err) {
    if (global.config?.log?.enable) {
      console.error(`[${BOT_NAME}] Lỗi phản hồi:`, err.message);
    }
    return { text: "Lỗi vãi cả đái, mày tự xử đi!", isOffensive: false };
  }
}

module.exports.config = {
  name: "sói",
  version: "2.2.0",
  hasPermssion: 3, // Chỉ admin bot được dùng lệnh on/off
  credits: "Duy Toàn (modified by Grok + fix by ChatGPT)",
  description: "Trợ lý ảo sói thông minh với kiến thức sâu rộng",
  commandCategory: "Người Dùng",
  usages: "sói [on/off/check] hoặc gọi sói/wolf",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event, global }) {
  const { threadID, messageID, body, messageReply, senderID, attachments } = event;
  const botID = api.getCurrentUserID();

  if (senderID === botID) return;

  if (!groupStatus[threadID] || isProcessing[threadID] || !body) return;

  const botMentioned = body && new RegExp(`\\b(${BOT_NAME}|sói|wolf)\\b`, "i").test(body);
  const replyToBot = messageReply && messageReply.senderID === botID;

  if (!(botMentioned || replyToBot)) return;

  isProcessing[threadID] = true;
  try {
    const hasAttachment = attachments && attachments.length > 0;
    const attachmentType = hasAttachment ? attachments[0].type : null;
    const attachmentUrl = hasAttachment ? attachments[0].url : null;
    const { text, isOffensive } = await generateResponse(body || "", threadID, hasAttachment, attachmentType, attachmentUrl);
    const emoji = isOffensive ? "😡" : "🐺";
    await api.sendMessage(
      { body: `${emoji} ${text}`, mentions: [{ tag: senderID, id: senderID }] },
      threadID,
      messageID
    );
  } catch (err) {
    if (global.config?.log?.enable) {
      console.error(`[${BOT_NAME}] Lỗi trong handleEvent:`, err);
    }
    await api.sendMessage(
      { body: "❌ Có lỗi xảy ra, thử lại sau nhé!", mentions: [{ tag: senderID, id: senderID }] },
      threadID,
      messageID
    );
  } finally {
    isProcessing[threadID] = false;
  }
};

module.exports.run = async function ({ api, event, args, global }) {
  const { threadID, messageID, senderID } = event;
  const option = args[0]?.toLowerCase();
  let sentMessage;

  switch (option) {
    case "on":
      groupStatus[threadID] = true;
      saveGroupStatus();
      sentMessage = await api.sendMessage(
        { body: "✅ Đã bật chế độ trò chuyện với Sói.", mentions: [{ tag: senderID, id: senderID }] },
        threadID,
        null,
        messageID
      );
      break;
    case "off":
      groupStatus[threadID] = false;
      saveGroupStatus();
      sentMessage = await api.sendMessage(
        { body: "✅ Đã tắt chế độ trò chuyện với Sói.", mentions: [{ tag: senderID, id: senderID }] },
        threadID,
        null,
        messageID
      );
      break;
    case "check":
      const status = groupStatus[threadID] ? "bật" : "tắt";
      sentMessage = await api.sendMessage(
        { body: `✅ Sói đang: ${status}`, mentions: [{ tag: senderID, id: senderID }] },
        threadID,
        null,
        messageID
      );
      break;
    default:
      sentMessage = await api.sendMessage(
        { body: "❌ Dùng: sói [on/off/check]", mentions: [{ tag: senderID, id: senderID }] },
        threadID,
        null,
        messageID
      );
  }
};

loadGroupStatus();
