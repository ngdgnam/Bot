const activeThreads = new Set();
module.exports.config = {
    name: "dizz",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "",
    description: "Dizz người bạn tag (ngôn của mấy đứa war)",
    commandCategory: "War",
    usages: "dizz @mention",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
}

module.exports.run = async function({ api, args, Users, event }) {
    if (args.length > 0 && args[0] === "stop") {
        if (activeThreads.has(event.threadID)) {
            activeThreads.delete(event.threadID);
            return api.sendMessage("Đã dừng hoạt động của lệnh dizz.", event.threadID);
        } else {
            return api.sendMessage("Lệnh dizz không hoạt động trong nhóm này.", event.threadID);
        }
    }
    const mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("Cần phải tag 1 người bạn muốn dizz vào mặt nó", event.threadID);
    const name = event.mentions[mention];
    const arraytag = [{ id: mention, tag: name }];
    activeThreads.add(event.threadID);

    const messages = [
        "E con di nghe cho ro loi chuy noi ne !",
        "Da la chim cu ma con doi ra ve phuong hoang",
        "Chi la thu cho hoang ma cu tuong minh la ba hoang thien ha.",
        "Da la di con ra ve tien si",
        "Da xau lai con bay kieu sa, quyen quy",
        "Ben ngoai thi gia nai, ben trong thi gia tao.",
        "Vay cung co cai gi la hang that khong hay toan hang fake.",
        "Thu cho co nha que ma doi ngang hang bec ze thanh pho",
        "Co dai ven duong thi tuoi lon sanh vai voi may",
        "Nuoc rua bon cau ma doi so voi nuoc hoa Chanel",
        "Cut hang 3 ma cu tuong minh la socola loai 1",
        "Sinh ra lam phan 2 chan thi dung nen song nhu lu 4 cang.",
        "U thi tao xau nhung ket cau tao hai hoa con do hon may xau tu xuong chau xau ra",
        "Den ma con phai tranh xa khi gap may an o bay hay ma cu nhu sach se than hinh day ghe ma cu tuong hot xoan",
        "Deo duoc dang hoang ma ra giong thanh cao",
        "choi xau voi tao thi tao cho phan ra nghia dia",
        "Mo mom ra chui tao la CHO van ve meo mo thich gay song gio doi lam kho tao sao ??!",
        "Dung nghi trinh do cao ma khien tao lao dao chua du xon xao dau con cao.",
        "Song tren doi phai biet minh la ai",
        "Lich su thi khong co chi co cai mau choi cho thi khong ai sanh bang",
        "Neu da la Cao thi dung tap dien thanh Nai",
        "Con neu da co gang dien hop vai thi ve sau dung lo ra cai duoi chon gia tao",
        "May lau lau lai ngu mot phat, hay ma da ngu hoc thuong nien",
        "Khoe may da tot nghiep dai hoc ma lai can chi giao duc thuong xuyen",
        "Moi co chut ma cu tuong minh 9 nut",
        "Tuoi con cac ma cu tuong minh con cop",
        "Dong thu lon tom lon dam, lon duoi uoi no dit",
        "Lon con vit no phang, lon giang mai lon ia chay",
        "Lon nhay hiphop, lon hang trieu con suc vat",
        "Doi chi may xiu, chi gan cu gia de dit con di me may",
        "O o yamate",
        "Xong roi ne",
        "Dit me may lat phat nhu mua roi, dit toi boi nhu bom dan",
        "Dit lang man nhu romeo va juliet",
        "Dit dung tim phoi, dit cap mat nai",
        "Dit chai lo dit, dit khit cai lo lon con di me may",
        "Dit nhu may con diem ben cho dong xuan, dit dang chan ma len dang dau",
        "Dit sap cau, sap cong",
        "Dit rot xuong song roi dit xuong am phu",
        "De cho may dau thai",
        "Hoa kiep con cho nhu may tung mong uoc",
        "Chui it hieu nhe nghe hum con on lon"
    ];

    const sendMessages = () => {
        for (let i = 0; i < messages.length; i++) {
            setTimeout(() => {
                if (activeThreads.has(event.threadID)) {
                    api.sendMessage({ body: messages[i] + " " + name, mentions: arraytag }, event.threadID);
                }
            }, i * 5000);
        }
    };

    sendMessages();
};
