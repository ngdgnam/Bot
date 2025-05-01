const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const FormData = require('form-data');

module.exports.config = {
    name: "imganime",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Satoru",
    description: "Chuyển đổi ảnh thành phong cách anime",
    commandCategory: "Tiện ích",
    usages: "[Reply to an image]",
    cooldowns: 5,
};

let streamURL = (url, ext = 'jpg') => require('axios').get(url, {
    responseType: 'stream',
}).then(res => (res.data.path = `tmp.${ext}`, res.data)).catch(e => null);

async function processDiffusecraftImage(imageFilePath) {
    function generateSessionHash() {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        return Array(11).fill().map(() => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    }

    const sessionHash = generateSessionHash();

    try {
        const uploadForm = new FormData();
        uploadForm.append('files', await fs.readFile(imageFilePath), {
            filename: 'image.jpg',
            contentType: 'image/jpeg',
        });

        const uploadHeaders = {
            ...uploadForm.getHeaders(),
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            'Origin': 'https://taoanhdep.com',
            'Sec-Ch-Ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
            'Sec-Ch-Ua-Mobile': '?1',
            'Sec-Ch-Ua-Platform': '"Android"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
        };

        const uploadResponse = await axios.post('https://tuan2308-diffusecraft.hf.space/upload', uploadForm, { headers: uploadHeaders });
        const uploadedImageUrl = uploadResponse.data[0];

        const optionsHeaders = {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            'Access-Control-Request-Headers': 'content-type',
            'Access-Control-Request-Method': 'POST',
            'Origin': 'https://taoanhdep.com',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
        };

        await axios({
            method: 'OPTIONS',
            url: 'https://tuan2308-diffusecraft.hf.space/queue/join?__theme=light',
            headers: optionsHeaders
        });
        const processHeaders = {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            'Content-Type': 'application/json',
            'Origin': 'https://taoanhdep.com',
            'Sec-Ch-Ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
            'Sec-Ch-Ua-Mobile': '?1',
            'Sec-Ch-Ua-Platform': '"Android"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
        };

        const processPayload = {
            "data": [
                "anime",
                "nsfw, strange color, blurred , ugly, tiling, bad hand drawing, poorly drawn feet, poorly drawn face, out of frame, extra limbs, deformity, deformity, body out of frame, blur, bad anatomy, blurred, watermark, grainy, signature, cropped, draft , low detail, low quality, two faces, 2 faces, garbled, ugly, low resolution, tiled, repetitive , grainy, garbled, plastic, distorted , ostentatious, ugly, oversaturated, grainy, low resolution, distorted, blurry, bad anatomy, distortion, poorly drawn face, mutant , mutant, appendage, ugly, poorly drawn hand, missing limb, blurred, floating limb, disjointed limb, hand deformity, blurred, out of focus, long neck, long body, ugly, hideous, drawing bad, garbled, distorted, imperfect, surreal, bad hand, text, error, extra digits, less digits, garbled , worst quality , low quality, normal quality, jpeg artifact, signature, watermark, username, blurry, artist name, multiple hands, extra limb, extra finger, conjoined finger, deformed finger, old, bad eye, imperfect eye, misaligned eye , unnatural face, stiff face, stiff body, disproportionate, unnatural body, lack of body, unclear details, sticky details, low details, details distorted, ugly hands, imperfect hands, (deformed hands and fingers: 1.5), (long body :1.3), (mutated, poorly drawn :1.2) bad hands, fused hands , lost hand, arm disappeared, thighs disappeared, calves disappeared, legs disappeared, ui, lost fingers, (((((realistic, semi-realistic, render, outline)))), already crop, worst quality, low quality, jpeg shaping, ugly, duplicate, garbled, out of frame, extra fingers, mutated hand, poorly drawn hand, bad drawn face, mutated variable, deformed, blurred, dehydrated, bad anatomy, bad proportions, superfluous limbs, cloned face, deformity, gross proportions, deformed limbs, lost hands, lost legs, extra arms, extra legs , sticky fingers, too many fingers , long neck, text, close-up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, sick, cropped amputee, extra fingers, mutated hand, bad hand drawing, bad drawn face, mutant, deformed, blurred, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, deformity, gross proportions, deformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, blurred, deformed face, variable hands shape, deformed fingers, ugly, bad anatomy, extra fingers, extra hands, deformed eyes, logo, text (:1.2) (:1.2) , (:1.2) sketch, (poor quality) best:1.4), (low quality:1.4), (normal quality:1.4), low quality, bad anatomy, bad hand, vaginal vagina, ((monochrome)), ((scale) gray)), drooping eyelids, many eyebrows, (cropped), oversaturated, extra limb, amputee, deformed arms, long neck, long body, imperfection, (bad hands), signature, figure blurred, username, artist name, conjoined fingers, deformed fingers, bad eyes, imperfect eyes, misaligned eyes, unnatural face, unnatural body, error, bad photo, bad photo",
                1, 28, 7.5, true, -1, "loras/3DMM_V12.safetensors", 0.5, null, 0.33, null, 0.33, null, 0.33, null, 0.33, "Euler a", 1024, 1024, "eienmojiki/Anything-XL", null, "img2img",
                {
                    "path": uploadedImageUrl,
                    "url": uploadedImageUrl,
                    "orig_name": "uploaded_image.jpg",
                    "size": 186332,
                    "mime_type": "image/jpeg",
                    "meta": {"_type": "gradio.FileData"}
                },
                "Canny", 512, 1024, [], null, null, 0.59, 100, 200, 0.1, 0.1, 1, 0, 1, false, "Compel", null, 1.4, 100, 10, 30, 0.55, "Use same sampler", "", "", false, true, 1, true, false, true, true, false, "./images", false, false, false, true, 1, 0.55, false, true, false, true, false, "Use same sampler", false, "", "", 0.35, true, true, false, 4, 4, 32, false, "", "", 0.35, true, true, false, 4, 4, 32, false, null, null, "plus_face", "original", 0.7, null, null, "base", "style", 0.7
            ],
            "event_data": null,
            "fn_index": 11,
            "trigger_id": 14,
            "session_hash": sessionHash
        };

        await axios.post('https://tuan2308-diffusecraft.hf.space/queue/join?__theme=light', processPayload, { headers: processHeaders });
        const streamHeaders = {
            'Accept': 'text/event-stream',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            'Cache-Control': 'no-cache',
            'Origin': 'https://taoanhdep.com',
            'Sec-Ch-Ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
            'Sec-Ch-Ua-Mobile': '?1',
            'Sec-Ch-Ua-Platform': '"Android"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
        };

        const streamResponse = await axios.get(`https://tuan2308-diffusecraft.hf.space/queue/data?session_hash=${sessionHash}`, {
            headers: streamHeaders,
            responseType: 'stream'
        });

        return new Promise((resolve, reject) => {
            let data = '';
            let resultInfo = {
                processedImageUrl: null,
                seeds: null
            };

            streamResponse.data.on('data', (chunk) => {
                data += chunk.toString();
                const lines = chunk.toString().split('\n');
                lines.forEach(line => {
                    if (line.startsWith('data: ')) {
                        try {
                            const jsonData = JSON.parse(line.slice(6));
                            if (jsonData.msg === 'process_completed') {
                                resultInfo.processedImageUrl = jsonData.output.data[0][0].image.url;
                                const seedsMatch = jsonData.output.data[1].match(/Seeds: \[(.*?)\]/);
                                if (seedsMatch) {
                                    resultInfo.seeds = seedsMatch[1].split(',').map(Number);
                                }
                            }
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                        }
                    }
                });

                if (data.includes('"msg":"process_completed"')) {
                    resolve(resultInfo);
                }
            });

            streamResponse.data.on('end', () => {
                resolve(resultInfo);
            });

            streamResponse.data.on('error', (error) => {
                reject(error);
            });
        });

    } catch (error) {
        throw error;
    }
}
module.exports.run = async function ({ api, event, args }) {
    const messageID = event.messageID;
    const threadID = event.threadID;
    if (event.type !== "message_reply" || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        return api.sendMessage("Vui lòng reply 1 ảnh để convert sang anime", threadID, messageID);
    }

    const attachment = event.messageReply.attachments[0];
    if (attachment.type !== "photo") {
        return api.sendMessage("Vui lòng reply một ảnh (không phải video hoặc file khác).", threadID, messageID);
    }

    const tempDir = path.join(__dirname, 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    const tempInputPath = path.join(tempDir, `input_${Date.now()}.jpg`);

    try {
        const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
        await fs.writeFile(tempInputPath, response.data);

        api.sendMessage("⏳ Đang xử lý ảnh, vui lòng đợi...", threadID, messageID);
        const result = await processDiffusecraftImage(tempInputPath);

        if (!result.processedImageUrl) {
            throw new Error("Không thể xử lý ảnh");
        }
        const processedAttachment = await streamURL(result.processedImageUrl);
        if (!processedAttachment) {
            throw new Error("Không thể tải ảnh đã xử lý");
        }
        await api.sendMessage(
            {
                body: `🖼️ Đây là ảnh anime của bạn:`,
                attachment: processedAttachment
            },
            threadID,
            messageID
        );
        await fs.unlink(tempInputPath);

    } catch (error) {
        api.sendMessage("Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại sau.", threadID, messageID);
    }
};