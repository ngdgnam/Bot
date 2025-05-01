module.exports.config = {
    name: "topbox",
    version: "1.1.1",
    credits: "DC-Nam",
    hasPermssion: 0,
    description: "Xem top money, level... ở trong box hoặc sever?",
    usages: "[boxmoney|boxlevel|svmoney|svlevel] + độ dài list(ko có mặc định là 10)",
    commandCategory: "Thành Viên",
    cooldowns: 5
};
module.exports.run = async function({
    api: a,
    event: e,
    args: g,
    Currencies,
    Users
}) {
    const {
        threadID: t,
        messageID: m,
        senderID: s,
        participantIDs: pI
    } = e
    var arr = [],
        newArr = [],
        msg = "",
        type = g[0],
        leng = parseInt(g[1]) - 1
    const allType = ["boxmoney", "boxlevel", "svmoney", "svlevel"]
    if (!allType.includes(type)) return a.sendMessage(`===== 𝗧𝗢𝗣 =====\n━━━━━━━━━━━━━━━━\nNhập 𝗧𝗢𝗣 bạn muốn xem\n→ Top boxmoney: xem những người có số tiền nhiều nhất ở nhóm\n→ Top boxlevel: xem những người có level tương tác cao nhất ở nhóm\n→ Top svmoney: xem top 10 đại gia giàu nhất hệ thống bot\n→ Top svlevel: xem top 10 người có level cao nhất hệ thống bot\n━━━━━━━━━━━━━━━━\n𝗩𝗗: /top svmoney`, t, m)
    if (isNaN(leng) && leng) return a.sendMessage(`Độ dài list phải là 1 con số`, t, m)
    switch (type) {
        case "boxmoney": {
            for (const id of pI) {
                let money = (await Currencies.getData(id)).money || 0
                arr.push({
                    id: id,
                    money: money
                })
            }
            arr.sort(S("money"))
            for (const i in arr) {
                newArr.push({
                    stt: i,
                    id: arr[i].id,
                    money: arr[i].money
                })
            }
            msg = `==== [ 𝗧𝗢𝗣 10 TỶ PHÚ ] ====\n━━━━━━━━━━━━━━━━━━\n`.toUpperCase()
            for (const i in newArr) {
                let name = (await Users.getData(newArr[i].id)).name || ""
                msg += `${i < 4 ? ICON(i) : `${i}.`} ${name}\n→ Số tiền: ${CC(newArr[i].money)}$\n\n`
                if (i == leng && i < newArr.length || i == 10) break
            }
            let find = newArr.find(i => i.id == s)
            msg += TX("money", find.stt, find.money)
            a.sendMessage(msg, t, m)
        }
        break
    case "boxlevel": {
        for (const id of pI) {
            let exp = (await Currencies.getData(id)).exp || 0
            arr.push({
                id: id,
                exp: exp
            })
        }
        arr.sort(S("exp"))
        for (const i in arr) {
            newArr.push({
                stt: i,
                id: arr[i].id,
                exp: arr[i].exp
            })
        }
        msg = `== [ 𝗧𝗢𝗣 10 LEVEL NHÓM ] ==\n━━━━━━━━━━━━━━━━━━\n`.toUpperCase()
        for (const i in newArr) {
            let name = (await Users.getData(newArr[i].id)).name || ""
            msg += `${i < 4 ? ICON(i) : `${i}.`} ${name}\n→ Level: ${LV(newArr[i].exp)}\n\n`
            if (i == leng && i < newArr.length || i == 10) break
        }
        let find = newArr.find(i => i.id == s)
        msg += TX("level", find.stt, find.exp)
        a.sendMessage(msg, t, m)
    }
    break
    case "svlevel": {
        let get = await Currencies.getAll(['userID', 'exp'])
        get.sort(S("exp"))
        for (const i in get) {
            arr.push({
                stt: i,
                id: get [i].userID,
                exp: get [i].exp
            })
        }
        msg = `= [ 𝗧𝗢𝗣 𝟭𝟬 𝗟𝗘𝗩𝗘𝗟 𝗦𝗘𝗩𝗘𝗥 ] =\n━━━━━━━━━━━━━━━━━━\n`.toUpperCase()
        for (const i in arr) {
            let name = (await Users.getData(arr[i].id)).name || ""
            msg += `${i < 4 ? ICON(i) : `${i}.`} ${name}\n→ Level: ${LV(arr[i].exp)}\n\n`
            if (i == leng && i < arr.length || i == 10) break
        }
        let find = arr.find(i => i.id == s)
        msg += TX("level", find.stt, find.exp)
        a.sendMessage(msg, t, m)
    }
    break
    case "svmoney": {
        let get = await Currencies.getAll(['userID', 'money'])
        get.sort(S("money"))
        for (const i in get) {
            arr.push({
                stt: i,
                id: get [i].userID,
                money: get [i].money
            })
        }
        msg = `==== [ 𝗧𝗢𝗣 10 TỶ PHÚ ] ====\n━━━━━━━━━━━━━━━━━━\n`.toUpperCase()
        for (const i in arr) {
            let name = (await Users.getData(arr[i].id)).name || ""
            msg += `${i < 4 ? ICON(i) : `${i}.`} ${name}\n→ Số tiền: ${CC(arr[i].money)}$\n\n`
            if (i == leng && i < arr.length || i == 10) break
        }
        let find = arr.find(i => i.id == s)
        msg += TX("money", find.stt, find.money)
        a.sendMessage(msg, t, m)
    }
    break
    }
}

function LV(x) {
    return Math.floor((Math.sqrt(1 + (4 * x) / 3) + 1) / 2)
}

function CC(n) {
    return n.toLocaleString('en-US', {
        minimumFractionDigits: 2
    })
}

function ICON(i) {
    return i == 0 ? "🏆" : i == 1 ? "🥇" : i == 2 ? "🥈" : i == 3 ? "🥉" : ""
}

function S(k) {
    return function(a, b) {
        let i = 0;
        if (a[k] > b[k]) {
            i = 1
        } else if (a[k] < b[k]) {
            i = -1
        }
        return i * -1
    }
}

function TX(tx, i, x) {
  return `━━━━━━━━━━━━━━━━━━\n${i >= 11 ? `→ Bạn đứng thứ: ${i}\n→ ${tx == "money" ? `Số tiền: ${CC(x)}$` : `Level: ${LV(x)}`}` : i >= 1 && i <= 4 ? "→ Bạn hiện đang có mặt trong 𝗧𝗢𝗣 " : i == 0 ? "→ Hiện tại bạn đang là người đứng 𝗧𝗢𝗣 đầu" : "→ Hiện tại bạn đang có mặt trong 𝗧𝗢𝗣 10"}`
}