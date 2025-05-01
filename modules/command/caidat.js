const fs = require('fs-extra');
const path = require('path');

const pathToAutoSetNameData = path.join(__dirname, 'cache/data/autosetname.json');
const pathToAntiSpamData = path.join(__dirname, 'cache/data/antispamStatus.json');
const messageCountFolderPath = path.join(__dirname, 'checktt');
const antiImageFilePath = path.join(__dirname, 'cache/data/antiImages/antiImage.json');
const filePath = path.join(__dirname, '../../modules/events/cache/data/namebox.json');

// Hàm tạo tệp JSON nếu không tồn tại
async function createFileIfNotExists(filePath, defaultContent) {
  try {
    if (!fs.existsSync(filePath)) {
      await fs.writeJson(filePath, defaultContent);
      console.log(`Tạo tệp tin mới: ${filePath}`);
    }
  } catch (error) {
    console.error(`Lỗi khi tạo tệp tin ${filePath}:`, error);
  }
}

module.exports.config = {
  name: "caidat",
  version: "1.0.0",
  hasPermission: 1,
  credits: "Vtuan fix ",
  description: "Xem tất cả cài đặt của nhóm!",
  commandCategory: "Quản Trị Viên",
  usages: "...",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, Threads, args }) => {
  let threadSettings = await api.getThreadInfo(event.threadID);
  const threadID = event.threadID.toString();
  const ThreadData = global.data.threadData; 
  let antispamStatusMsg, spamCountMsg, spamTimeMsg, antispamSettings;
  let autoSetNameMsg;
  let antiImageStatusMsg;
  let threadTitle = threadSettings.threadName;
  let groupId = threadSettings.threadID;

  // Tạo tệp JSON nếu không tồn tại với nội dung mặc định
  await createFileIfNotExists(pathToAntiSpamData, []);
  await createFileIfNotExists(pathToAutoSetNameData, []);
  await createFileIfNotExists(antiImageFilePath, []);
  await createFileIfNotExists(filePath, []);
  
  // Approval mode data
  let approvalModeStatus = threadSettings.approvalMode;
  var approvalModeText = approvalModeStatus ? 'bật' : 'tắt';

  // Antispam data
  let antispamData = JSON.parse(fs.readFileSync(pathToAntiSpamData, "utf-8"));
  let threadAntispamData = antispamData.find(item => item.threadID === threadID);
  if (threadAntispamData && threadAntispamData.status) {
    antispamStatusMsg = "Bật";
    spamCountMsg = `${threadAntispamData.spamCount}`;
    spamTimeMsg = `${(threadAntispamData.spamTime / 1000).toFixed(2)}s`;
    antispamSettings = `${spamCountMsg}|${spamTimeMsg}`
  } else {
    antispamStatusMsg = "Tắt";
    antispamSettings = ""
  }

  // Auto set name data
  let autoSetNameData = JSON.parse(fs.readFileSync(pathToAutoSetNameData, "utf-8"));
  let threadAutoSetName = autoSetNameData.find(item => item.threadID === threadID);
  if (threadAutoSetName && threadAutoSetName.nameUser && threadAutoSetName.nameUser.length > 0) {
    autoSetNameMsg = `Bật (${threadAutoSetName.nameUser})`;
  } else {
    autoSetNameMsg = "Không có";
  }

  // Anti out data
  let threadExtraData = await Threads.getData(event.threadID);
  let isAntiOutEnabled = threadExtraData.data && threadExtraData.data.antiout;
  let antiOutStatusMsg = isAntiOutEnabled ? "Bật" : "Tắt";

  // Message rank data
let msgRankText;
try {
  const directoryContent = await fs.readdir(messageCountFolderPath);
  const messageCountFiles = directoryContent.filter((file) => file.endsWith('.json'));
  if (messageCountFiles.length === 0) {
    throw new Error('Không tìm thấy tệp tin tin nhắn.');
  }

  let groupMessageCountStats = [];
  for (const file of messageCountFiles) {
    const filePath = path.join(messageCountFolderPath, file);
    let data;

    try {
      data = await fs.readJson(filePath);
    } catch (readError) {
      console.error(`Lỗi khi đọc tệp ${file}:`, readError);
      continue; // Bỏ qua tệp này và tiếp tục với các tệp khác
    }

    // Kiểm tra dữ liệu trước khi xử lý
    if (data && Array.isArray(data.total)) {
      // Tính tổng số tin nhắn từ thuộc tính 'total'
      const totalMsgs = data.total.reduce((acc, cur) => acc + (cur.count || 0), 0);
      groupMessageCountStats.push({ threadID: file.replace('.json', ''), totalMessages: totalMsgs });
    } else {
      console.error(`Dữ liệu trong tệp ${file} không có thuộc tính 'total' hoặc thuộc tính không phải là mảng.`);
      continue; // Bỏ qua tệp này và tiếp tục với các tệp khác
    }
  }

  if (groupMessageCountStats.length === 0) {
    throw new Error('Dữ liệu tin nhắn trống.');
  }

  groupMessageCountStats.sort((a, b) => b.totalMessages - a.totalMessages);

  const currentGroupStats = groupMessageCountStats.find(group => group.threadID === event.threadID);
  const currentGroupRank = currentGroupStats ? groupMessageCountStats.findIndex(group => group.threadID === event.threadID) + 1 : 'N/A';
  const currentGroupMsgCount = currentGroupStats ? currentGroupStats.totalMessages : '0';
  const totalGroupCount = groupMessageCountStats.length;
  msgRankText = `Nhóm đứng top: ${currentGroupRank} server với ${currentGroupMsgCount} tin nhắn`;
} catch (error) {
  console.error('Lỗi khi lấy dữ liệu xếp hạng tin nhắn:', error);
  msgRankText = "Lỗi: " + error.message;
}


  // Anti image data
  try {
    const antiImageJSONData = fs.readJsonSync(antiImageFilePath);
    const antiImageData = antiImageJSONData.find(item => item.id === threadID);
    antiImageStatusMsg = antiImageData ? (antiImageData.status ? "Bật" : "Tắt") : "Tắt";
  } catch (error) {
    console.error('Không thể đọc dữ liệu từ file antiImage.json', error);
    antiImageStatusMsg = "Không thể xác định";
  }

  // Antinamebox data 
  const nameboxData = fs.readJsonSync(filePath, { throws: false }) || [];
  const nameboxEntry = nameboxData.find(entry => entry.threadID == threadID);
  const nameboxStatusText = nameboxEntry && nameboxEntry.status ? "Bật" : "Tắt";

  // Antiqtv data
  const qtvThreadData = ThreadData.get(threadID);
  const isAntiQTVGuardOn = qtvThreadData && qtvThreadData.data && qtvThreadData.data.guard === true;
  const antiQTVStatusText = isAntiQTVGuardOn ? "Bật" : "Tắt";

  return api.sendMessage(
    `== [ Cài Đặt Nhóm ] ==\n────────────\n` +
    `→ Tên nhóm: ${threadTitle || "không có"}\n` +
    `→ ID: ${groupId}\n` +
    `→ Phê duyệt: ${approvalModeText}\n` +
    `→ Antispam: ${antispamStatusMsg} ${antispamSettings}\n` +
    `→ Autosetname: ${autoSetNameMsg}\n` +
    `→ Antiout: ${antiOutStatusMsg}\n` +
    `→ Anti ảnh nhóm: ${antiImageStatusMsg}\n` +
    `→ Anti tên nhóm: ${nameboxStatusText}\n` +
    `→ Anti qtv: ${antiQTVStatusText}\n` +
    `────────────\n${msgRankText}`,
    event.threadID
  );
};