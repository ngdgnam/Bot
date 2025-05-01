const axios = require("axios");
const fs = require("fs");
const gtts = require("gtts");
const path = require("path");

module.exports.config = {
  name: "bard",
  version: "1.0.0",
  hasPermission: 0,
  credits: "tienbu",
  description: "Bard gồm voice và ảnh",
  commandCategory: "Tiện ích",
  usages: "tên lệnh + câu hỏi",
  cooldowns: 5,
};

async function convertImageToText(imageURL) {
  try {
    const response = await axios.get(`https://bard-ai.arjhilbard.repl.co/api/other/img2text?input=${encodeURIComponent(imageURL)}`);
    return response.data.extractedText;
  } catch (error) {
    console.error("Lỗi không thể tải ảnh:", error);
    return null;
  }
}

function formatFont(text) {
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹",
  };

  let formattedText = "";
  for (const char of text) {
    if (char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }
  return formattedText;
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, type, messageReply, body } = event;
  let question = "";

  if (type === "message_reply" && messageReply.attachments[0]?.type === "photo") {
    const attachment = messageReply.attachments[0];
    const imageURL = attachment.url;
    question = await convertImageToText(imageURL);

    if (!question) {
      api.sendMessage("Không thể chuyển đổi ảnh thành văn bản. Vui lòng thử lại với một bức ảnh rõ ràng hơn.", threadID, messageID);
      return;
    }
  } else {
    question = args.join(" ").trim();

    if (!question) {
      api.sendMessage("Vui lòng cung cấp câu hỏi hoặc truy vấn", threadID, messageID);
      return;
    }
  }

  api.sendMessage("🔎", threadID, messageID);

  try {

    const bardResponse = await axios.get(`https://a8417ca2-e03c-455b-9abd-c13b938d563f-00-2r3h3wdweq8ru.sisko.replit.dev/bard?ask=`);
    const bardData = bardResponse.data;
    const bardMessage = bardData.message;

    const uid = event.senderID;
    const pinterestResponse = await axios.get(`https://api-all-1.arjhilbard.repl.co/pinterest?search=${encodeURIComponent(question)}`);
    const pinterestImageUrls = pinterestResponse.data.data.slice(0, 6);

    const pinterestImageAttachments = [];



    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }

    for (let i = 0; i < pinterestImageUrls.length; i++) {
      const imageUrl = pinterestImageUrls[i];
      try {
        const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const imagePath = path.join(cacheDir, `pinterest_image${i + 1}.jpg`);
        fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, "binary"));
        pinterestImageAttachments.push(fs.createReadStream(imagePath));
      } catch (error) {
        console.error("Error fetching Pinterest image:", error);
      }
    }

    const formattedBardAnswer = ` ${formatFont(bardMessage)}`;
    api.sendMessage(formattedBardAnswer, threadID);


    const gttsPath = path.join(cacheDir, 'voice.mp3');
    const gttsInstance = new gtts(bardMessage, 'vi');
    gttsInstance.save(gttsPath, function (error, result) {
      if (error) {
        console.error("Error saving gTTS:", error);
      } else {

        api.sendMessage({
          body: "🗣️:",
          attachment: fs.createReadStream(gttsPath)
        }, threadID);
      }
    });


    if (pinterestImageAttachments.length > 0) {
      api.sendMessage(
        {
          attachment: pinterestImageAttachments,
          body: `📷 Ảnh cho câu hỏi: ${question}  `,
        },
        threadID
      );
    }
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    api.sendMessage("Đã xảy ra lỗi khi xử lý yêu cầu.", threadID, messageID);
  }
};