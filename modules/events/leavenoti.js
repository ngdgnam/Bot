module.exports.config = {
    name: "leavenoti",
    eventType: ["log:unsubscribe"],
    version: "1.0.0",
    credits: "HĐGN",
    description: "Thông báo Bot hoặc người dùng rời khỏi nhóm + shareContact",
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

const checkttPath = __dirname + '/../commands/_checktt/'


module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const path = join(__dirname, "cache", "leaveGif");
    if (existsSync(path)) mkdirSync(path, { recursive: true });

    const path2 = join(__dirname, "cache", "leaveGif");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

    return;
}

module.exports.run = async function ({ api, event, Users, Threads }) {
    if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
    const { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];    
    const { threadID } = event;
    const moment = require("moment-timezone");
    const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss - DD/MM/YYYY");
    const hours = moment.tz("Asia/Ho_Chi_Minh").format("HH");
    var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
  if (thu == 'Sunday') thu = 'Chủ Nhật'
  if (thu == 'Monday') thu = 'Thứ Hai'
  if (thu == 'Tuesday') thu = 'Thứ Ba'
  if (thu == 'Wednesday') thu = 'Thứ Tư'
  if (thu == "Thursday") thu = 'Thứ Năm'
  if (thu == 'Friday') thu = 'Thứ Sáu'
  if (thu == 'Saturday') thu = 'Thứ Bảy'
    const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
    const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
    const uid =  (event.logMessageData.leftParticipantFbId);
    const type = (event.author == event.logMessageData.leftParticipantFbId) ? "Đã tự động rời khỏi nhóm." : "Đã bị Quản trị viên xóa khỏi nhóm.";
    const path = join(__dirname, "cache", "leaveGif");
    const gifPath = join(path, `bye.gif`);
    var msg, formPush

    if (existsSync(checkttPath + threadID + '.json')) {
        const threadData = JSON.parse(readFileSync(checkttPath + threadID + '.json'));
        const userData_week_index = threadData.week.findIndex(e => e.id == event.logMessageData.leftParticipantFbId);
        const userData_day_index = threadData.day.findIndex(e => e.id == event.logMessageData.leftParticipantFbId);
        const userData_total_index = threadData.total.findIndex(e => e.id == event.logMessageData.leftParticipantFbId);
        if (userData_total_index != -1) {
            threadData.total.splice(userData_total_index, 1);
        }
        if (userData_week_index != -1) {
            threadData.week.splice(userData_week_index, 1);
        }
        if (userData_day_index != -1) {
            threadData.day.splice(userData_day_index, 1);
        }

        writeFileSync(checkttPath + threadID + '.json', JSON.stringify(threadData, null, 4));
    }
    if (existsSync(path)) mkdirSync(path, { recursive: true });

    (typeof data.customLeave == "undefined") ? msg = "[ Thành Viên Thoát Nhóm ]\n─────────────────\n👤 Thành viên: {name}\n📌 Lý do: {type}\n📆 Thoát nhóm vào lúc {thu}\n⏰ Thời gian: {time}" : msg = data.customLeave;
    msg = msg.replace(/\{name}/g, name).replace(/\{type}/g, type).replace(/\{time}/g, time).replace(/\{uid}/g, uid).replace(/\{thu}/g, thu); 
    return api.sendMessage(threadID, async () => {
await api.shareContact(`${msg}`, event.logMessageData.leftParticipantFbId, threadID);
});
}