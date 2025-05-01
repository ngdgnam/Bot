const moment = require('moment-timezone');
const crypto = require('crypto');
const fs = require('fs');
const fse = require('fs-extra');

exports.config = {
    name: 'rent',
    version: '2.0.1',
    hasPermssion: 0,
    credits: '',
    description: 'Thuê bot.',
    commandCategory: 'Admin',
    usages: '[]',
    cooldowns: 3
};

if (!fs.existsSync(__dirname + '/cache/data')) fs.mkdirSync(__dirname + '/cache/data');
let path = __dirname + '/cache/data/thuebot.json';
let keyPath = __dirname + '/cache/data/keys.json'; 
let data = [];
let keys = [];
let saveData = () => fs.writeFileSync(path, JSON.stringify(data));
let saveKeys = () => fs.writeFileSync(keyPath, JSON.stringify(keys));
if (!fs.existsSync(path)) saveData(); else data = require(path);
if (!fs.existsSync(keyPath)) saveKeys(); else keys = require(keyPath);
let form_mm_dd_yyyy = (input = '', split = input.split('/')) => `${split[1]}/${split[0]}/${split[2]}`;

async function updateGroupNames(api) {
    for (let key of keys) {
        if (key.threadID) {
            try {
                let threadInfo = await api.getThreadInfo(key.threadID);
                key.threadName = threadInfo.threadName || key.threadName;
            } catch (err) {
                console.error(`Không thể cập nhật tên nhóm cho threadID ${key.threadID}:`, err);
            }
        }
    }
    saveKeys();
}
setInterval(() => {
    updateGroupNames(global.api);
}, 6 * 60 * 60 * 1000); 

exports.run = async function(o) {
    let send = (msg, callback) => {
        console.log(msg);
        o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
    };
    let prefix = (global.data.threadData.get(o.event.threadID) || {}).PREFIX || global.config.PREFIX;
    try {
        switch (o.args[0]) {
            case 'key': {
                if (o.event.senderID != global.config.ADMINBOT[0]) return send("Bạn không phải Admin để thực hiện lệnh này.");
                if (o.args.length < 3) {
                    return send(`❎ Dùng: ${prefix}${this.config.name} key [số ngày thuê] [số key muốn tạo] : tạo key ngẫu nhiên với số ngày thuê bot.`);
                }
                let rentalDays = parseInt(o.args[1]);
                let numKeys = parseInt(o.args[2]) || 1;
                if (isNaN(rentalDays) || rentalDays <= 0 || isNaN(numKeys) || numKeys <= 0) {
                    return send(`❎ Vui lòng nhập số ngày thuê và số key hợp lệ.`);
                }
                let createdKeys = [];
                for (let i = 0; i < numKeys; i++) {
                    let activationKey;
                    do {
                        activationKey = crypto.randomBytes(8).toString('hex');
                    } while (keys.some(key => key.activationKey === activationKey));
                    let expirationDate = moment.tz("Asia/Ho_Chi_Minh").add(rentalDays, 'days').add(1, 'days').format("DD/MM/YYYY");
                    keys.push({
                        activationKey,
                        expirationDate,
                        used: false,
                        threadID: null,
                        threadName: null,
                        userName: null
                    });
                    createdKeys.push(activationKey);
                }
                saveKeys();
                send(`✅ Đã tạo các key:\n ${createdKeys.join('\n')}\n🗓 Ngày hết hạn: ${moment.tz("Asia/Ho_Chi_Minh").add(rentalDays, 'days').add(1, 'days').format("DD/MM/YYYY")}`);
                break;
            }
            case 'info': {
                let info = data.find($ => $.t_id == o.event.threadID);
                if (!info) return send(`❎ Nhóm của bạn chưa được thuê bot, vui lòng liên hệ Admin.`);
                let now = moment().tz("Asia/Ho_Chi_Minh");
                let expirationDate = moment(form_mm_dd_yyyy(info.time_end), 'MM/DD/YYYY');
                if (expirationDate.isBefore(now)) {
                    return send(`❎ Nhóm của bạn đã hết hạn thuê bot từ ngày ${info.time_end}, vui lòng liên hệ với Admin nếu muốn tiếp tục thuê bot.`);
                }
                let botID = o.api.getCurrentUserID();
                let senderID = info.id;
                let senderName = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
                send({
                    body: `[ Thông Tin Thuê Bot ]\n\n👤 Tên người thuê: ${senderName}\n🏘️ Nhóm: ${(global.data.threadInfo.get(info.t_id) || {}).threadName}\n🔑 Key Thuê Bot: ${info.activationKey}\n📆 Ngày Thuê: ${info.time_start}\n⏳ Hết Hạn: ${info.time_end}\n📌 Còn ${(() => {
                        let time_diff = expirationDate.valueOf() - now.valueOf();
                        let days = Math.floor(time_diff / (1000 * 60 * 60 * 24));
                        let hours = Math.floor((time_diff / (1000 * 60 * 60)) % 24);
                        return `${days} ngày ${hours} giờ là hết hạn.`;
                    })()}`
                });
                break;
            }            
            case 'check': {
                if (o.event.senderID != global.config.ADMINBOT[0]) return send("Bạn không phải Admin để thực hiện lệnh này.");
                try {
                    const itemsPerPage = 10;
                    const totalPages = Math.ceil(keys.length / itemsPerPage);
                    const startIndex = (1 - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const pageKeys = keys.slice(startIndex, endIndex);
                    o.api.sendMessage(`[ Danh Sách Key ${1}/${totalPages}]\n\n${pageKeys.map((key, i) => `${i + 1}. Key: ${key.activationKey}\n🗓 Ngày hết hạn: ${key.expirationDate}\n🔎 Tình trạng: ${key.used ? 'Đã kích hoạt ✅' : 'Chưa kích hoạt ❎'}\n🏘️ Tên Nhóm: ${key.threadName || 'Không có'}\n👤 Tên Người Thuê: ${key.userName || 'Không có'}`).join('\n\n')}\n\n→ Reply del [1,2,...| all ] để xóa key.\n→ Reply giahan [số ngày muốn gia hạn] [1,2,...| all ] để gia hạn key.\n→ Reply page + số trang để xem các key khác.`, o.event.threadID, (err, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            event: o.event,
                            keys,
                            messageID: info.messageID,
                            author: o.event.senderID
                        });
                    });
                } catch (e) {
                    console.log(e);
                }
                break;
            }
            case 'update': {
                send(`🔄 Đang cập nhật tất cả tên nhóm...`);

                await updateGroupNames(o.api);
                send(`✅ Tất cả tên nhóm đã được cập nhật!`);
                break;
            }
            default:
                send(`[ Menu Thuê Bot ]\n──────────────────\n- Dùng: ${prefix}${this.config.name} key [số ngày thuê] [số key muốn tạo] : tạo key ngẫu nhiên với số ngày thuê bot\n- Dùng: ${prefix}${this.config.name} check -> Để xem danh sách các key\n- Dùng: ${prefix}${this.config.name} info -> Để xem thông tin thuê bot của nhóm.\n- Dùng: ${prefix}${this.config.name} update -> Để cập nhật tất cả tên nhóm.`);
                break;
        }
    } catch (e) {
        console.log(e);
    }
    saveData();
};

exports.handleReply = async function(o) {
    try {
        let _ = o.handleReply;
        let send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
        if (o.event.senderID != _.author) return;
        let split_body = o.event.body.split(' ');
        if (split_body[0].toLowerCase() == 'del') {
            if (split_body[1].toLowerCase() === 'all') {
                let deletedCount = _.keys.length;
                let deletedKeys = _.keys.filter(key => key.used && key.threadID);
                _.keys = [];
                data = [];
                saveKeys();
                saveData();
                send(`✅ Đã xóa ${deletedCount} key khỏi hệ thống.`);
                
                for (let key of deletedKeys) {
                    o.api.sendMessage(`[ Thông Báo Từ Admin ]\n──────────────────\n🏘️ Nhóm của bạn đã bị gỡ khỏi danh sách thuê bot\n🔑 Key: ${key.activationKey}\nNếu có sự nhầm lẫn, vui lòng liên hệ Admin.`, key.threadID);
                }
            } else {
                let keysToDelete = split_body[1].split(',').map(stt => parseInt(stt) - 1);
                let deletedCount = 0;
                let deletedKeys = [];
                keysToDelete.sort((a, b) => b - a).forEach(stt => {
                    if (_.keys[stt]) {
                        if (_.keys[stt].used && _.keys[stt].threadID) {
                            deletedKeys.push(_.keys[stt]);
                        }
                        _.keys.splice(stt, 1);
                        deletedCount++;
                    }
                });
                deletedKeys.forEach(key => {
                    let index = data.findIndex(item => item.activationKey === key.activationKey);
                    if (index !== -1) {
                        data.splice(index, 1);
                    }
                });
                saveKeys();
                saveData();
                send(`✅ Đã xóa ${deletedCount} key khỏi hệ thống.`);
                
                for (let key of deletedKeys) {
                    o.api.sendMessage(`[ Thông Báo Từ Admin ]\n──────────────────\n🏘️ Nhóm của bạn đã bị gỡ khỏi danh sách thuê bot\n🔑 Key: ${key.activationKey}\nNếu có sự nhầm lẫn, vui lòng liên hệ Admin.`, key.threadID);
                }
            }
        } else if (split_body[0].toLowerCase() == 'page') {
            const itemsPerPage = 10;
            const totalPages = Math.ceil(_.keys.length / itemsPerPage);
            const page = parseInt(split_body[1]);

            if (isNaN(page) || page < 1 || page > totalPages) {
                return send(`❎ Trang không hợp lệ. Vui lòng nhập số trang từ 1 đến ${totalPages}.`);
            }
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageKeys = _.keys.slice(startIndex, endIndex);
            send(`[ Danh Sách Key ${page}/${totalPages}]\n\n${pageKeys.map((key, i) => `${startIndex + i + 1}. Key: ${key.activationKey}\n🗓 Ngày hết hạn: ${key.expirationDate}\n🔎 Tình trạng: ${key.used ? 'Đã kích hoạt ✅' : 'Chưa kích hoạt ❎'}\n🏘️ Tên Nhóm: ${key.threadName || 'Không có'}\n👤 Tên Người Thuê: ${key.userName || 'Không có'}`).join('\n\n')}\n\n→ Nếu muốn gia hạn hoặc xoá key vui lòng Reply ở tin nhắn khi dùng /rent check ( tin nhắn này chỉ để xem danh sách key ).`, o.event.threadID, (err, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    event: o.event,
                    keys: _.keys,
                    messageID: info.messageID,
                    author: o.event.senderID
                });
            });
        } else if (split_body[0].toLowerCase() == 'giahan') {
            let extendDays = parseInt(split_body[1]);
            if (isNaN(extendDays) || extendDays <= 0) {
                return send(`❎ Vui lòng nhập số ngày gia hạn hợp lệ.`);
            }
            if (split_body[2].toLowerCase() === 'all') {
                _.keys.forEach(key => {
                    // Cộng thêm ngày từ ngày hiện tại
                    let currentExpirationDate = moment.tz('Asia/Ho_Chi_Minh');
                    let newExpirationDate = currentExpirationDate.add(extendDays, 'days');
                    key.expirationDate = newExpirationDate.format('DD/MM/YYYY');
        
                    let botData = data.find(bot => bot.activationKey === key.activationKey);
                    if (botData) {
                        botData.time_end = newExpirationDate.format('DD/MM/YYYY');
                    }
                });
                saveKeys();
                saveData();
                send(`✅ Đã gia hạn ${extendDays} ngày cho tất cả các key.`);
                for (let key of _.keys) {
                    if (key.threadID) {
                        o.api.sendMessage(`[ Thông Báo Từ Admin ]\n──────────────────\n🏘️ Nhóm của bạn đã gia hạn thêm ${extendDays} ngày từ Admin\n🔑 Key: ${key.activationKey}\nChúc bạn dùng bot vui vẻ.`, key.threadID);
                    }
                }
            } else {
                let keysToExtend = split_body[2].split(',').map(stt => parseInt(stt) - 1);
                let extendedCount = 0;
        
                keysToExtend.forEach(stt => {
                    if (_.keys[stt]) {
                        let key = _.keys[stt];
                        let currentExpirationDate = moment.tz('Asia/Ho_Chi_Minh');
                        let newExpirationDate = currentExpirationDate.add(extendDays, 'days');
                        key.expirationDate = newExpirationDate.format('DD/MM/YYYY');
                        let botData = data.find(bot => bot.activationKey === key.activationKey);
                        if (botData) {
                            botData.time_end = newExpirationDate.format('DD/MM/YYYY');
                        }
                        extendedCount++;
                        if (key.threadID) {
                            o.api.sendMessage(`[ Thông Báo Từ Admin ]\n──────────────────\n🏘️ Nhóm của bạn đã gia hạn thêm ${extendDays} ngày từ Admin\n🔑 Key: ${key.activationKey}\nChúc bạn dùng bot vui vẻ.`, key.threadID);
                        }
                    }
                });
                saveKeys();
                saveData();
                send(`✅ Đã gia hạn ${extendDays} ngày cho ${extendedCount} key.`);
            }
        }        
    } catch (e) {
        console.log(e);
    }
};

exports.handleEvent = async function(o) {
    let send = (msg, callback) => {
        o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
    };
    if (o.event.body) {
        const activationKey = o.event.body.trim();
        if (!activationKey.includes("/rent activate")) {
            const now = moment.tz('Asia/Ho_Chi_Minh');
            const key = keys.find(key => key.activationKey === activationKey);

            if (key) {
                const expirationDate = moment(form_mm_dd_yyyy(key.expirationDate), 'MM/DD/YYYY');
                console.log(`Ngày hết hạn của key: ${expirationDate.format('DD/MM/YYYY')}`);
                console.log(`Ngày hiện tại: ${now.format('DD/MM/YYYY')}`);
                if (expirationDate.isBefore(now, 'day')) { 
                    return send(`❎ Key đã hết hạn, vui lòng liên hệ Admin để lấy key khác.`);
                }
                let threadInfo = await o.api.getThreadInfo(o.event.threadID);
                const existingRental = data.find(item => item.t_id == o.event.threadID && moment(form_mm_dd_yyyy(item.time_end), 'MM/DD/YYYY').isAfter(now));
                if (existingRental) {
                    if (key.used && key.threadID === o.event.threadID) {
                        return send(`❎ Nhóm bạn đã được kích hoạt thuê bot với key ${activationKey} trước đó rồi.`);
                    } else {
                        return send(`❎ Nhóm bạn đã được kích hoạt thuê bot với key ${existingRental.activationKey} trước đó rồi.`);
                    }
                }
                if (key.used) {
                    return send(`❎ Key đã được sử dụng, vui lòng liên hệ Admin để lấy key khác.`);
                }
                let botID = o.api.getCurrentUserID();
                let senderID = o.event.senderID;
                let senderName = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
                data.push({
                    id: o.event.senderID,
                    t_id: o.event.threadID,
                    time_start: now.format('DD/MM/YYYY'),
                    time_end: key.expirationDate,
                    activationKey
                });
                saveData();
                key.used = true;
                key.threadID = o.event.threadID;
                key.threadName = threadInfo.threadName; 
                key.userName = senderName; 
                saveKeys();
                send(`[ Thông Báo Kích Hoạt ]\n──────────────────\n🏘️ Nhóm ${(global.data.threadInfo.get(o.event.threadID) || {}).threadName} của bạn đã được kích hoạt thuê bot thành công ✅.\n🔑 Key kích hoạt: ${key.activationKey}\n📆 Ngày hết hạn: ${key.expirationDate}`);
                const adminID = global.config.NDH[0];
                const activationTime = moment().format("DD/MM/YYYY || HH:mm:ss");
                const activationMessage = `🔔 Key Thuê Bot Được Kích Hoạt 🔔\n\n⏰ Thời gian: ${activationTime}\n👤 Người Kích Hoạt: ${senderName}\n🌍 Nhóm: ${threadInfo.threadName}\n🔑 Key: ${activationKey}\n📆 Ngày hết hạn: ${key.expirationDate}`;
                o.api.sendMessage(activationMessage, adminID);
            }
        }
    }
};

