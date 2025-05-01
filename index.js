const { spawn } = require("child_process");
const { readFileSync } = require("fs-extra");
const http = require("http");
const axios = require("axios");
const semver = require("semver");
const logger = require("./utils/log");
const path = require('path');

///////////////////////////////////////////////////////////
//========= Create website for dashboard/uptime =========//
///////////////////////////////////////////////////////////
const PORT = process.env.PORT || 2025;
const express = require("express");
const app = express();

// Define a route
app.get('/', (request, response) => {
    const result = `Nhớ ib Facebook Lương Trường Khôi để cập nhật file nha (free) Facebook: https://facebook.com/Khoi.Meta`;
    response.send(result);
});
// Start the server
app.listen(PORT, () => {
    console.log(`[ SECURITY ] -> Máy chủ khởi động tại port: ${PORT}`);
});


function startBot(message) {
    (message) ? logger(message, "BOT STARTING") : "";

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "main.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

   child.on("close",async (codeExit) => {
      var x = 'codeExit'.replace('codeExit',codeExit);
        if (codeExit == 1) return startBot("Đang Khởi Động Lại, Vui Lòng Chờ ...");
         else if (x.indexOf(2) == 0) {
           await new Promise(resolve => setTimeout(resolve, parseInt(x.replace(2,'')) * 1000));
                 startBot("Bot has been activated please wait a moment!!!");
       }
         else return; 
    });

    child.on("error", function (error) {
        logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
    });
};

axios.get("https://raw.githubusercontent.com/tandung1/Bot12/main/package.json").then((res) => {})
startBot()
