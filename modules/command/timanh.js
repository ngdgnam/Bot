const axios = require("axios"),
	fs = require("fs");
var config = {
	name: "timanh",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Thiệu Trung Kiên",
	description: "Tìm kiếm hình ảnh!",
	commandCategory: "Tìm kiếm",
	usages: "timanh",
	cooldowns: 3
},
	run = async ({ api, event, args }) => {
		if ("message_reply" != event.type || event.messageReply.attachments.length > 1) return api.sendMessage("𝐀̉𝐧𝐡 𝐜𝐚̂̀𝐧 𝐭𝐢̀𝐦 đ𝐚̂𝐮 𝐧𝐠𝐮 𝐚̀", event.threadID, event.messageID);
		var arr = [],
			image = [];
		if ("photo" == event.messageReply.attachments[0].type) {
			console.log(event.messageReply.attachments[0].url);
			const body = await axios.post("https://api.imgur.com/3/image", {
				image: event.messageReply.attachments[0].url
			}, {
				headers: {
					Authorization: "Client-ID fc9369e9aea767c"
				}
			});
			console.log(body.data.data.link), axios({
				method: "get",
				url: `https://apiimg.nguyenduong.tech/sauce?url=${body.data.data.link}`
			}).then((async res => {
				var msg = "";
				for (let i = 0; i < res.data.length && !(i >= 6); i++) {
					var name = res.data[i].title || "Không tìm thấy",
						member_name = res.data[i].member_name || "Không tìm thấy",
						url = res.data[i].url,
						thumbnail = res.data[i].thumbnail;
					const getImg = (await axios.get(thumbnail, {
						responseType: "arraybuffer"
					})).data;
					fs.writeFileSync(__dirname + `/cache/${i}.jpg`, Buffer.from(getImg)), arr.push(__dirname + `/cache/${i}.jpg`),
						image.push(fs.createReadStream(__dirname + `/cache/${i}.jpg`)),
						msg += `[ ${i + 1} ]. ${name}\n『🔎』. 𝐌𝐞𝐦𝐛𝐞𝐫 𝐍𝐚𝐦𝐞: ${member_name}\n◆━━━━━━━━━━━━━◆\n『🧸』. 𝐥𝐢𝐧𝐤 : ${url}\n\n`
				}
				return console.log(arr), api.sendMessage({
					body: msg,
					attachment: image
				}, event.threadID, (() => {
					for (let u of arr) fs.unlinkSync(u)
				}))
			}))
		}
	};
module.exports = {
	config,
	run
};