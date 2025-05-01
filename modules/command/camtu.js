const p = "😠";
const a = "👍";
const {
  resolve: b
} = require("path");
const {
  existsSync: q,
  writeFileSync: j
} = require("fs-extra");
const e = b(__dirname, 'cache/data/camtu.json');
module.exports.config = {
  name: "camtu",
  version: "1.0.0",
  credits: "NTKhang (fix by DEV NDK)",
  hasPermssion: 1,
  description: "Cảnh báo thành viên vi phạm từ ngữ",
  usages: "camtu on/off add/del list",
  commandCategory: "Quản Trị Viên",
  cooldowns: 0
};
module.exports.run = async ({
  api: f,
  event: a,
  args: b
}) => {
  if (!q(e)) {
    try {
      j(e, JSON.stringify({}, null, "\t"));
    } catch (b) {
      console.log(b);
    }
  }
  const c = require("cache/data/camtu.json");
  const d = await f.getThreadInfo(a.threadID);
  if (!c.hasOwnProperty(a.threadID)) {
    c[a.threadID] = {
      data: {}
    };
    j(e, JSON.stringify(c, null, "\t"));
  }
  const g = c[a.threadID].data || {};
  if (!g.camtu) {
    g.camtu = {
      words: [],
      enables: false
    };
    j(e, JSON.stringify(c, null, "\t"));
  }
  if (b[0] == "on") {
    g.camtu.enables = true;
    j(e, JSON.stringify(c, null, "\t"));
    return f.sendMessage("[ MODE ] - Auto cấm từ đã được bật", a.threadID, a.messageID);
  } else if (b[0] == "off") {
    g.camtu.enables = false;
    j(e, JSON.stringify(c, null, "\t"));
    return f.sendMessage("[ MODE ] - Auto cấm từ đã được tắt", a.threadID, a.messageID);
  } else if (b[0] == "add") {
    if (!b[1]) {
      return f.sendMessage("[ MODE ] - Vui lòng nhập từ cần thêm vào danh sách", a.threadID, a.messageID);
    }
    const i = b.slice(1).join(" ");
    let d = i.split(",").map(b => b.trim());
    d = d.filter(b => !g.camtu.words.includes(b));
    g.camtu.words.push(...d);
    j(e, JSON.stringify(c, null, "\t"));
    return f.sendMessage("[ MODE ] - Đã thêm " + d.length + " từ vào danh sách", a.threadID, a.messageID);
  } else if (b[0] == "del") {
    const i = b.slice(1).join(" ");
    let d = i.split(",").map(b => b.trim());
    d = d.filter(b => g.camtu.words.includes(b));
    for (const b of d) {
      g.camtu.words.splice(g.camtu.words.indexOf(b), 1);
    }
    j(e, JSON.stringify(c, null, "\t"));
    return f.sendMessage("[ MODE ] - Đã xóa " + d.length + " từ khỏi danh sách", a.threadID, a.messageID);
  } else if (b[0] == "list") {
    let b = "[ MODE ] - Danh sách từ cấm:\n";
    g.camtu.words.forEach(c => b += " - " + c + "\n");
    return f.sendMessage(b, a.threadID, a.messageID);
  } else {
    return f.sendMessage(`━━━━━ [ Auto cấm từ ] ━━━━━\n\n→ ${global.config.PREFIX}camtu add + từ cần cấm\n→ ${global.config.PREFIX}camtu del + từ đã cấm (xoá)\ncó thể thêm nhiều hoặc xoá nhiều cùng lúc bằng cách thêm ","\n→ ${global.config.PREFIX}camtu list: xem danh sách từ đã cấm\n→ ${global.config.PREFIX}camtu on: bật Auto cấm từ\n→ ${global.config.PREFIX}camtu off: tắt Auto cấm từ`, a.threadID, a.messageID);
  }
};
module.exports.handleEvent = async ({
  api: b,
  event: c,
  Threads: d
}) => {
  const {
    senderID: f,
    threadID: g
  } = c;
  const h = global.data.threadInfo.get(g) || (await d.getInfo(g));
  const i = (h.adminIDs || []).find(b => b.id == f);
  const k = [b.getCurrentUserID(), ...global.config.ADMINBOT, ...global.config.NDH];
  const l = i || k.some(b => b == f);
  if (!q(e)) {
    try {
      j(e, JSON.stringify({}, null, "\t"));
    } catch (b) {
      console.log(b);
    }
  }
  const m = require("cache/data/camtu.json");
  if (!m.hasOwnProperty(c.threadID)) {
    m[c.threadID] = {
      data: {}
    };
    j(e, JSON.stringify(m, null, "\t"));
  }
  if (c.body && !l) {
    try {
      const f = m[c.threadID].data || {};
      if (!f.camtu) {
        return;
      }
      if (f.camtu.enables) {
        const d = c.body.toLowerCase().match(new RegExp("(\\s|^)(" + f.camtu.words.map(b => b += "+").join("|") + ")(\\s|$)", "gi"));
        if (d) {
          return b.sendMessage(`[ MODE ] - Từ cấm '${d[0]}' đã được phát hiện, Quản trị viên hãy thả cảm xúc ${p} tin nhắn này để xóa thành viên hoặc ${a} để hủy bỏ`, c.threadID, async (d, a) => {
            global.client.handleReaction.push({
              name: this.config.name,
              messageID: a.messageID,
              targetID: c.senderID
            });
          }, c.messageID);
        }
      }
    } catch (b) {
      console.log(b);
    }
  }
};
module.exports.handleReaction = async ({
  api: q,
  event: c,
  Threads: b,
  handleReaction: d,
  Users: e
}) => {
  const {
    targetID: f,
    messageID: g
  } = d;
  const {
    userID: h,
    threadID: i
  } = c;
  const j = global.data.threadInfo.get(i) || (await b.getInfo(i));
  const k = j.adminIDs.some(b => b.id == h);
  const l = [q.getCurrentUserID(), ...global.config.ADMINBOT, ...global.config.NDH];
  const m = k || l.some(b => b == h);
  if (!m) {
    return;
  }
  if (c.reaction == p) {
    const b = await q.getThreadInfo(c.threadID);
    return q.removeUserFromGroup(f, c.threadID, async b => {
      if (b) {
        q.sendMessage("[ MODE ] - Không thể xóa thành viên này, thử thêm quyền Quản trị viên cho Bot và thả cảm xúc lại tin nhắn trên", c.threadID, c.messageID);
      } else {
        q.unsendMessage(g);
        const d = await e.getNameUser(h);
        const a = await e.getNameUser(f);
        q.sendMessage("[ MODE ] - " + d + " đã xác nhận xóa thành viên " + a, c.threadID);
      }
    });
  } else if (c.reaction == a) {
    return q.unsendMessage(g);
  }
};