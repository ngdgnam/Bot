module.exports.config = {
    name: "shortcut1",
    version: "4.0.0",
    hasPermssion: 0,
    credits: "Niio-team (Niiozic)",
    description: "Shortcut full chức năng",
    commandCategory: "Thành Viên",
    usages: "[all/delete/empty/tag/join/leave/autosend]\n{time} -> get time\n{name} -> get name user\n{nameThread} -> get name box\n{soThanhVien} -> get số thành viên nhóm\n{link} -> get link user\n{authorName} -> get name người add or kick\n{authorId} -> get link người add or kick\n{trangThai} -> lúc out sẽ hiện tự out or bị qtv kick\n{qtv} -> có tv tham gia hoặc out sẽ tag toàn bộ qtv",
    cooldowns: 0,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
  }
  global.nodemodule = {
    "path": require("path")
    // Thêm các module khác nếu cần
  };
  let format_attachment = type => ({
    photo: 'png', video: 'mp4', audio: 'mp3', animated_image: 'gif',
  })[type] || 'bin';
  const { readFileSync, writeFileSync, unlinkSync } = require('fs')
  const stream_url = url => require('axios').get(url, { responseType: 'stream' }).then(res => res.data);
  const { resolve } = global.nodemodule["path"];
  const path = resolve(__dirname, '..', 'commands', `data`, "shortcutdata.json");
  module.exports.onLoad = function ({
    api,
  }) {
    const { existsSync, writeFileSync, mkdirSync, readFileSync } = global.nodemodule["fs-extra"];
    if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();
    if (!existsSync(path)) writeFileSync(path, JSON.stringify([]), "utf-8");
    const data = JSON.parse(readFileSync(path, "utf-8"));
    for (const threadData of data) global.moduleData.shortcut.set(threadData.threadID, threadData.shortcuts);
    if (!global.hJajnaMai828kaiw)
        global.hJajnaMai828kaiw = setInterval(async function () {
            const now = require('moment-timezone')().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss');
            for (let [threadID, thread_data] of global.moduleData.shortcut) {
                for (let e of thread_data) (async _ => {
                    if (e.input_type === 'autosend') {
                        if (e.hours === now) {
                            const outputs = e.output.split('|');
                            const output = outputs[Math.random() * outputs.length << 0];
                            const msg = {
                                body: output,
                            };
  
                            if (e.uri) try {
                                if (/^https:\/\//.test(e.uri)) msg.attachment = [await stream_url(e.uri)];
                                else if (e.uri === 'random') msg.attachment = [await stream_url(await api_link())];
                            } catch { };
  
                            api.sendMessage(msg, threadID);
                        }
                    }
                })();
            }
  
        }, 1000);
  }
  
  module.exports.events = async function ({
    api, event,
  }) {
    const { threadID, logMessageType, logMessageData, participantIDs, author } = event;
    const data = global.moduleData.shortcut.get(threadID)
  
    if (!data) return;
  
    //if (event.threadID == 24831414453116359)api.sendMessage(JSON.stringify(event,0,4), event.threadID);
  
    switch (logMessageType) {
        case 'log:subscribe': {
            const thread_info = await api.getThreadInfo(threadID);
            const admins = thread_info.adminIDs.map(e => [e.id, global.data.userName.get(e.id)]);
            const join = data.find(e => e.input_type == 'join');
  
            if (!join) return;
  
            const msg = {
                body: join.output
                    .replace(/{nameThread}/g, thread_info.threadName + '')
                    .replace(/{link}/g, logMessageData.addedParticipants.map(e => `https://www.facebook.com/profile.php?id=${e.userFbId}`).join('\n'))
                    .replace(/{soThanhVien}/g, participantIDs.length)
                    .replace(/{name}/g, logMessageData.addedParticipants.map(e => e.fullName).join(', '))
                    .replace(/{time}/g, require('moment-timezone')().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY - HH:mm:ss'))
                    .replace(/{authorName}/g, global.data.userName.get(author))
                    .replace(/{authorId}/g, `https://www.facebook.com/profile.php?id=` + author)
                    .replace(/{qtv}/g, `@${admins.map(e => e[1]).join('\n@')}`)
            };
  
            try {
                msg.mentions = [];
                if (/{qtv}/.test(join.output)) msg.mentions = admins.map(e => ({
                    id: e[0],
                    tag: e[1],
                }));
                if (/{name}/.test(join.output)) logMessageData.addedParticipants.map(e => msg.mentions.push({ id: e.userFbId, tag: e.fullName }));
                if (/^https:\/\//.test(join.uri)) msg.attachment = await stream_url(join.uri);
                else if (join.uri === 'random') msg.attachment = await stream_url(await api_link());
  
            } catch { };
  
            api.sendMessage(msg, threadID);
        };
            break;
        case 'log:unsubscribe': {
            const thread_info = await api.getThreadInfo(threadID);
            const admins = thread_info.adminIDs.map(e => [e.id, global.data.userName.get(e.id)]);
            const leave = data.find(e => e.input_type == 'leave');
  
            if (!leave) return;
  
            const msg = {
                body: leave.output
                    .replace(/{nameThread}/g, global.data.threadInfo.get(threadID)?.threadName + '')
                    .replace(/{link}/g, 'https://www.facebook.com/profile.php?id=' + logMessageData.leftParticipantFbId)
                    .replace(/{soThanhVien}/g, participantIDs.length - 1)
                    .replace(/{name}/g, global.data.userName.get(logMessageData.leftParticipantFbId))
                    .replace(/{time}/g, require('moment-timezone')().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY - HH:mm:ss'))
                    .replace(/{trangThai}/g, logMessageData.leftParticipantFbId == author ? `đã tự out khỏi nhóm` : `đã bị kick khỏi nhóm`)
                    .replace(/{authorName}/g, global.data.userName.get(author))
                    .replace(/{authorId}/g, `https://www.facebook.com/profile.php?id=${author}`)
                    .replace(/{qtv}/g, `@${admins.map(e => e[1]).join('\n@')}`)
            };
  
            try {
                msg.mentions = [];
                if (/{qtv}/.test(leave.output)) msg.mentions = admins.map(e => ({
                    id: e[0],
                    tag: e[1],
                }));
                if (/{name}/.test(leave.output)) msg.mentions.push({
                    tag: global.data.userName.get(logMessageData.leftParticipantFbId),
                    id: logMessageData.leftParticipantFbId,
                })
                if (/^https:\/\//.test(leave.uri)) msg.attachment = await stream_url(leave.uri);
                else if (leave.uri === 'random') msg.attachment = await stream_url(await api_link());
  
            } catch { };
  
            api.sendMessage(msg, threadID);
        };
            break;
        default:
            break;
    }
  };
  
  module.exports.handleEvent = async function ({ event, api, Users }) {
    const { threadID, messageID, body, senderID, mentions: Mentions = {} } = event;
    if (api.getCurrentUserID()==senderID)return;
    if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();
    if (!global.moduleData.shortcut.has(threadID)) return;
    let mentions = Object.keys(Mentions);
    const data = global.moduleData.shortcut.get(threadID);
    if (!data) return;
    if (['autosend', 'join', 'leave'].includes(data.input_type)) return;
    if (!body) return;
    if ((dataThread = mentions.length > 0 ? data.find(item => typeof item.tag_id == 'string' && mentions.includes(item.tag_id)) : false) || (dataThread = data.find(item => (item.input || '').toLowerCase() == body.toLowerCase()))) {
        const { resolve } = global.nodemodule["path"];
        const { existsSync, createReadStream } = global.nodemodule["fs-extra"];
        var object, output;
        var moment = require("moment-timezone");
        var time = moment.tz("Asia/Ho_Chi_Minh").format('HH:mm:ss | DD/MM/YYYY');
        var outputs = dataThread.output//.split('|');
        var output = outputs//outputs[Math.random()*outputs.length<<0];
        if (/\{name}/g.test(output)) {
            const name = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
            output = output.replace(/\{name}/g, name).replace(/\{time}/g, time);
        }
        const msg = {
            body: output,
        };
  
        var link = await api_link()
        console.log(link)
        if (dataThread.uri === 'random') msg.attachment = [await stream_url(link)];
        else if (/^https:\/\//.test(dataThread.uri)) msg.attachment = [await stream_url(dataThread.uri)];
        console.log(msg.attachment)
        return api.sendMessage(msg, threadID, messageID);
    }
  }
  
  module.exports.handleReply = async function ({ event = {}, api, handleReply }) {
    if (handleReply.author != event.senderID) return;
    try {
        const { resolve } = global.nodemodule["path"];
        const { threadID, messageID, senderID, body, attachments = [] } = event;
        const name = this.config.name;
        switch (handleReply.type) {
            case "requireInput": {
                if (body.length == 0) return api.sendMessage("❎ Câu trả lời không được để trống", threadID, messageID);
                const data = global.moduleData.shortcut.get(threadID) || [];
                if (data.some(item => item.input == body)) return api.sendMessage("❎ Input đã tồn tại từ trước", threadID, messageID);
                api.unsendMessage(handleReply.messageID);
                return api.sendMessage("📌 Reply tin nhắn này để nhập câu trả lời khi sử dụng từ khóa", threadID, function (error, info) {
                    return global.client.handleReply.push({
                        type: "requireOutput",
                        name,
                        author: senderID,
                        messageID: info.messageID,
                        input: body
                    });
                }, messageID);
            }
            case "requireOutput": {
                if (body.length == 0) return api.sendMessage("❎ Câu trả lời không được để trống", threadID, messageID);
                api.unsendMessage(handleReply.messageID);
                return api.sendMessage(`📌 Reply tin nhắn này bằng tệp video/ảnh/mp3/gif hoặc nếu không cần bạn có thể reply tin nhắn này và nhập 's' hoặc muốn random video theo data api có sẵn thì nhập 'random'`, threadID, function (error, info) {
                return global.client.handleReply.push({
                    type: "requireGif",
                    name,
                    author: senderID,
                    messageID: info.messageID,
                    input: handleReply.input,
                    output: body,
                    input_type: handleReply.input_type,
                    tag_id: handleReply.tag_id,
                });
            }, messageID);
        }
        case "requireGif": {
          let uri = body;
          if (!['s','random'].includes(body)){
  
          if (attachments.length === 0)return api.sendMessage('⚠️ chưa nhập tệp đính kèm', threadID, messageID);
          const d = event.attachments[0].type === "photo" ? "jpg" :
          event.attachments[0].type === "video" ? "mp4" :
          event.attachments[0].type === "audio" ? "m4a" :
          event.attachments[0].type === "animated_image" ? "gif" :
          "txt";
          try {
               uri = await catbox(attachments[0].url, d);
          } catch(e) {
              console.error(e);
              return api.sendMessage('⚠️ Không thể upload', threadID, messageID);
          };
          };
  
            const readData = readFileSync(path, "utf-8");
            var data = JSON.parse(readData);
            var dataThread = data.find(item => item.threadID == threadID) || { threadID, shortcuts: [] };
            var dataGlobal = global.moduleData.shortcut.get(threadID) || [];
            const object = { input: handleReply.input, output: handleReply.output ,uri, input_type: handleReply.input_type, tag_id: handleReply.tag_id};
  
            dataThread.shortcuts.push(object);
            dataGlobal.push(object);
  
            if (!data.some(item => item.threadID == threadID)) data.push(dataThread);
            else {
                const index = data.indexOf(data.find(item => item.threadID == threadID));
                data[index] = dataThread;
            }
  
            global.moduleData.shortcut.set(threadID, dataGlobal);
            writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");
            api.unsendMessage(handleReply.messageID);
            return api.sendMessage(`📝 Đã thêm thành công shortcut mới, dưới đây là phần tổng quát: \n\n - Input: ${ handleReply.input }\n - Type: ${ handleReply.input_type || 'text' }\n - Output: ${ handleReply.output }`, threadID, messageID);
        }
      case "delShortcut": {
          const shortcutsData = JSON.parse(readFileSync(path));
          const dataThread = shortcutsData.find(item => item.threadID == threadID);
          const dataGlobal = global.moduleData.shortcut.get(threadID) || [];
          const inputDel = [];
  
          for (let i of event.args.map(Number).filter(isFinite)) {
              const dataDel = dataGlobal[i-1];
  
                  inputDel.push(`${ i }.${
                        ({
                    tag: _ => `@{${global.data.userName.get(dataDel.tag_id)}}`,
                    autosend: _ => `${dataDel.hours} autosend`,
                    join: _ => `join noti`,
                    leave: _ => `leave noti`
                }[dataDel?.input_type] || (_ => dataDel?.input || `STT invalid`))()
                        } `);
            if (dataDel)dataGlobal[i-1] = null;
          }
          const filDataGlobal = dataGlobal.filter(e=>e!=null);
  
          dataThread.shortcuts = filDataGlobal;
          global.moduleData.shortcut.set(threadID, filDataGlobal);
          writeFileSync(path, JSON.stringify(shortcutsData,0,4));
  
        return api.sendMessage('✅ Đã xóa thành công\n\n' + inputDel.join('\n'),threadID)
      }
      break;
      case 'autosend': {
          if (!body)return api.sendMessage('⚠️ Chưa nhập nội dung', threadID, messageID);
  
          api.sendMessage('📌 Vui lòng reply tin nhắn này kèm giờ\nVD: 12:00:00', threadID, (err, data)=>{
              global.client.handleReply.push({
                  ...data,
                  author: senderID,
                  name: exports.config.name,
                  type: 'autosend.input_time',
                  data: {
                      output: body,
                  },
              });
          }, messageID)
      }
      break;
      case 'autosend.input_time': {
          if (!require('moment-timezone')(body, 'HH:mm:ss').isValid() || body.length !== '00:00:00'.length)return api.sendMessage('⚠️ Time không hợp lệ', threadID, messageID);
  
          api.sendMessage(`📌 Reply tin nhắn này bằng tệp video / ảnh / mp3 / gif hoặc nếu không cần bạn có thể reply tin nhắn này và nhập 's' hoặc muốn random video theo data api có sẵn thì nhập 'random'`, threadID, (err, data)=>{
              global.client.handleReply.push({
                  ...data,
                  author: senderID,
                  name: exports.config.name,
                  type: 'autosend.input_attachment',
                  data: {
                      ...handleReply.data,
                      hours: body,
                  },
              });
          }, messageID);
      }
      break;
      case 'autosend.input_attachment': {
          let uri = body;
          if (!['s', 'random'].includes(body)){
  
          if (attachments.length === 0)return api.sendMessage('⚠️ Chưa nhập tệp đính kèm', threadID, messageID);
          const d = event.attachments[0].type === "photo" ? "jpg" :
          event.attachments[0].type === "video" ? "mp4" :
          event.attachments[0].type === "audio" ? "m4a" :
          event.attachments[0].type === "animated_image" ? "gif" :
          "txt";
          try {
               uri = await catbox(attachments[0].url, d);
          } catch(e) {
              console.error(e);
              return api.sendMessage('⚠️ Không thể upload', threadID, messageID);
          };
          };
  
          const new_data = {
              input_type: 'autosend',
              ...handleReply.data,
              uri,
          };
          const global_data = global.moduleData.shortcut.get(threadID) || [];
          const data = JSON.parse(readFileSync(path));
  
          if (!data.some(e=>e.threadID == threadID))data.push({ threadID, shortcuts: [] });
  
          const thread_data = data.find(e=>e.threadID == threadID);
  
          global_data.push(new_data);
          thread_data.shortcuts.push(new_data);
          global.moduleData.shortcut.set(threadID, global_data);
          writeFileSync(path, JSON.stringify(data,0,4));
  
          api.sendMessage('✅ Đã thêm auto send', threadID, messageID);
      }
      break;
      case 'join':
      case 'leave': {
          if (!handleReply.data.output) {
          if (!body)return api.sendMessage('⚠️ Chưa nhập nội dung', threadID, messageID);
  
          api.sendMessage(`📌 Reply tin nhắn này bằng tệp video / ảnh / mp3 / gif hoặc nếu không cần bạn có thể reply tin nhắn này và nhập 's' hoặc muốn random video theo data api có sẵn thì nhập 'random'`, threadID, (err, data)=>{
              global.client.handleReply.push({
                  ...data,
                  author: senderID,
                  name: exports.config.name,
                  type: handleReply.type,
                  data: {
                      output: body,
                  },
              });
          }, messageID);
          } else {
          let uri = body;
          if (!['s', 'random'].includes(body)){
  
          if (attachments.length === 0)return api.sendMessage('⚠️ Chưa nhập tệp đính kèm', threadID, messageID);
          const d = event.attachments[0].type === "photo" ? "jpg" :
          event.attachments[0].type === "video" ? "mp4" :
          event.attachments[0].type === "audio" ? "m4a" :
          event.attachments[0].type === "animated_image" ? "gif" :
          "txt";
          try {
               uri = await catbox(attachments[0].url, d);
          } catch(e) {
              console.error(e);
              return api.sendMessage('⚠️ Không thể upload', threadID, messageID);
          };
          };
  
          const new_data = {
              input_type: handleReply.type,
              ...handleReply.data,
              uri,
          };
          const global_data = global.moduleData.shortcut.get(threadID) || [];
          const data = JSON.parse(readFileSync(path));
  
          if (!data.some(e=>e.threadID == threadID))data.push({ threadID, shortcuts: [] });
  
          const thread_data = data.find(e=>e.threadID == threadID);
          const index = global_data.findIndex(e=>e.input_type === handleReply.type);
  
          if (index !== -1) {
              global_data.splice(index, 1);
              thread_data.shortcuts.splice(index, 1);
          };
  
          global_data.push(new_data);
          thread_data.shortcuts.push(new_data);
          global.moduleData.shortcut.set(threadID, global_data);
          writeFileSync(path, JSON.stringify(data,0,4));
  
          api.sendMessage('✅ Đã thêm short '+handleReply.type, threadID, messageID);
      }
      }
      break;
      default:
      break;
    }
  }catch(e){
    console.log(e)
  }
  }
  
  module.exports.run = function ({ event, api, args }) {
  try{
    const { readFileSync, writeFileSync, existsSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const { threadID, messageID, senderID, mentions = {} } = event;
    const name = this.config.name;
  
    const path = resolve(__dirname, '..', 'commands', `data`, "shortcutdata.json");
  
    switch (args[0]) {
        case 'join':
        case 'leave': {
            api.sendMessage(`📌 Vui lòng reply tin nhắn này và nhập nội dung`, threadID, (err, data)=>{
                global.client.handleReply.push({
                    ...data,
                    author: senderID,
                    name: exports.config.name,
                    type: args[0],
                    data: {},
                })
            }, messageID);
        }
        break;
        case 'autosend': {
            api.sendMessage(`📌 Vui lòng reply tin nhắn này và nhập nội dung tự động gửi(thêm | mỗi nội dung để random) \nVD: chào buổi sáng | buổi sáng tốt lành`, threadID, (err, data)=>{
                global.client.handleReply.push({
                    ...data,
                    author: senderID,
                    name: exports.config.name,
                    type: 'autosend',
                })
            }, messageID);
        }
            break;
        case "remove":
        case "delete":
        case "del":
        case "-d": {
            const readData = readFileSync(path, "utf-8");
            var data = JSON.parse(readData);
            const indexData = data.findIndex(item => item.threadID == threadID);
            if (indexData == -1) return api.sendMessage("❎ hiện tại nhóm của bạn chưa có shortcut nào được set", threadID, messageID);
            var dataThread = data.find(item => item.threadID == threadID) || { threadID, shortcuts: [] };
            var dataGlobal = global.moduleData.shortcut.get(threadID) || [];
            //var indexNeedRemove;
  
            if (dataThread.shortcuts.length == 0) return api.sendMessage("❎ hiện tại nhóm của bạn chưa có shortcut nào được set", threadID, messageID);
  /*
            if (isNaN(args[1])) indexNeedRemove = args[1];
            else indexNeedRemove = dataThread.shortcuts.findIndex(item => item.input == (args.slice(1, args.length)).join(" ") || item.id == (args.slice(1, args.length)).join(" "));
  
            dataThread.shortcuts.splice(indexNeedRemove, 1);
            dataGlobal.splice(indexNeedRemove, 1);
  */
            let rm = args.slice(1).map($=>+($-1)).filter(isFinite);
  
            dataThread.shortcuts = dataThread.shortcuts.filter(($,i)=>!rm.includes(i));
            dataGlobal = dataGlobal.filter(($,i)=>!rm.includes(i));
            global.moduleData.shortcut.set(threadID, dataGlobal);
            data[indexData] = dataThread;
            writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");
  
            return api.sendMessage("✅ Đã xóa thành công\n\n", threadID, messageID);
        }
  
        case "list":
        case "all":
        case "-a": {
            const data = global.moduleData.shortcut.get(threadID) || [];
            var array = [];
            if (data.length == 0) return api.sendMessage("❎ hiện tại nhóm của bạn chưa có shortcut nào được set", threadID, messageID);
            else {
                var n = 1;
                for (const single of data) {
                    //const path = resolve(__dirname, '..', 'events' ,"shortcut", "shortcut",`${ single.id } `);
                    //var existPath = false;
                    //if (existsSync(path)) existPath = true;
                    array.push(`${ n++ }. ${ single.uri !== 's' ? "yes" : "no" } • ${
                    ({
                        tag: _ => `@{${global.data.userName.get(single.tag_id)}}`,
                        autosend: _ => `${single.hours} autosend`,
                        join: _ => `join noti`,
                        leave: _ => `leave noti`
                    }[single.input_type] || (_ => single.input))()
                } -> ${ single.output } `);
                }
                return api.sendMessage(`📝 Dưới đây là toàn bộ shortcut nhóm có: \n\n${ array.join("\n") } \n\n'yes' là có tệp gửi kèm\n'no' là không có tệp gửi kèm\n\nReply (phản hồi) theo stt để xóa shortcut`, threadID, function (error, info) {
                 global.client.handleReply.push({
                    type: "delShortcut",
                    name,
                    author: senderID,
                    messageID: info.messageID
                });
            });
            }
        }
        case 'tag': {
            let tag_id = Object.keys(mentions)[0] || senderID;
  
            const data = global.moduleData.shortcut.get(threadID) || [];
            if (data.some(item => item.tag_id == tag_id)) return api.sendMessage("❎ tag đã tồn tại từ trước", threadID, messageID);
  
            api.sendMessage("📌 Reply tin nhắn này để nhập câu trả lời khi được tag", threadID, function (error, info) {
                 global.client.handleReply.push({
                    type: "requireOutput",
                    name,
                    author: senderID,
                    messageID: info.messageID,
                    input_type: 'tag',
                    tag_id,
                });
            }, messageID);
        };
            break;
        default: {
            return api.sendMessage("📌 Reply tin nhắn này để nhập từ khóa cho shortcut", threadID, function (error, info) {
                return global.client.handleReply.push({
                    type: "requireInput",
                    name,
                    author: senderID,
                    messageID: info.messageID
                });
            }, messageID);
        }
    }
  
  }catch(e){
    console.log(e)
  }
                  }
  
  async function imgur(uri) {
  return (await require("axios").get(`https://niiozic.site/catbox?url=${encodeURIComponent(uri)}`)).data.url;
  }
  async function api_link() {
    return (await require("axios").get(global.api("vdgai.json"), { responseType: "stream" })).data;
  }
  async function catbox(link, type) {
  const fs = require('fs');
  const axios = require('axios');
  const FormData = require('form-data');
  const path = require('path');
  const filePath = path.join(__dirname, 'cache', `${Date.now()}.${type}`);
  const response = await axios({ method: 'GET', url: link, responseType: 'stream' });
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);
  await new Promise((resolve, reject) => writer.on('finish', resolve).on('error', reject));
  const formData = new FormData();
  formData.append('reqtype', 'fileupload');
  formData.append('fileToUpload', fs.createReadStream(filePath));
  const uploadResponse = await axios.post('https://catbox.moe/user/api.php', formData, {
    headers: formData.getHeaders(),
  });
  fs.unlinkSync(filePath);
  return uploadResponse.data;
  }