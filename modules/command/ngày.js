module.exports.config = {
  name: "ngày",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Vtuan",
  description: "Đếm ngày đến Tết Âm Lịch, Tết Dương Lịch và Ngày Noel",
  commandCategory: "Tiện ích",
  usages: "Đếm ngày đến Tết Âm Lịch, Tết Dương Lịch và Ngày Noel",
  cooldowns: 5
};

module.exports.run = ({ event, api }) => {
  const { threadID, messageID } = event;
  // Lấy ngày hiện tại
  const currentDate = new Date();
  // Định dạng YYYY-MM-DD cho ngày hiện tại
  const formatDate = currentDate.toISOString().split('T')[0];

  const holidays = [
    {
      name: 'Tết Dương Lịch',
      date: `${currentDate.getFullYear()}-01-01`,
      congrats: 'Chúc mừng năm mới! Hy vọng năm nay sẽ đầy may mắn và thành công.'
    },
    {
      name: 'Ngày Noel',
      date: `${currentDate.getFullYear()}-12-25`,
      congrats: 'Merry Christmas! Chúc bạn một mùa Giáng Sinh ấm áp và tràn đầy hạnh phúc.'
    },
    {
      name: 'Ngày bth',
      date: `${currentDate.getFullYear()}-12-21`,
      congrats: 'Deo co cai ce ce gi dau!!.'
    }
    // Thêm các ngày lễ khác theo định dạng trên nếu cần
  ];

  // Hàm tính ngày còn lại đến ngày lễ
  const calculateDaysLeft = (eventDate) => {
    const diffTime = new Date(eventDate) - currentDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Kiểm tra và gửi lời chúc nếu đúng ngày lễ
  let message = '';
  holidays.forEach(holiday => {
    if (formatDate === holiday.date) {
      message += `${holiday.congrats}\n`;
    } else {
      const daysLeft = calculateDaysLeft(holiday.date);
      if (daysLeft > 0) {
        message += `» Còn ${daysLeft} ngày nữa là đến ${holiday.name}.\n`;
      }
    }
  });

  // Nếu có thông điệp để gửi, gửi thông điệp
  if (message) {
    api.sendMessage(message.trim(), threadID, messageID);
  }
};