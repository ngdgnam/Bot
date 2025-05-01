module.exports.config = {
    name: "capweb",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Mirai Team",
    description: "Screenshot một trang web nào đó (Trừ web 18+)",
    commandCategory: "Tiện ích",
    usages: "[url site]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.run = async ({ event, api, args }) => {
    const { readFileSync, createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
    try {
        let url = args[0];
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        
        const path = __dirname + `/cache/${event.threadID}-${event.senderID}s.png`;
        await global.utils.downloadFile(`https://image.thum.io/get/width/1920/crop/400/fullpage/noanimate/${url}`, path);
        api.sendMessage({ attachment: createReadStream(path) }, event.threadID, () => unlinkSync(path));
    } catch {
        return api.sendMessage("Định dạng không đúng ?", event.threadID, event.messageID);
    }
};
