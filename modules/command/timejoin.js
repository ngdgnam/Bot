module.exports.config = {
    name: 'timejoin',
    version: '10.02',
    hasPermssion: 0,
    credits: 'DC-Nam',
    description: 'Lưu lại thời gian bạn tham gia nhóm va check',
    commandCategory: 'Tiện ích',
    usages: '{...reply || tags}\n{all || list}',
    cooldowns: 3,
};
const {
    readFileSync,
    writeFileSync,
    mkdirSync,
    existsSync
} = require('fs-extra'),// npm install fs-extra
destD = __dirname + '/noprefix/timejoinbox',
newUser = a => new Object({
    id: a, timestamp: Date.now()+25200000
}),
checkNum = a => Math.floor(a) < 10?'0'+Math.floor(a): Math.floor(a);
etnTime = a => `${checkNum(a/(60*60*1000)%24)}:${checkNum(a/(60*1000)%60)}:${checkNum(a/(1000)%60)} | ${checkNum(a/(24*60*60*1000)%30)}/${checkNum(a/(30*24*60*60*1000)%12)}/${checkNum(a/(12*30*24*60*60*1000))}`,
sortCompare = k => (a, b) => (a[k] > b[k] ? 1: a[k] < b[k] ? -1: 0),
name = a => global.data.userName.get(a);
module.exports.onLoad = function() {
    if (!existsSync(destD)) mkdirSync(destD);
};
module.exports.run = function( {
    api, event, args
}) {
    const out = (a, b, c, d) => api.sendMessage(`${a}`, b?b: event.threadID, c?c: null, d?d: event.messageID);
    if(!event.isGroup) return out(`[⚜️]➜ Chỉ hoạt động trong nhóm`)
    const destF = destD + '/' + event.threadID + '.json',
    dataF = JSON.parse(readFileSync(destF, 'utf-8'));
    dataF.user.sort(sortCompare('timestamp'));
    if (/all|list/.test(args[0])) return out(dataF.user.map((d, idx)=> `${idx+1}. ${name(d.id)}\n[📅]➜ Tham Gia Lúc ${(x = JSON.stringify(new Date(d.timestamp)).split(/\.|T/), `${x[1]} | ${x[0].replace(/"/, '')}`)}`).join('\n\n'));
    const id = event.type == 'message_reply'?event.messageReply.senderID: (x0 = Object.keys(event.mentions), x0 != 0)?x0[0]: event.senderID;
    findID = dataF.user.find(i => i.id == id);
    out(`[🍒]➜ Tên: ${name(findID.id)}\n[📅]➜ Tham Gia Lúc:\n${(x = JSON.stringify(new Date(findID.timestamp)).split(/\.|T/), `${x[1]} | ${x[0].replace(/"/, '')}`)}`);
};
module.exports.handleEvent = function( {
    api, event
}) {
    if(!event.isGroup)return;
    const destF = destD + '/' + event.threadID + '.json';
    if (!existsSync(destF)) writeFileSync(destF, '{"user": []}');
    const dataF = JSON.parse(readFileSync(destF, 'utf-8')),
    allID = event.participantIDs;
    if (dataF.user.length != allID.length) {
        allID.forEach(i => {
            if (!dataF.user.find(j => j.id == i)) dataF.user.push(newUser(i));
        });
        dataF.user = dataF.user.filter(i => allID.includes(i.id));
    };
    writeFileSync(destF,
        JSON.stringify(dataF, 0, 0),
        'utf-8');
};