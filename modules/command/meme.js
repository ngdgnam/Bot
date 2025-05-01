module.exports.config = {
  name: "meme",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Tuấn",
  description: "Random ảnh memevn",
  commandCategory: "Ảnh",
  usages: "memevn",
  cooldowns: 2,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
    
};

module.exports.run = async({api,event,args,Users,Threads,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
    var link = [
"https://i.imgur.com/Jy5bCx2.jpg",
"https://i.imgur.com/yAtQUQu.jpg",
"https://i.imgur.com/MdhUHdV.jpg",
"https://i.imgur.com/KKmkIop.jpg",
"https://i.imgur.com/Adr4be1.jpg",
"https://i.imgur.com/s2giVqG.jpg",
"https://i.imgur.com/OLp3vhz.png",
"https://i.imgur.com/W2VGWqb.jpg",
"https://i.imgur.com/EBJcGFf.jpg",
"https://i.imgur.com/WYchdJG.jpg",
"https://i.imgur.com/dwVGQD6.jpg",
"https://i.imgur.com/3MbRb7U.jpg",
"https://i.imgur.com/cpzJeWp.jpg",
"https://i.imgur.com/D281oqO.jpg",
"https://i.imgur.com/JNKZA8P.jpg",
"https://i.imgur.com/5Nl04oP.jpg",
"https://i.imgur.com/wMxv9qa.jpg",
"https://i.imgur.com/UmfVLiD.jpg",
"https://i.imgur.com/fIpWNOy.jpg",
"https://i.imgur.com/GtcFh2Y.jpg",
"https://i.imgur.com/1HFEzu0.jpg",
"https://i.imgur.com/qSuCJzj.jpg",
"https://i.imgur.com/AZpbUsz.png",
"https://i.imgur.com/JtGE76p.jpg",
"https://i.imgur.com/ZJYI9pQ.jpg",
"https://i.imgur.com/nC9aCJZ.jpg",
"https://i.imgur.com/BI9eFuS.jpg",
"https://i.imgur.com/ZPUguG2.jpg",
"https://i.imgur.com/IA8Dl6W.jpg",
"https://i.imgur.com/xYvvgIS.jpg",
"https://i.imgur.com/P8Cuobo.jpg",
"https://i.imgur.com/ZB3G2XY.jpg",
"https://i.imgur.com/X8dyJFy.jpg",
"https://i.imgur.com/DXbEYs5.jpg",
"https://i.imgur.com/Kp4oBzH.jpg",
     ];
     var callback = () => api.sendMessage({body:``,attachment: fs.createReadStream(__dirname + "/cache/1.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/1.jpg")).on("close",() => callback());
   };
