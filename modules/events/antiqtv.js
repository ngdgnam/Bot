module.exports.config = {
    name: "antiqtv",
    eventType: ["log:thread-admins"],
    version: "1.0.0",
    credits: "D-Jukie",
    description: "Ngăn chặn việc thay đổi admin",
};

module.exports.run = async function ({ event, api, Threads, Users }) {
    const { logMessageType, logMessageData, senderID } = event;
  let data = (await Threads.getData(event.threadID)).data
  if (data.guard == false) return;
    if (data.guard == true ) {
        switch (logMessageType) {
          case "log:thread-admins": {
            if (logMessageData.ADMIN_EVENT == "add_admin") {
              if(event.author == api.getCurrentUserID()) return
              if(logMessageData.TARGET_ID == api.getCurrentUserID()) return
              else {
                api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback)
                api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, false)
                function editAdminsCallback(err) {
                  if (err) return api.sendMessage("» Ahihi đồ ngu 😝", event.threadID, event.messageID);
                    return api.sendMessage(`🔄 Bot đã phát hiện ai đó đã thêm người dùng trở thành Quản Trị Viên nhóm, tiến hành kích hoạt chế độ chống cướp box...`, event.threadID, event.messageID);
                }
              }
            }
            else if (logMessageData.ADMIN_EVENT == "remove_admin") {
              if(event.author == api.getCurrentUserID()) return
              if(logMessageData.TARGET_ID == api.getCurrentUserID()) return
              else {
                api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback)
                api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, true)
                function editAdminsCallback(err) {
                if (err) return api.sendMessage("» Ahihi đồ ngu 😝", event.threadID, event.messageID);
                return api.sendMessage(`🔄 Bot đã phát hiện ai đó vừa xoá 1 Quản Trị Viên nhóm, tiến hành kích hoạt chế độ chống cướp box...`, event.threadID, event.messageID);
              }
            }
          }
        }
      }
    }
}
