module.exports.config = {
    name: "updatechecktt",
    eventType: ["log:unsubscribe"],
    version: "1.0.0",
    credits: "JRT",
    description: "Xóa data tương tác người dùng khi out",
};

module.exports.run = async ({ event, api, Threads }) => { 
    if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
    const fs = require("fs");
    const pathA = require('path');
    const thread = require('../commands/noprefix/notInteract.json');
    const path = pathA.resolve(__dirname, '../', 'commands', 'noprefix', 'notInteract.json');
    var threadData = thread.find(i => i.threadID == event.threadID)
    const index = threadData.data.findIndex(item => item.id == event.logMessageData.leftParticipantFbId);
    threadData.data.splice(index, 1);
    fs.writeFileSync(path, JSON.stringify(thread, null, 2), 'utf-8');
}