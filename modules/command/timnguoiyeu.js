module.exports.config = {
	name: "timnguoiyeu",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "",
	description: "quét all người dùng, nhóm bot tham gia",
	commandCategory: "Tình Yêu",
	usages: "timnguoiyeu [nam/nữ]",
	cooldowns: 1
};

const axios = require('axios');

module.exports.run = async ({ api, event, args }) => {
	if (args.length === 0) {
		return api.sendMessage("Vui lòng nhập lệnh theo định dạng: /timnguoiyeu [nam/nữ]", event.threadID, event.messageID);
	}

	const genderInput = (args[0] || '').toLowerCase();
	const genderTarget = ["nam", "trai"].includes(genderInput) ? 'MALE' :
		["nữ", "gái", "con gái"].includes(genderInput) ? 'FEMALE' : null;

	if (!genderTarget) {
		return api.sendMessage("Giới tính không hợp lệ. Vui lòng nhập 'nam' hoặc 'nữ'.", event.threadID, event.messageID);
	}

	let targetID = global.data.allUserID[Math.floor(Math.random() * global.data.allUserID.length)];
	let data = await getInfo(api, targetID);
	let countLoop = 0;

	while (genderTarget !== data.gender && countLoop < 10) {
		countLoop++;
		targetID = global.data.allUserID[Math.floor(Math.random() * global.data.allUserID.length)];
		data = await getInfo(api, targetID);
	}
	
	if (countLoop === 10) {
		return api.sendMessage("Rất tiếc, không tìm thấy người dùng phù hợp với bạn", event.threadID, event.messageID);
	}

	const {
		name,
		gender,
		id,
		url,
		username,
		shortname,
		friend,
		cv,
		mess,
		chucvu,
		block
	} = data;

	const msg = `[ TÌM NGƯỜI YÊU ]
--------------------------------
Tên: ${name}
Tên chính: ${shortname}
Tên khác: ${username ? username : "không dùng"}
Giới tính: ${gender === "MALE" ? "Trai" : "Nữ"}
UID: ${id}
Bạn bè: ${friend ? "Đã kết bạn với bot" : "Chưa kết bạn với bot"}
Trạng thái: ${mess ? "Đã nhắn với bot" : "Chưa nhắn tin với bot"}
Tin nhắn: ${block ? "Đã chặn tin nhắn bot" : "Không chặn tin nhắn bot"}
Công việc: ${cv ? cv : "không có"}
Chức vụ: ${chucvu ? chucvu : "Không có"}
FACEBOOK: ${url}
--------------------------------`;

	try {
		const avatarResponse = await axios.get(`https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "stream" });
		const avatar = avatarResponse.data;
		avatar.path = 'avatar.png';
		return api.sendMessage({ body: msg, attachment: avatar }, event.threadID, event.messageID);
	} catch (error) {
		return api.sendMessage("Không thể tải ảnh đại diện hoặc có lỗi khác xảy ra", event.threadID, event.messageID);
	}
};

async function getInfo(api, userID) {
	try {
		const cc = await api.getUserInfoV5(userID);
		const user = cc[0].o0.data.messaging_actors[0];
		return {
			name: user.name,
			gender: user.gender,
			id: user.id,
			url: user.url,
			username: user.username,
			shortname: user.short_name,
			friend: user.is_viewer_friend,
			cv: user.work_info,
			mess: user.is_messenger_user,
			chucvu: user.is_employee,
			block: user.is_message_blocked_biewer
		};
	} catch (error) {
		console.error("Lỗi khi lấy thông tin người dùng:", error);
		return {};
	}
}
