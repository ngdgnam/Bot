module.exports.config = {
    name: "rule",
    eventType: ["log:subscribe"],
    version: "",
    credits: "Mr.Ben", 
    description: "",
};
module.exports.run = async function ({ api, event }) {
    const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
      const { threadID } = event;
      const pathData = join(__dirname, '../commands/cache/rules.json');
  const thread = global.data.threadData.get(threadID) || {};
if (typeof thread["rule"] != "undefined" && thread["rule"] == false) return;
       var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, listRule: [] };
      if (thisThread.listRule.length != 0) {
                var msg = "", index = 0;
                for (const item of thisThread.listRule) msg += `${index+=1}. ${item}\n`;
		return api.sendMessage({body:`[ LUẬT CỦA NHÓM ]\n\nThành viên vừa mới vào vui lòng đọc kĩ luật sau:\n${msg}`, attachment: (await global.nodemodule["axios"]({
url: (await global.nodemodule["axios"]('https://api.dungkon.id.vn/girl-video')).data.url,
method: "GET",
responseType: "stream"
})).data
},event.threadID)
      }
}