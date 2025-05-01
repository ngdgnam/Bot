module.exports.config = {
	name: "cardinfo",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "tpk",
	description: "",
	commandCategory: "Thành Viên",
    cooldowns: 5
};
module.exports.circle = async (image) => {
  const jimp = global.nodemodule["jimp"];
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}
module.exports.run = async ({ event, api, args, Currencies, Users}) => {
  const request = require("request");
const fs = require("fs");

   const { threadID, messageID, senderID } = event;
     var tpk = [
       "https://i.imgur.com/dZ3BoHv.png",
]
  let image = [];
 for(let i = 0; i < 1; i++) {
    const stream = (await axios.get(tpk[i], {
        responseType: "stream"
    })).data;
    image.push(stream);
};
  const msg = {
    body: `🔰====『 𝗖𝗔𝗥𝗗𝗜𝗡𝗙𝗢 𝗦𝗔𝗠𝗣𝗟𝗘 』====🔰
━━━━━━━━━━━━━━━━━━━━━━
𝟭. 𝗖𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗱𝗮̣𝗻𝗴 𝗻𝗲̂̀𝗻 𝗮𝗻𝗶𝗺𝗲 𝗰𝘂𝘁𝗲 😻
𝟮. 𝗖𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗯𝗮𝗰𝗸𝗴𝗿𝗼𝘂𝗻𝗱 đ𝗲𝗻 🖤
𝟯. 𝗖𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝘂𝘀𝗲𝗿 𝗱𝗮̣𝗻𝗴 𝗻𝗲̂̀𝗻 𝘁𝗿𝗮̆́𝗻𝗴 𝘅𝗮𝗻𝗵 💙
𝟰. 𝗕𝗮𝗰𝗸𝗴𝗿𝗼𝘂𝗻𝗱 𝗰𝗵𝗶́𝗻𝗵 𝘁𝗿𝗮̆́𝗻𝗴 𝗽𝗵𝘂̣ 𝘅𝗮𝗻𝗵 💖
𝟱. 𝗖𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗡𝗲̂̀𝗻 𝗰𝗵𝗶́𝗻𝗵 𝘁𝗶́𝗺 𝗽𝗵𝘂̣ 𝘅𝗮𝗻𝗵 💜
𝟲. 𝗖𝗮𝗿𝗱 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 𝗰𝗵𝘂̉ đ𝗲̂̀ 𝗮𝗻𝗶𝗺𝗲 💓
𝟳. 𝗖𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗻𝗲̂̀𝗻 𝗰𝗵𝗶́𝗻𝗵 𝘅𝗮𝗻𝗵 𝗹𝘂̣𝗰 𝗽𝗵𝘂̣ 𝘃𝗮̀𝗻𝗴 💚
𝟴. 𝗖𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗻𝗲̂̀𝗻 𝗻𝗴𝗼𝗮̀𝗶 𝗸𝗵𝗼̂𝗻𝗴 𝗴𝗶𝗮𝗻 🌍
𝟵. 𝗖𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗯𝗮𝗰𝗸𝗴𝗿𝗼𝘂𝗻𝗱 𝗻𝗵𝘂̛̃𝗻𝗴 𝗻𝗴𝗼̂𝗶 𝘀𝗮𝗼 🌟
𝟭𝟬. 𝗖𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗻𝗲̂̀𝗻 𝘁𝗲̂́𝘁 𝗺𝗮̀𝘂 𝘃𝗮̀𝗻𝗴|đ𝗼̉ 🧧
𝟭𝟭. 𝗖𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗯𝗮𝗰𝗸𝗴𝗿𝗼𝘂𝗻𝗱 𝗰𝗵𝗶𝗲̂́𝗻 𝘁𝗿𝘂̛𝗼̛̀𝗻𝗴 🔫
𝟭𝟮. 𝗖𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗻𝗲̂̀𝗻 𝘁𝗿𝗮̆́𝗻𝗴 𝗺𝗮̀𝘂 𝗽𝗵𝘂̣ 𝗵𝗼̂̀𝗻𝗴 🤍
𝟭𝟯. 𝗖𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗯𝗮𝗰𝗸𝗴𝗿𝗼𝘂𝗻𝗱 𝗺𝗮́𝘆 𝗺𝗼́𝗰 🔧
𝟭𝟰. 𝗖𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗻𝗲̂̀𝗻 𝘁𝗿𝗮̆́𝗻𝗴 𝘅𝗮𝗻𝗵 🌐
𝟭𝟱. 𝗖𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝘁𝗵𝗼̂𝗻𝗴 𝘁𝗶𝗻 𝗰𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝘂𝘀𝗲𝗿 𝘃𝟯 🌸
━━━━━━━━━━━━━━━━━━━━━
⚠️ 𝗣𝗵𝗮̉𝗻 𝗵𝗼̂̀𝗶 𝘃𝗮̀𝗼 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 𝗻𝗮̀𝘆 + 𝘀𝗼̂́ 𝘁𝗵𝘂̛́ 𝘁𝘂̛̣ 𝗺𝗮̂̃𝘂 𝗺𝘂𝗼̂́𝗻 𝗹𝗮̀𝗺
💝 𝗛𝗶𝗲̣̂𝗻 𝘁𝗮̣𝗶 𝗰𝗼́ 𝟭𝟱 𝗹𝗼𝗮̣𝗶 𝗰𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗯𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝘁𝗵𝗮 𝗵𝗼̂̀ 𝗰𝗵𝗼̣𝗻`,
    attachment: image
};
        return api.sendMessage(msg, event.threadID, (error, info) => {
        
            global.client.handleReply.push({
                type: "choosee",
                name: this.config.name,
                author: event.senderID,
                messageID: info.messageID
            })
        })
    }
    module.exports.handleReply = async function ({
    args,
    event,
    Users,
    api,
    handleReply,
    Currencies,
    __GLOBAL
}) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const request = require("request");
       const nameUser = (await Users.getData(event.senderID)).name || (await Users.getInfo(envent.senderID)).name;
  let data = (await Currencies.getData(event.senderID)).ghepTime;
 
    
    switch (handleReply.type) {
    case "choosee": {
        switch (event.body) {
        case "1": {
          const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
const fontsLink = 20
const fontsInfo = 28
const colorName = "#00FF00"
       let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  let pathImg = __dirname + `/cache/${senderID}123${threadID}.png`;
  let pathAvata = __dirname + `/cache/avtuserrd.png`;
  /*                 */
const res = await api.getUserInfoV2(event.senderID);
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let bg = (
    await axios.get(encodeURI(`https://imgur.com/kSfS1wX.png`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

/*-----------------download----------------------*/
if(!fs.existsSync(__dirname+`${fonts}`)) { 
      let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
    };
/*---------------------------------------------*/

  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 50, 130, 270, 270);
if (!res.location || res.location === "Không công khai") res.location = "Không công khai";
  if (!res.birthday || res.birthday === "Không công khai") res.birthday = "Không công khai";
if (!res.relationship_status || res.relationship_status === "Không công khai") res.relationship_status = "Không công khai";
  if (!res.follow || res.follow === "Không công khai") res.follow = "Không công khai";
    var gender = res.gender == 'male' ? "Nam" : res.gender == 'female' ? "Nữ" : "Không công khai";
    var birthday = res.birthday ? `${res.birthday}` : "Không công khai";
  //var love = res.relationship_status ? `${res.relationship_status}` : "Không công khai"
  var love = res.relationship_status ? `${res.relationship_status}` : "Không công khai"
    var location = res.location ? `${res.location}` : "Không công khai"
          var hometown = res.hometown.name ? `${res.hometown.name}` : "Nó ẩn rồi"
  Canvas.registerFont(__dirname+`${fonts}`, {
        family: "Play-Bold"
    });
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#D3D3D3";
  ctx.textAlign = "start";
  fontSize = 22;
  ctx.fillText(`Full Name : ${res.name}`, 410, 172);
  ctx.fillStyle = "#99CCFF";
  ctx.textAlign = "start";
  fontSize = 22;
  ctx.fillText(`Giới tính: ${gender}`, 410, 208);
ctx.fillStyle = "#FFFFE0";
  ctx.textAlign = "start";
  fontSize = 22;
  ctx.fillText(`Followers: ${res.follow} followers`, 410, 244);
  ctx.fillStyle = "#FFE4E1";
  ctx.textAlign = "start";
  fontSize = 22;
  ctx.fillText(`Relationship: ${love}`, 410, 281);
  ctx.fillStyle = "#9AFF9A";
  ctx.textAlign = "start";
  fontSize = 22;
  ctx.fillText(`Birthday: ${birthday}`, 410, 320);
  ctx.fillStyle = "#FF6A6A";
  ctx.textAlign = "start";
  fontSize = 22;
  ctx.fillText(`Location: ${hometown}`, 410, 357);
ctx.fillStyle = "#EEC591";
  ctx.textAlign = "start";
  fontSize = 22;
  ctx.fillText(`UID Facebook: ${uid}`, 410, 397);
  ctx.font = `${fontsLink}px Play-Bold`;
  ctx.fillStyle = "#FFBBFF";
  ctx.textAlign = "start";
  fontSize = 23;  
  ctx.fillText(`Link Facebook: ${res.link}`, 30, 450);
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);
  var tpk = `
😻===「 𝗖𝗔𝗥𝗗𝗜𝗡𝗙𝗢 𝗖𝗨𝗧𝗘 」===😻
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 𝗧𝗲̂𝗻: ${res.name}
🎎 𝗚𝗶𝗼̛́𝗶 𝘁𝗶́𝗻𝗵: ${gender}
🔰 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${res.follow}
💖 𝗠𝗼̂́𝗶 𝗾𝘂𝗮𝗻 𝗵𝗲̣̂: ${love}
🎂 𝗦𝗶𝗻𝗵 𝗻𝗵𝗮̣̂𝘁: ${birthday}
🌍 𝗩𝗶̣ 𝘁𝗿𝗶́: ${hometown}
🔗 𝗨𝗜𝗗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${uid}
🌐 𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 𝗧𝗮̣𝗼 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝗰𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗰𝗵𝗼 𝗯𝗮̣𝗻, 𝗯𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝘁𝗵𝘂̛̉ 𝗻𝗵𝗶𝗲̂̀𝘂 𝗸𝗶𝗲̂̉𝘂 𝗸𝗵𝗮́𝗰`
  return api.sendMessage({body: tpk,
     attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
        case "2": {
          const sendWaiting = false; // bật hoặc tắt gửi tin nhắn "đang tạo hình ảnh, vui ồng chờ đợi...";
const textWaiting = "Đang khởi tạo hình ảnh, vui lòng chờ đợi trong giây lát";
const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
const fontsLink = 28
const fontsInfo = 35
const colorName = "#00FFFF"
          let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  let pathImg = __dirname + `/cache/1.png`;
  let pathAvata = __dirname + `/cache/2.png`;
  /*                 */
    const res = await api.getUserInfoV2(event.senderID); 
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let bg = (
    await axios.get(encodeURI(`https://i.imgur.com/rqbC4ES.jpg`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

/*-----------------download----------------------*/
if(!fs.existsSync(__dirname+`${fonts}`)) { 
      let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
    };
/*---------------------------------------------*/

  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 910, 465, 229, 229);
    var gender = res.gender == 'male' ? "Nam" : res.gender == 'female' ? "Nữ" : "Không công khai";
    var birthday = res.birthday ? `${res.birthday}` : "Nó ẩn rồi";
    var love = res.relationship_status ? `${res.relationship_status}` : "Nó ẩn rồi"
    var location = res.location.name ? `${res.location.name}` : "Nó ẩn rồi"
    var hometown = res.hometown.name ? `${res.hometown.name}` : "Nó ẩn rồi"
  Canvas.registerFont(__dirname+`${fonts}`, {
        family: "Play-Bold"
    });
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#00FFFF";
  ctx.textAlign = "start";
  fontSize = 60;
  ctx.fillText(`Tên: ${res.name}`, 340, 560);
  ctx.fillText(`Giới tính: ${gender}`, 1245, 448);
  ctx.fillText(`Follow: ${res.follow}`, 1245, 505);
  ctx.fillText(`Mối quan hệ: ${love}`, 1245, 559);
  ctx.fillText(`Sinh nhật: ${birthday}`, 1245, 616);
  ctx.fillText(`Nơi ở: ${location}`, 1245, 668);
  ctx.fillText(`Quê hương: ${hometown}`, 1245, 723);
  ctx.font = `${fontsLink}px Play-Bold`;
  ctx.fillStyle = "#FFCC33";
  ctx.textAlign = "start";
  fontSize = 60;
  ctx.fillText(`UID: ${uid}`, 840, 728);
  ctx.beginPath();
  ctx.font = `${fontsLink}px TUVBenchmark`;
  ctx.fillStyle = "#00FF00";
  ctx.textAlign = "start";
  fontSize = 60;  
  ctx.fillText(`» Profile: ${res.link}`, 41, 720);
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);
  var tpk = `
🌸===「 𝗜𝗡𝗙𝗢 𝗖𝗔𝗥𝗗 」===🌸
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 𝗧𝗲̂𝗻: ${res.name}
🎎 𝗚𝗶𝗼̛́𝗶 𝘁𝗶́𝗻𝗵: ${gender}
🔰 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${res.follow}
💖 𝗠𝗼̂́𝗶 𝗾𝘂𝗮𝗻 𝗵𝗲̣̂: ${love}
🎂 𝗦𝗶𝗻𝗵 𝗻𝗵𝗮̣̂𝘁: ${birthday}
🌍 𝗩𝗶̣ 𝘁𝗿𝗶́: ${hometown}
🔗 𝗨𝗜𝗗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${uid}
🌐 𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 𝗧𝗮̣𝗼 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝗰𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗰𝗵𝗼 𝗯𝗮̣𝗻, 𝗯𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝘁𝗵𝘂̛̉ 𝗻𝗵𝗶𝗲̂̀𝘂 𝗸𝗶𝗲̂̉𝘂 𝗸𝗵𝗮́𝗰`
  return api.sendMessage({body: tpk, attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
            case "3": {
              const sendWaiting = false; // bật hoặc tắt gửi tin nhắn "đang tạo hình ảnh, vui ồng chờ đợi...";
const textWaiting = "Đang khởi tạo hình ảnh, vui lòng chờ đợi trong giây lát";
const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
const fontsLink = 40
const fontsInfo = 28
const colorName = "#000000"
              let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  let pathImg = __dirname + `/cache/1.png`;
  let pathAvata = __dirname + `/cache/2.png`;
  /*                 */
    const res = await api.getUserInfoV2(event.senderID); 
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let bg = (
    await axios.get(encodeURI(`https://i.imgur.com/zET6S0F.png`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

/*-----------------download----------------------*/
if(!fs.existsSync(__dirname+`${fonts}`)) { 
      let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
    };
/*---------------------------------------------*/

  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 71, 65, 300, 300);
    var gender = res.gender == 'male' ? "Nam" : res.gender == 'female' ? "Nữ" : "Không công khai";
    var birthday = res.birthday ? `${res.birthday}` : "Không công khai";
    var love = res.relationship_status ? `${res.relationship_status}` : "Không công khai"
    var location = res.location.name ? `${res.location.name}` : "Không công khai"
    var hometown = res.hometown.name ? `${res.hometown.name}` : "Không công khai"
  Canvas.registerFont(__dirname+`${fonts}`, {
        family: "Play-Bold"
    });
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "start";
  fontSize = 20;
  ctx.fillText(`${gender}`, 555, 208);
  ctx.fillText(`${res.follow}`, 555, 244);
  ctx.fillText(`${love}`, 555, 281);
  ctx.fillText(`${birthday}`, 555, 320);
  ctx.fillText(`${location}`, 555, 357);
  ctx.fillText(`${uid}`, 555, 397);
  ctx.fillText(`${res.link}`, 180, 468);
  ctx.font = `${fontsLink}px Play-Bold`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "start";
  fontSize = 20;  
  ctx.fillText(`${res.name}`, 650, 150);
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);
  var tpk = `
🧸===「 𝗖𝗔𝗥𝗗𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」===🧸
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 𝗧𝗲̂𝗻: ${res.name}
🎎 𝗚𝗶𝗼̛́𝗶 𝘁𝗶́𝗻𝗵: ${gender}
🔰 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${res.follow}
💖 𝗠𝗼̂́𝗶 𝗾𝘂𝗮𝗻 𝗵𝗲̣̂: ${love}
🎂 𝗦𝗶𝗻𝗵 𝗻𝗵𝗮̣̂𝘁: ${birthday}
🌍 𝗩𝗶̣ 𝘁𝗿𝗶́: ${location}
🔗 𝗨𝗜𝗗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${uid}
🌐 𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 𝗧𝗮̣𝗼 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝗰𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗰𝗵𝗼 𝗯𝗮̣𝗻, 𝗯𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝘁𝗵𝘂̛̉ 𝗻𝗵𝗶𝗲̂̀𝘂 𝗸𝗶𝗲̂̉𝘂 𝗸𝗵𝗮́𝗰`
  return api.sendMessage({body: tpk ,attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
          case "4": {
              const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
const fontsLink = 20
const fontsInfo = 28
const colorName = "#000000"
              let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  let pathImg = __dirname + `/cache/${senderID}123${threadID}.png`;
  let pathAvata = __dirname + `/cache/avtuserrd.png`;
  /*                 */
  if(event.type == "message_reply") { uid = event.messageReply.senderID }
    else uid = event.senderID;
    const res = await api.getUserInfoV2(event.senderID);
      let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let bg = (
    await axios.get(encodeURI(`https://i.imgur.com/C8yIgMZ.png`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

/*-----------------download----------------------*/
if(!fs.existsSync(__dirname+`${fonts}`)) { 
      let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
    };
/*---------------------------------------------*/

  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 610, 83, 255, 255);
    if (!res.location || res.location === "Không Có Dữ Liệu") res.location = "Không Công Khai";
  if (!res.birthday || res.birthday === "Không Có Dữ Liệu") res.birthday = "Không Công Khai";
if (!res.relationship_status || res.relationship_status === "Không Có Dữ Liệu") res.relationship_status = "Không Công Khai";
  if (!res.follow || res.follow === "Không Có Dữ Liệu") res.follow = "Không Công Khai";
    var gender = res.gender == 'male' ? "Nam" : res.gender == 'female' ? "Nữ" : "Không Công Khai";
    var birthday = res.birthday ? `${res.birthday}` : "Không Công Khai";
    var love = res.relationship_status ? `${res.relationship_status}` : "Không Công Khai"
    var location = res.location ? `${res.location}` : "Không Công Khai"
            var hometown = res.hometown.name ? `${res.hometown.name}` : "Nó ẩn rồi"
  Canvas.registerFont(__dirname+`${fonts}`, {
        family: "Play-Bold"
    });
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "start";
  fontSize = 29;
  ctx.fillText(`${res.name}`, 111, 160);
  ctx.fillText(`${gender}`, 111, 320);
  ctx.fillText(`${res.follow}`, 111, 240);
  ctx.fillText(`${love}`, 111, 200);
  ctx.fillText(`${birthday}`, 111, 280);
  ctx.fillText(`${hometown}`, 111, 360);
  ctx.fillText(`${uid}`, 1010, 460);
  ctx.font = `${fontsLink}px Play-Bold`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "start";
  fontSize = 20;  
  ctx.fillText(`${res.link} `, 145, 470)
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);
  var tpk = `
2️⃣===「 𝗖𝗔𝗥𝗗𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥𝗩𝟮 」===2️⃣
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 𝗧𝗲̂𝗻: ${res.name}
🎎 𝗚𝗶𝗼̛́𝗶 𝘁𝗶́𝗻𝗵: ${gender}
🔰 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${res.follow}
💖 𝗠𝗼̂́𝗶 𝗾𝘂𝗮𝗻 𝗵𝗲̣̂: ${love}
🎂 𝗦𝗶𝗻𝗵 𝗻𝗵𝗮̣̂𝘁: ${birthday}
🌍 𝗩𝗶̣ 𝘁𝗿𝗶́: ${hometown}
🔗 𝗨𝗜𝗗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${uid}
🌐 𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 𝗧𝗮̣𝗼 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝗰𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗰𝗵𝗼 𝗯𝗮̣𝗻, 𝗯𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝘁𝗵𝘂̛̉ 𝗻𝗵𝗶𝗲̂̀𝘂 𝗸𝗶𝗲̂̉𝘂 𝗸𝗵𝗮́𝗰`
  return api.sendMessage({body: tpk ,attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
          case "5": {
            const sendWaiting = true; // bật hoặc tắt gửi tin nhắn "đang tạo hình ảnh, vui ồng chờ đợi...";
const textWaiting = "Đang khởi tạo hình ảnh, vui lòng chờ đợi trong giây lát";
const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
const fontsLink = 20
const fontsInfo = 28
const colorName = "#00FFFF"
            let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  let pathImg = __dirname + `/cache/1.png`;
  let pathAvata = __dirname + `/cache/2.png`;
  /*                 */
  if(event.type == "message_reply") { uid = event.messageReply.senderID }
    else uid = event.senderID;
    const res = await api.getUserInfoV2(event.senderID); 
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let bg = (
    await axios.get(encodeURI(`https://i.imgur.com/8UaB48J.png`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

/*-----------------download----------------------*/
if(!fs.existsSync(__dirname+`${fonts}`)) { 
      let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
    };
/*---------------------------------------------*/

  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 80, 73, 285, 285);
    var gender = res.gender == 'male' ? "Nam" : res.gender == 'female' ? "Nữ" : "Không công khai";
    var birthday = res.birthday ? `${res.birthday}` : "not found";
    var love = res.relationship_status ? `${res.relationship_status}` : "not found"
    var location = res.location.name ? `${res.location.name}` : "not found"
    var hometown = res.hometown.name ? `${res.hometown.name}` : "not found"
  Canvas.registerFont(__dirname+`${fonts}`, {
        family: "Play-Bold"
    });
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#00FFFF";
  ctx.textAlign = "start";
  fontSize = 20;
  ctx.fillText(`» Tên Facebook: ${res.name}`, 455, 172);
  ctx.fillText(`» Giới tính: ${gender}`, 455, 208);
  ctx.fillText(`» Follow: ${res.follow}`, 455, 244);
  ctx.fillText(`» Mối quan hệ: ${love}`, 455, 281);
  ctx.fillText(`» Sinh nhật: ${birthday}`, 455, 320);
  ctx.fillText(`» Nơi ở: ${location}`, 455, 357);
  ctx.fillText(`» Quê hương: ${hometown}`, 455, 390);
  ctx.fillText(`» UID: ${uid}`, 455, 425);
  ctx.font = `${fontsLink}px Play-Bold`;
  ctx.fillStyle = "#00FF33";
  ctx.textAlign = "start";
  fontSize = 20;  
  ctx.fillText(`» Profile: ${res.link}`, 19, 468);
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);
  var tpk = `
🆕===「 𝗖𝗔𝗥𝗗𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥𝗩𝟯 」===🆕
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 𝗧𝗲̂𝗻: ${res.name}
🎎 𝗚𝗶𝗼̛́𝗶 𝘁𝗶́𝗻𝗵: ${gender}
🔰 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${res.follow}
💖 𝗠𝗼̂́𝗶 𝗾𝘂𝗮𝗻 𝗵𝗲̣̂: ${love}
🎂 𝗦𝗶𝗻𝗵 𝗻𝗵𝗮̣̂𝘁: ${birthday}
🌍 𝗩𝗶̣ 𝘁𝗿𝗶́: ${hometown}
🔗 𝗨𝗜𝗗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${uid}
🌐 𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 𝗧𝗮̣𝗼 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝗰𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗰𝗵𝗼 𝗯𝗮̣𝗻, 𝗯𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝘁𝗵𝘂̛̉ 𝗻𝗵𝗶𝗲̂̀𝘂 𝗸𝗶𝗲̂̉𝘂 𝗸𝗵𝗮́𝗰`
  return api.sendMessage({body: tpk
    ,attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
          case "6":
            {
              const sendWaiting = true; // bật hoặc tắt gửi tin nhắn "đang tạo hình ảnh, vui ồng chờ đợi...";
const textWaiting = "Đang khởi tạo hình ảnh, vui lòng chờ đợi trong giây lát";
const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
const fontsLink = 40
const fontsInfo = 28
const colorName = "#000000"
let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  let pathImg = __dirname + `/cache/1.png`;
  let pathAvata = __dirname + `/cache/2.png`;
  /*                 */
  if(event.type == "message_reply") { uid = event.messageReply.senderID }
    else uid = event.senderID;
    const res = await api.getUserInfoV2(event.senderID); 
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let bg = (
    await axios.get(encodeURI(`https://i.imgur.com/AJdZtK9.jpg`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

/*-----------------download----------------------*/
if(!fs.existsSync(__dirname+`${fonts}`)) { 
      let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
    };
/*---------------------------------------------*/

  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 910, 465, 229, 229);
    var gender = res.gender == 'male' ? "Nam" : res.gender == 'female' ? "Nữ" : "LGBT";
    var birthday = res.birthday ? `${res.birthday}` : "Ẩn";
    var love = res.relationship_status ? `${res.relationship_status}` : "Ẩn"
    var location = res.location.name ? `${res.location.name}` : "Ẩn"
    var hometown = res.hometown.name ? `${res.hometown.name}` : "Ẩn"
  Canvas.registerFont(__dirname+`${fonts}`, {
        family: "Play-Bold"
    });
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "start";
  fontSize = 29;
  ctx.fillText(`${res.name}`, 640, 166);
  ctx.fillText(`Giới tính: ${gender}`, 590, 210);
  ctx.fillText(`Follow: ${res.follow}`, 590, 245);
  ctx.fillText(`Mối quan hệ: ${love}`, 590, 280);
  ctx.fillText(`Sinh nhật: ${birthday}`, 590, 320);
  ctx.fillText(`Nơi ở: ${location}`, 590, 360);
  ctx.fillText(`UID: ${uid}`, 590, 400);
  ctx.font = `${fontsLink}px Play-Bold`;
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "start";
  fontSize = 29;
  ctx.fillText(`${uid}`, 0, 0);
  ctx.beginPath();
  ctx.font = `${fontsLink}px TUVBenchmark`;
  ctx.fillStyle = "#00FF00";
  ctx.textAlign = "start";
  fontSize = 29;  
  ctx.fillText(`» Profile: ${res.link}`, 41, 720);
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);
  var tpk = `
🎨===「 𝗖𝗔𝗥𝗗𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥𝗩𝟰 」===🎨
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 𝗧𝗲̂𝗻: ${res.name}
🎎 𝗚𝗶𝗼̛́𝗶 𝘁𝗶́𝗻𝗵: ${gender}
🔰 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${res.follow}
💖 𝗠𝗼̂́𝗶 𝗾𝘂𝗮𝗻 𝗵𝗲̣̂: ${love}
🎂 𝗦𝗶𝗻𝗵 𝗻𝗵𝗮̣̂𝘁: ${birthday}
🌍 𝗩𝗶̣ 𝘁𝗿𝗶́: ${location}
🔗 𝗨𝗜𝗗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${uid}
🌐 𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 𝗧𝗮̣𝗼 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝗰𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗰𝗵𝗼 𝗯𝗮̣𝗻, 𝗯𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝘁𝗵𝘂̛̉ 𝗻𝗵𝗶𝗲̂̀𝘂 𝗸𝗶𝗲̂̉𝘂 𝗸𝗵𝗮́𝗰`
  return api.sendMessage(
 {body: tpk ,attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
          case "7":
            {
              const sendWaiting = true; // bật hoặc tắt gửi tin nhắn "đang tạo hình ảnh, vui ồng chờ đợi...";
const textWaiting = "Đang khởi tạo hình ảnh, vui lòng chờ đợi trong giây lát";
const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
const fontsLink = 20
const fontsInfo = 28
const colorName = "#00FFFF"
              let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  let pathImg = __dirname + `/cache/44.png`;
  let pathAvata = __dirname + `/cache/33.png`;
  /*                 */
  if(event.type == "message_reply") { uid = event.messageReply.senderID }
    else uid = event.senderID;
    const res = await api.getUserInfoV2(event.senderID); 
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let bg = (
    await axios.get(encodeURI(`https://i.imgur.com/ufsPjwE.png`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

/*-----------------download----------------------*/
if(!fs.existsSync(__dirname+`${fonts}`)) { 
      let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
    };
/*---------------------------------------------*/

  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 855, 70, 350,350);
    var gender = res.gender == 'male' ? "Nam" : res.gender == 'female' ? "Nữ" : "Không công khai";
    var birthday = res.birthday ? `${res.birthday}` : "Không tìm thấy thông tin";
    var love = res.relationship_status ? `${res.relationship_status}` : "Không tìm thấy thông tin"
  Canvas.registerFont(__dirname+`${fonts}`, {
        family: "Play-Bold"
    });
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#FFCC33";
  ctx.textAlign = "start";
  fontSize = 30;
  ctx.fillText(`${res.name}`, 130, 130);
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#FFCC33";
  ctx.textAlign = "start";
  fontSize = 20;
  ctx.fillText(`>>  Giới tính:   ${gender}`, 70, 180);
  ctx.fillText(`>>  Follow:   ${res.follow}`, 70, 230);
  ctx.fillText(`>>  Mối quan hệ:   ${love}`, 70, 280);
  ctx.fillText(`>>  Ngày sinh:   ${birthday}`, 70, 330);
  ctx.fillText(`>>  UID:   ${uid}`, 70, 380);
  ctx.font = `${fontsLink}px Play-Bold`;
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "start";
  fontSize = 30;  
  ctx.fillText(`Profile:  ${res.link}`, 50, 450);
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);
  
  return api.sendMessage(
    {body: `
🎨===「 𝗖𝗔𝗥𝗗𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」===🎨
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 𝗧𝗲̂𝗻: ${res.name}
🎎 𝗚𝗶𝗼̛́𝗶 𝘁𝗶́𝗻𝗵: ${gender}
🔰 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${res.follow}
💖 𝗠𝗼̂́𝗶 𝗾𝘂𝗮𝗻 𝗵𝗲̣̂: ${love}
🎂 𝗦𝗶𝗻𝗵 𝗻𝗵𝗮̣̂𝘁: ${birthday}
🌍 𝗩𝗶̣ 𝘁𝗿𝗶́: ${location}
🔗 𝗨𝗜𝗗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${uid}
🌐 𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 𝗧𝗮̣𝗼 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝗰𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗰𝗵𝗼 𝗯𝗮̣𝗻, 𝗯𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝘁𝗵𝘂̛̉ 𝗻𝗵𝗶𝗲̂̀𝘂 𝗸𝗶𝗲̂̉𝘂 𝗸𝗵𝗮́𝗰`, attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
          case "8": {
            const sendWaiting = true; // bật hoặc tắt gửi tin nhắn "đang tạo hình ảnh, vui ồng chờ đợi...";
const textWaiting = "Đang khởi tạo hình ảnh, vui lòng chờ đợi trong giây lát";
const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/file/d/1lJLhIHU7CScUsidr-MrxDIOyuayq41pO/view?usp=drivesdk"
const fontsLink = 18
const fontsInfo = 25
const colorName = "#00FFFF"
            let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  let pathImg = __dirname + `/cache/44.png`;
  let pathAvata = __dirname + `/cache/33.png`;
  /*                 */
  if(event.type == "message_reply") { uid = event.messageReply.senderID }
    else uid = event.senderID;
    const res = await api.getUserInfoV2(event.senderID); 
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let bg = (
    await axios.get(encodeURI(`https://i.imgur.com/kPDp0s7.jpg`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

/*-----------------download----------------------*/
if(!fs.existsSync(__dirname+`${fonts}`)) { 
      let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
    };
/*---------------------------------------------*/

  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 45, 63,290,290);
    var gender = res.gender == 'male' ? "Nam" : res.gender == 'female' ? "Nữ" : "Không công khai";
    var birthday = res.birthday ? `${res.birthday}` : "unfinished";
    var love = res.relationship_status ? `${res.relationship_status}` : "unfinished"
  Canvas.registerFont(__dirname+`${fonts}`, {
        family: "Play-Bold"
    });
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#ffcc00";
  ctx.textAlign = "start";
  fontSize = 20;
  ctx.fillText(`Tên: ${res.name}`, 720, 230);
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#ffcc00";
  ctx.textAlign = "start";
  fontSize = 15;
  ctx.fillText(`Giới tính:   ${gender}`, 720, 255);
  ctx.fillText(`Follow:   ${res.follow}`, 720, 280);
  ctx.fillText(`Mối quan hệ:   ${love}`, 720, 305);
  ctx.fillText(`Ngày sinh:   ${birthday}`, 720, 330);
  ctx.fillText(`UID:   ${uid}`, 720, 360);
  ctx.fillText(`Profile:   ${res.link}`, 620, 390);
  ctx.font = `${fontsLink}px Play-Bold`;
  ctx.fillStyle = "#ffcc00";
  ctx.textAlign = "start";
  fontSize = 15;  
  ctx.fillText(`Facebook:  ${res.name}`, 130, 385);
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);
  
  return api.sendMessage(
    {body: `
🎨===「 𝗖𝗔𝗥𝗗𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」===🎨
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 𝗧𝗲̂𝗻: ${res.name}
🎎 𝗚𝗶𝗼̛́𝗶 𝘁𝗶́𝗻𝗵: ${gender}
🔰 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${res.follow}
💖 𝗠𝗼̂́𝗶 𝗾𝘂𝗮𝗻 𝗵𝗲̣̂: ${love}
🎂 𝗦𝗶𝗻𝗵 𝗻𝗵𝗮̣̂𝘁: ${birthday}
🔗 𝗨𝗜𝗗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${uid}
🌐 𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 𝗧𝗮̣𝗼 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝗰𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗰𝗵𝗼 𝗯𝗮̣𝗻, 𝗯𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝘁𝗵𝘂̛̉ 𝗻𝗵𝗶𝗲̂̀𝘂 𝗸𝗶𝗲̂̉𝘂 𝗸𝗵𝗮́𝗰` ,attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
          case "9":
            {
              const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
const fontsLink = 45
const fontsInfo = 28
const colorName = "#000000"
              let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  let pathImg = __dirname + `/cache/${senderID}123${threadID}.png`;
  let pathAvata = __dirname + `/cache/avtuserrd.png`;
  /*                 */
  if(event.type == "message_reply") { uid = event.messageReply.senderID }
    else uid = event.senderID;
    const res = await api.getUserInfoV2(event.senderID); 
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let bg = (
    await axios.get(encodeURI(`https://i.imgur.com/fBgFUr8.png`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));
 
/*-----------------download----------------------*/
if(!fs.existsSync(__dirname+`${fonts}`)) { 
      let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
    };
/*---------------------------------------------*/
 
  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 100, 97, 255, 255);
  if (!res.location || res.location === "Không Có Dữ Liệu") res.location = "Not Found";
  if (!res.birthday || res.birthday === "Không Có Dữ Liệu") res.birthday = "Not Found";
if (!res.relationship_status || res.relationship_status === "Không Có Dữ Liệu") res.relationship_status = "Not Found";
  if (!res.follow || res.follow === "Không Có Dữ Liệu") res.follow = "Not Found";
 
    var gender = res.gender == 'male' ? "male" : res.gender == 'female' ? "female" : "Not public";
    var birthday = res.birthday ? `${res.birthday}` : "Not public";
    var love = res.relationship_status ? `${res.relationship_status}` : "Not public"
    var location = res.location ? `${res.location}` : "Not public"
  Canvas.registerFont(__dirname+`${fonts}`, {
        family: "Play-Bold"
    });
      ctx.font = `${fontsInfo}px Play-Bold`;
      ctx.fillStyle = "#ffff";
      ctx.textAlign = "start";
         var fontSize = 20;
      ctx.fillText(`» Name: ${res.name}`, 455, 172);
      ctx.fillText(`» Sex: ${gender}`, 455, 208);
      ctx.fillText(`» Follow: ${res.follow}`, 455, 244);
      ctx.fillText(`» Relationship: ${love}`, 455, 281);
      ctx.fillText(`» Birthday: ${birthday}`, 455, 320);
      ctx.fillText(`» Location: ${location}`, 455, 357);
      ctx.fillText(`» UID: ${uid}`, 455, 397);
      ctx.font = `${fontsLink}px Play-Bold`;
      ctx.fillStyle = "#ffff";
      ctx.textAlign = "start";
      fontSize = 20;
      ctx.fillText(`» Profile: ${res.link}`, 19, 468);
      ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);
  
  return api.sendMessage(
    {body: `
🎨===「 𝗖𝗔𝗥𝗗𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」===🎨
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 𝗧𝗲̂𝗻: ${res.name}
🎎 𝗚𝗶𝗼̛́𝗶 𝘁𝗶́𝗻𝗵: ${gender}
🔰 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${res.follow}
💖 𝗠𝗼̂́𝗶 𝗾𝘂𝗮𝗻 𝗵𝗲̣̂: ${love}
🎂 𝗦𝗶𝗻𝗵 𝗻𝗵𝗮̣̂𝘁: ${birthday}
🌍 𝗩𝗶̣ 𝘁𝗿𝗶́: ${location}
🔗 𝗨𝗜𝗗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${uid}
🌐 𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 𝗧𝗮̣𝗼 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝗰𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗰𝗵𝗼 𝗯𝗮̣𝗻, 𝗯𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝘁𝗵𝘂̛̉ 𝗻𝗵𝗶𝗲̂̀𝘂 𝗸𝗶𝗲̂̉𝘂 𝗸𝗵𝗮́𝗰`, attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
          case "10": {
            const sendWaiting = true; // bật hoặc tắt gửi tin nhắn "đang tạo hình ảnh, vui ồng chờ đợi...";
const textWaiting = "Đang khởi tạo hình ảnh, vui lòng chờ đợi trong giây lát";
const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/file/d/1lJLhIHU7CScUsidr-MrxDIOyuayq41pO/view?usp=drivesdk"
const fontsLink = 11
const fontsInfo = 18
const colorName = "#00FFFF"
            let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  let pathImg = __dirname + `/cache/44.png`;
  let pathAvata = __dirname + `/cache/33.png`;
  /*                 */
  if(event.type == "message_reply") { uid = event.messageReply.senderID }
    else uid = event.senderID;
    const res = await api.getUserInfoV2(event.senderID); 
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let bg = (
    await axios.get(encodeURI(`https://i.imgur.com/CECvNsj.jpg`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

/*-----------------download----------------------*/
if(!fs.existsSync(__dirname+`${fonts}`)) { 
      let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
    };
/*---------------------------------------------*/

  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 50, 135,270, 270);
    var gender = res.gender == 'male' ? "Nam" : res.gender == 'female' ? "Nữ" : "Không công khai";
    var birthday = res.birthday ? `${res.birthday}` : "Không tìm thấy thông tin";
            //var hometown = res.hometown.name ? `${res.hometown.name}` : "not foun
    var love = res.relationship_status ? `${res.relationship_status}` : "Không tìm thấy thông tin"
  Canvas.registerFont(__dirname+`${fonts}`, {
        family: "Play-Bold"
    });
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#008844";
  ctx.textAlign = "start";
  fontSize = 20;
  ctx.fillText(`Tên: ${res.name}`, 600, 210);
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#008844";
  ctx.textAlign = "start";
  fontSize = 15;
  ctx.fillText(`Giới tính:   ${gender}`, 540, 230);
  ctx.fillText(`Follow:   ${res.follow}`, 540, 250);
  ctx.fillText(`Mối quan hệ:   ${love}`, 540, 270);
  ctx.fillText(`Ngày sinh:   ${birthday}`, 540, 290);
  ctx.font = `${fontsLink}px Play-Bold`;
  ctx.fillStyle = "#008844";
  ctx.textAlign = "start";
  fontSize = 15;  
  ctx.fillText(`URL:  ${res.link}`, 560, 120);
  ctx.fillText(`UID:   ${uid}`, 560, 140);
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);
  
  return api.sendMessage(
{body: `
🎨===「 𝗖𝗔𝗥𝗗𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」===🎨
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 𝗧𝗲̂𝗻: ${res.name}
🎎 𝗚𝗶𝗼̛́𝗶 𝘁𝗶́𝗻𝗵: ${gender}
🔰 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${res.follow}
💖 𝗠𝗼̂́𝗶 𝗾𝘂𝗮𝗻 𝗵𝗲̣̂: ${love}
🎂 𝗦𝗶𝗻𝗵 𝗻𝗵𝗮̣̂𝘁: ${birthday}
🔗 𝗨𝗜𝗗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${uid}
🌐 𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 𝗧𝗮̣𝗼 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝗰𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗰𝗵𝗼 𝗯𝗮̣𝗻, 𝗯𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝘁𝗵𝘂̛̉ 𝗻𝗵𝗶𝗲̂̀𝘂 𝗸𝗶𝗲̂̉𝘂 𝗸𝗵𝗮́𝗰` ,attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
          case "11": {
            const sendWaiting = true; // bật hoặc tắt gửi tin nhắn "đang tạo hình ảnh, vui ồng chờ đợi...";
const textWaiting = "Đang khởi tạo hình ảnh, vui lòng chờ đợi trong giây lát";
const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
const fontsName = 210
const fontsLink = 30
const fontsInfo = 190
const fontsUid = 190
const colorName = "#00FFFF"
            let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  let pathImg = __dirname + `/cache/1.png`;
  let pathAvata = __dirname + `/cache/2.png`;
  /*                 */
 if(event.type == "message_reply") { uid = event.messageReply.senderID }
    else uid = event.senderID;
    const res = await api.getUserInfoV2(event.senderID); 
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let bg = (
    await axios.get(encodeURI(`https://i.imgur.com/XqJB9vX.jpg`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));
/*-----------------download----------------------*/
if(!fs.existsSync(__dirname+`${fonts}`)) { 
      let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
    };
/*---------------------------------------------*/

  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 267, 628, 692, 692);
    var gender = res.gender == 'male' ? "Nam" : res.gender == 'female' ? "Nữ" : "Private";
    var birthday = res.birthday ? `${res.birthday}` : "Private";
    var love = res.relationship_status ? `${res.relationship_status}` : "Private"
    var location = res.location.name ? `${res.location.name}` : "Private"
    var hometown = res.hometown.name ? `${res.hometown.name}` : "Private"
  Canvas.registerFont(__dirname+`${fonts}`, {
        family: "Play-Bold"
    });
  ctx.font = `${fontsName}px Play-Bold`;
  ctx.fillStyle = "#00FF00";
  ctx.textAlign = "start";
  fontSize = 20;
  ctx.fillText(`${res.name}`, 1200, 260);
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "start";
  fontSize = 20;
  ctx.fillText(`Giới tính: ${gender}`, 1505, 830);
  ctx.fillText(`Follow: ${res.follow}`, 1505, 1060);
  ctx.fillText(`Mối quan hệ: ${love}`, 1505, 1310);
  ctx.fillText(`Sinh nhật: ${birthday}`, 1505, 550);
  ctx.fillText(`Nơi ở: ${location}`, 1505, 1600);
  ctx.fillText(`Quê hương: ${hometown}`, 1505, 1850);
  ctx.font = `${fontsUid}px Play-Bold`;
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "start";
  fontSize = 20;  
  ctx.fillText(`${uid}`, 1505, 2100);
  ctx.font = `${fontsLink}px Play-Bold`;
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "start";
  fontSize = 20;  
  //ctx.fillText(`» Profile: ${res.link}`, 200, 400);
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);
  
  return api.sendMessage(
    {body:`
🎨===「 𝗖𝗔𝗥𝗗𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」===🎨
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 𝗧𝗲̂𝗻: ${res.name}
🎎 𝗚𝗶𝗼̛́𝗶 𝘁𝗶́𝗻𝗵: ${gender}
🔰 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${res.follow}
💖 𝗠𝗼̂́𝗶 𝗾𝘂𝗮𝗻 𝗵𝗲̣̂: ${love}
🎂 𝗦𝗶𝗻𝗵 𝗻𝗵𝗮̣̂𝘁: ${birthday}
🌍 𝗩𝗶̣ 𝘁𝗿𝗶́: ${hometown}
🔗 𝗨𝗜𝗗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${uid}
🌐 𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 𝗧𝗮̣𝗼 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝗰𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗰𝗵𝗼 𝗯𝗮̣𝗻, 𝗯𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝘁𝗵𝘂̛̉ 𝗻𝗵𝗶𝗲̂̀𝘂 𝗸𝗶𝗲̂̉𝘂 𝗸𝗵𝗮́𝗰` , attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
          case "12": {
            const sendWaiting = true; // bật hoặc tắt gửi tin nhắn "đang tạo hình ảnh, vui ồng chờ đợi...";
const textWaiting = "Đang khởi tạo hình ảnh, vui lòng chờ đợi trong giây lát";
const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
const fontsName = 35
const fontsLink = 30
const fontsInfo = 25
const fontsUid = 30
const colorName = "#00FFFF"
            let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  let pathImg = __dirname + `/cache/1.png`;
  let pathAvata = __dirname + `/cache/2.png`;
  /*                 */
  if(event.type == "message_reply") { uid = event.messageReply.senderID }
    else uid = event.senderID;
    const res = await api.getUserInfoV2(event.senderID); 
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let bg = (
    await axios.get(encodeURI(`https://i.imgur.com/Xa1ybRA.jpg`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

/*-----------------download----------------------*/
if(!fs.existsSync(__dirname+`${fonts}`)) { 
      let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
    };
/*---------------------------------------------*/

  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 44, 150, 157, 157);
    var gender = res.gender == 'male' ? "Nam" : res.gender == 'female' ? "Nữ" : "Private";
    var birthday = res.birthday ? `${res.birthday}` : "Private";
    var love = res.relationship_status ? `${res.relationship_status}` : "Private"
    var location = res.location.name ? `${res.location.name}` : "Private"
    var hometown = res.hometown.name ? `${res.hometown.name}` : "Private"
  Canvas.registerFont(__dirname+`${fonts}`, {
        family: "Play-Bold"
    });
  ctx.font = `${fontsName}px Play-Bold`;
  ctx.fillStyle = "#FF0000";
  ctx.textAlign = "start";
  fontSize = 20;
  ctx.fillText(`${res.name}`, 172, 100);
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "start";
  fontSize = 20;
  ctx.fillText(`Giới tính: ${gender}`, 260, 217);
  ctx.fillText(`Follow: ${res.follow}`, 260, 257);
  ctx.fillText(`Mối quan hệ: ${love}`, 260, 295);
  ctx.fillText(`Sinh nhật: ${birthday}`, 260, 177);
  ctx.fillText(`Nơi ở: ${location}`, 260, 333);
  ctx.fillText(`Quê hương: ${hometown}`, 260, 372);
  ctx.font = `${fontsUid}px Play-Bold`;
  ctx.fillStyle = "#000033";
  ctx.textAlign = "start";
  fontSize = 20;  
  ctx.fillText(`${uid}`, 197, 423);
  ctx.font = `${fontsLink}px Play-Bold`;
  ctx.fillStyle = "#FF9999";
  ctx.textAlign = "start";
  fontSize = 20;  
  //ctx.fillText(`» Profile: ${res.link}`, 200, 400);
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);
  
  return api.sendMessage(
    {body: `
🎨===「 𝗖𝗔𝗥𝗗𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」===🎨
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 𝗧𝗲̂𝗻: ${res.name}
🎎 𝗚𝗶𝗼̛́𝗶 𝘁𝗶́𝗻𝗵: ${gender}
🔰 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${res.follow}
💖 𝗠𝗼̂́𝗶 𝗾𝘂𝗮𝗻 𝗵𝗲̣̂: ${love}
🎂 𝗦𝗶𝗻𝗵 𝗻𝗵𝗮̣̂𝘁: ${birthday}
🌍 𝗩𝗶̣ 𝘁𝗿𝗶́: ${hometown}
🔗 𝗨𝗜𝗗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${uid}
🌐 𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 𝗧𝗮̣𝗼 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝗰𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗰𝗵𝗼 𝗯𝗮̣𝗻, 𝗯𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝘁𝗵𝘂̛̉ 𝗻𝗵𝗶𝗲̂̀𝘂 𝗸𝗶𝗲̂̉𝘂 𝗸𝗵𝗮́𝗰`, attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
          case "13": {
            const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
const fontsLink = 5
const fontsInfo = 30
const colorName = "#000000"
            let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  let pathImg = __dirname + `/cache/${senderID}123${threadID}.png`;
  let pathAvata = __dirname + `/cache/avtuserrd.png`;
  /*                 */
  if(event.type == "message_reply") { uid = event.messageReply.senderID }
    else uid = event.senderID;
    const res = await api.getUserInfoV2(event.senderID); 
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let bg = (
    await axios.get(encodeURI(`https://i.imgur.com/nX5W2Ru.jpg`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

/*-----------------download----------------------*/
if(!fs.existsSync(__dirname+`${fonts}`)) { 
      let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
    };
/*---------------------------------------------*/

  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 1100, 550, 400, 400);
    var gender = res.gender == 'male' ? "Male" : res.gender == 'female' ? "Female" : "Not Found";
    var birthday = res.birthday ? `${res.birthday}` : "Not Found";
    var love = res.relationship_status ? `${res.relationship_status}` : "Not Found"
    var location = res.location.name ? `${res.location.name}` : "Not Found"
    var hometown = res.hometown.name ? `${res.hometown.name}` : "Not Found"
  Canvas.registerFont(__dirname+`${fonts}`, {
        family: "Play-Bold"
    });
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#00bbff";
  ctx.textAlign = "start";
  fontSize = 25;
  ctx.fillText(`Name: ${res.name}`, 150, 122);
  ctx.fillText(`Gender: ${gender}`, 150, 132);
  ctx.fillText(`Followers: ${res.follow}`, 150, 142);
  ctx.fillText(`Relationship: ${love}`, 150, 152);
  ctx.fillText(`Birthday: ${birthday}`, 150, 162);
  ctx.fillText(`Location: ${location}`, 150, 172);
  ctx.fillText(`UID: ${uid}`, 150, 182);
  ctx.font = `${fontsLink}px Play-Bold`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "start";
  fontSize = 20;  
  ctx.fillText(`${res.link} `, 180, 468);
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);
  
  return api.sendMessage(
    {body: `
🎨===「 𝗖𝗔𝗥𝗗𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」===🎨
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 𝗧𝗲̂𝗻: ${res.name}
🎎 𝗚𝗶𝗼̛́𝗶 𝘁𝗶́𝗻𝗵: ${gender}
🔰 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${res.follow}
💖 𝗠𝗼̂́𝗶 𝗾𝘂𝗮𝗻 𝗵𝗲̣̂: ${love}
🎂 𝗦𝗶𝗻𝗵 𝗻𝗵𝗮̣̂𝘁: ${birthday}
🌍 𝗩𝗶̣ 𝘁𝗿𝗶́: ${location}
🔗 𝗨𝗜𝗗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${uid}
🌐 𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 𝗧𝗮̣𝗼 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝗰𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗰𝗵𝗼 𝗯𝗮̣𝗻, 𝗯𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝘁𝗵𝘂̛̉ 𝗻𝗵𝗶𝗲̂̀𝘂 𝗸𝗶𝗲̂̉𝘂 𝗸𝗵𝗮́𝗰`, attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
          case "14":
            {
              
            const sendWaiting = true; // bật hoặc tắt gửi tin nhắn "đang tạo hình ảnh, vui ồng chờ đợi...";
const textWaiting = "Đang khởi tạo hình ảnh, vui lòng chờ đợi trong giây lát";
const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
const fontsLink = 40
const Name = 52
const fontsInfo = 50
const colorName = "#00FFFF"
let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  let pathImg = __dirname + `/cache/1.png`;
  let pathAvata = __dirname + `/cache/2.png`;
  /*                 */
  if(event.type == "message_reply") { uid = event.messageReply.senderID }
    else uid = event.senderID;
    const res = await api.getUserInfoV2(event.senderID); 
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let bg = (
    await axios.get(encodeURI(`https://i.imgur.com/TFbVhfN.jpg`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

/*-----------------download----------------------*/
if(!fs.existsSync(__dirname+`${fonts}`)) { 
      let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
    };
/*---------------------------------------------*/

  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 82, 305, 479, 479);
    var gender = res.gender == 'male' ? "Nam" : res.gender == 'female' ? "Nữ" : "Không công khai";
    var birthday = res.birthday ? `${res.birthday}` : "not found";
    var love = res.relationship_status ? `${res.relationship_status}` : "not found"
    var location = res.location.name ? `${res.location.name}` : "not found"
    var hometown = res.hometown.name ? `${res.hometown.name}` : "not found"
  Canvas.registerFont(__dirname+`${fonts}`, {
        family: "Play-Bold"
    });
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#110000";
  ctx.textAlign = "start";
  fontSize = 390;
  ctx.fillText(`: ${res.follow}`, 827, 720);
  ctx.fillText(`: ${love}`, 1005, 642);
  ctx.fillText(`: ${birthday}`, 1005, 812);
  ctx.fillText(`: ${location}`, 959, 552);
  ctx.fillText(`: ${hometown}`, 918, 462);
  ctx.fillText(`» UID: ${uid}`, 215, 868);
  ctx.font = `${Name}px Play-Bold`;
  ctx.fillStyle = "#003300";
  ctx.textAlign = "start";
  fontSize = 390;    
  ctx.fillText(` ${res.name} `, 682, 375);
  ctx.beginPath();
  ctx.font = `${fontsLink}px ArialUnicodeMS`;
  ctx.fillStyle = "#FF0000";
  ctx.textAlign = "start";
  fontSize = 390;    
  ctx.fillText(` ${res.link}`, 323, 918);
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);
  
  return api.sendMessage(
    {body: `
🎨===「 𝗖𝗔𝗥𝗗𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」===🎨
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 𝗧𝗲̂𝗻: ${res.name}
🎎 𝗚𝗶𝗼̛́𝗶 𝘁𝗶́𝗻𝗵: ${gender}
🔰 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${res.follow}
💖 𝗠𝗼̂́𝗶 𝗾𝘂𝗮𝗻 𝗵𝗲̣̂: ${love}
🎂 𝗦𝗶𝗻𝗵 𝗻𝗵𝗮̣̂𝘁: ${birthday}
🌍 𝗩𝗶̣ 𝘁𝗿𝗶́: ${hometown}
🔗 𝗨𝗜𝗗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${uid}
🌐 𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 𝗧𝗮̣𝗼 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝗰𝗮𝗿𝗱𝗶𝗻𝗳𝗼 𝗰𝗵𝗼 𝗯𝗮̣𝗻, 𝗯𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝘁𝗵𝘂̛̉ 𝗻𝗵𝗶𝗲̂̀𝘂 𝗸𝗶𝗲̂̉𝘂 𝗸𝗵𝗮́𝗰`, attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
          case "15": {
            const { loadImage, createCanvas , registerFont} = require("canvas");
  const { threadID, senderID, type, messageReply } = event;  
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
let pathImg = __dirname + "/cache/tan.png";
  let pathAvt1 = __dirname + "/cache/Avtmot.png";
  if (type == "message_reply") uid = messageReply.senderID;
  else uid = senderID;1
  var cc = await api.getUserInfoV5(event.senderID);
  //console.log(cc[0].o0.data.messaging_actors[0])
  var name = cc[0].o0.data.messaging_actors[0].name;
  var gender = cc[0].o0.data.messaging_actors[0].gender;
  var id = cc[0].o0.data.messaging_actors[0].id;
  var url = cc[0].o0.data.messaging_actors[0].url;
  var username = cc[0].o0.data.messaging_actors[0].username;
  var shortname = cc[0].o0.data.messaging_actors[0].short_name;
  var friend = cc[0].o0.data.messaging_actors[0].is_viewer_friend; 
  var cv = cc[0].o0.data.messaging_actors[0].work_info; 
  var mess = cc[0].o0.data.messaging_actors[0].is_messenger_user; 
  var chucvu = cc[0].o0.data.messaging_actors[0].is_employee; 
  var block = cc[0].o0.data.messaging_actors[0].is_message_blocked_biewer; 
  var background = ["https://i.imgur.com/Vblq0gn.jpg"];
    var rd = background[Math.floor(Math.random() * background.length)];
    let tân = (
    await axios.get(`https://graph.facebook.com/${event.senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAvt1, Buffer.from(tân, "utf-8"));
  ben = await this.circle(pathAvt1);
  let getbackground = (
    await axios.get(`${rd}`, {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));
  let font = (await axios.get(`https://github.com/hanakuUwU/font/raw/main/CaviarDreams.ttf`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname + `/tad/CaviarDreams.ttf`, Buffer.from(font, "utf-8"));
  let baseImage = await loadImage(pathImg);
    let baseAvt1 = await loadImage(ben);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvt1, 150, 115, 170, 170);
registerFont(__dirname + `/tad/CaviarDreams.ttf`, {
family: "time"
    });
    ctx.textAlign = "start";
    ctx.fillStyle = "#eae6f2";
    ctx.font = "26px time"; ctx.fillText(`Tên: ${name}\nUsername:\n${username == true ? "không có" : username}\nSex: ${gender == "MALE" ? "Trai" : "gái"}`, 470, 135)
ctx.restore();
    ctx.save();
    ctx.beginPath(); 
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAvt1);
  return api.sendMessage({
    body: `====[𝐈𝐍𝐅𝐎]====\n👤Tên: ${name}\n👁Tên chính: ${shortname}\n🤳Username: ${username == true? "không dùng" : username}\n👀Giới tính: ${gender == "MALE" ? "Trai" : "Nữ"}\n🏷Uid: ${id}\nLinkFB: ${url}\n🤝Bạn bè: ${friend == true ? "Đã kết bạn với bot" : "Chưa kết bạn với bot"}\n👋${mess == true ? "Đã nhắn với bot" : "chưa nhắn tin với bot"}\n🙄${block == true ? "Đã chặn tin nhắn bot" : "Không chặn tin nhắn bot"}\n🗺Công việc: ${cv == null ? "không có" : cv}\n💌Chức vụ: ${chucvu == null ? "Không có" : chucvu}`, attachment: fs.createReadStream(pathImg) }, event.threadID, () => fs.unlinkSync(pathImg));
} 
            break;
					default:
           const choose = parseInt(event.body);
            	if (isNaN(event.body)) return api.sendMessage("𝐕𝐮𝐢 𝐥𝐨̀𝐧𝐠 𝐧𝐡𝐚̣̂𝐩 𝟏 𝐜𝐨𝐧 𝐬𝐨̂́", event.threadID, event.messageID);
            	if (choose > 20 || choose < 1) return api.sendMessage("𝐋𝐮̛̣𝐚 𝐜𝐡𝐨̣𝐧 𝐤𝐡𝐨̂𝐧𝐠 𝐧𝐚̆̀𝐦 𝐭𝐫𝐨𝐧𝐠 𝐝𝐚𝐧𝐡 𝐬𝐚́𝐜𝐡.", event.threadID, event.messageID); 
    }
    }
}
      }