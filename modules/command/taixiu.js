module.exports.config = {
  name: "taixiu",
  version: "0.0.1",
  hasPermssion: 0,
  credits: "WhoisHakira stolen form lorenBot(MinhHuyDev)", //mod by Vtuan
  description: "Chơi tài xỉu",
  commandCategory: "Trò Chơi",
    usages: "taixiu [tài/xỉu] [số tiền]",
    cooldowns: 10
};
const axios = require('axios');
var bdsd = true;
var tilethang = 0.95;
var tilethangb3dn = 10;
var tilethangb2dn = 5;
var timedelay = 2;
var haisogiong = 2;
var basogiong = 3;
var motsogiong = 0.95;
function replace(int){
    var str = int.toString();
    var newstr = str.replace(/(.)(?=(\d{3})+$)/g,'$1,');
    return newstr;
}
function getImage(number){
    switch (number){
        case 1: return "https://i.imgur.com/H8w634y.jpg";
        case 2: return "https://i.imgur.com/vc9r4q4.jpg";
        case 3: return "https://i.imgur.com/SmOzlNt.jpg";
        case 4: return "https://i.imgur.com/680wTWp.jpg";
        case 5: return "https://i.imgur.com/X3KzAc4.jpg";
        case 6: return "https://i.imgur.com/KAOjcW0.jpg";
    }
}
function getRATE(tong){
    if(tong == 4) var rate = 25;
    if(tong == 5) var rate = 25;
    if(tong == 6) var rate = 25;
    if(tong == 7) var rate = 25;
    if(tong == 8) var rate = 25;
    if(tong == 9) var rate = 25;
    if(tong == 10) var rate = 25;
    if(tong == 11) var rate = 25;
    if(tong == 12) var rate = 25;
    if(tong == 13) var rate = 25;
    if(tong == 14) var rate = 25;
    if(tong == 15) var rate = 25;
    if(tong == 16) var rate = 25;
    if(tong == 17) var rate = 25;
    return rate
}
module.exports.run = async function ({ event, api, Currencies, Users, args }) {
    try{
    const moment = require("moment-timezone");
    const format_day = moment().format('DD-MM-YYYY');
    const { increaseMoney , decreaseMoney } = Currencies;
    const { threadID, messageID, senderID } = event;
    const { sendMessage: HakiraSEND } = api;
    var name = await Users.getNameUser(senderID)
    var money = (await Currencies.getData(senderID)).money
    var bet = parseInt((args[1] == "all" ? money : args[1]));
    var input = args[0];
    var tong = parseInt(args[2])
    if(!input) return HakiraSEND("Bạn chưa nhập tài/xỉu/ (bbgn) bộ ba giống nhau/ (b2gn) bộ đôi giống nhau/ (ct) cược tổng/ (cs) cược số", threadID, messageID);
    if(!bet) return HakiraSEND("Co Dau Buoi", threadID, messageID);
    if(bet < 1000) return HakiraSEND("Bạn cần đặt cược tối thiểu 1000 VND", threadID, messageID);
    if(bet > money) return HakiraSEND("Bạn không đủ tiền để đặt cược", threadID, messageID);
    if(input == "tài" || input == "Tài" || input == '-t') var choose = 'tài'
    if(input == "xỉu" || input == "Xỉu" || input == '-x') var choose = 'xỉu'
    if(input == 'b3gn' || input == 'bbgn' || input == 'bộ ba giống nhau') var choose = 'b3gn'
    if(input == 'b2gn' || input == 'bdgn' || input == 'bộ đôi giống nhau') var choose = 'b2gn'
    if(input == 'cược tổng' || input == 'ct') var choose = 'cuoctong'
    if(input == 'cược số' || input == 'cs') var choose = 'cuocso'
    var tag = ['tài','xỉu','b3gn','b2gn','ct','cs']
    if(!tag.includes(choose)) return HakiraSEND('Sai Tag', threadID, messageID)
    if(choose == 'cuoctong' && (tong < 4 || tong > 17)) return HakiraSEND("Tổng cược không hợp lệ ?", threadID, messageID);
    if(choose == 'cuocso' && (tong < 1 || tong > 6)) return HakiraSEND("Số được chọn không hợp lệ ?", threadID, messageID);
    const number = [], img = [], bodem = 0;
    for(let i = 1; i < 4; i++){
    var n = Math.floor(Math.random() * 6 + 1) /// n = random
    number.push(n)
    var img_ = (await axios.get(encodeURI(getImage(n)), { responseType: 'stream' })).data;
    img.push(img_)

      await new Promise(resolve => setTimeout(resolve, timedelay * 0))
}
var total = number[0] + number[1] + number[2];
if(choose == 'cuocso'){
    if(number[0] == tong || number[1] == tong || number[2] == tong){
        var ans = `${tong}`
        var result = 'win'
        var mn = bet * motsogiong 
        var mne = money + mn
    }
    if(number[1] == tong && number[2] == tong || number[0] == tong && number[2] == tong || number[0] == tong && number[1] == tong){
        var ans = `${tong}`
        var result = 'win'
        var mn = bet * haisogiong
        var mne = money + mn
    }
    if(number[0] == tong && number[1] == tong && number[2] == tong){
        var ans = `${tong}`
        var result = 'win'
        var mn = bet * basogiong
        var mne = money + mn
    }
    if(number[0] != tong && number[1] != tong && number[2] != tong){
        var ans = `${tong}`
        var result = 'lose'
        var mn = bet
        var mne = money - mn
    }   
}
if(choose == 'cuoctong'){
    if(total == tong){
        var ans = "cược tổng"
        var result = 'win'
        var mn = bet * parseInt((getRATE(tong)))
        var mne = money + mn
    } else {
        var ans = `${total}`
        var result = 'lose'
        var mn = bet
        var mne = money - mn
    }
}
if(choose == 'b3gn' ){
    if(number[0] == number[1] && number[1] == number[2]) {
        var ans = "bộ ba đồng nhất"
        var result = 'win'
        var mn = bet * tilethangb3dn
        var mne = money + mn
    } else {
        var ans = (total >= 11 && total <= 18 ? "tài" : "xỉu") 
        var result = 'lose'
        var mn = bet
        var mne = money - mn
    }
}
if(choose == 'b2gn'){
    if(number[0] == number[1] || number[1] == number[2] || number[0] == number[2]) {
        var ans = "bộ hai đồng nhất"
        var result = 'win'
        var mn = bet * tilethangb2dn
        var mne = money + mn
    } else {
        var ans = (total >= 11 && total <= 18 ? "tài" : "xỉu") 
        var result = 'lose'
        var mn = bet
        var mne = money - mn
    }
}
if(choose == 'tài' || choose == 'xỉu') {
if(number[0] == number[1] && number[1] == number[2]){
var ans = "bộ ba đồng nhất"
} else {
var ans = (total >= 11 && total <= 18 ? "tài" : "xỉu") 
}
if(number[0] == number[1] && number[1] == number[2]) {
    var result = 'lose'
    var mn = bet
    var mne = money - mn
}
if(ans == choose) {
    var result = 'win'
    var mn = bet * tilethang
    var mne = mn + money
} else {
    var result = 'lose'
    var mn = bet
    var mne = money - mn
}
}
if(result =='lose'){
    decreaseMoney(senderID, mn)
} else if(result == 'win'){
    increaseMoney(senderID, mn)
}
var msg =   `[ TÀI XỈU ONLINE ]` 
            + '\n' + 
            `- Người Chơi: ${name} Đã Lựa Chọn: ${choose}`
            + '\n' +
            `- Tổng ba xúc xắc: ${total}`
            + '\n' +
            `- Kết Quả: ${ans}`
            + '\n' +   
            `- Bạn cược ${choose} với số tiền ${replace(bet)} VND và ${(result == 'win' ? 'Thắng' : 'Thua')}: ${replace(Math.floor(mn))} VND`
            + '\n' +
            `- Số Tiền Hiện Tại: ${replace(mne)} VND`
            HakiraSEND({body:msg,attachment: img}, threadID, messageID)
            if(bdsd == true) {
          var msg =  `MiraiPay, Ngày ${format_day}\n${(result == 'win') ? 'nhận tiền' : 'trừ tiền'} dịch vụ game tài xỉu\nsố tiền ${replace(mn)}\nSố dư khả dụng: ${replace(mne)}$\nCảm ơn đã tin dùng dịch vụ của MiraiPay`
            HakiraSEND({
                body: msg,

            }, senderID)
        }
} catch(e){
    console.log(e)
}}