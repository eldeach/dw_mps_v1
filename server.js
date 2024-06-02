// ======================================================================================== [dotenv 환경변수 등록]
require('dotenv').config({ path: './secrets/.env' })

// ======================================================================================== [Import Libaray]
// express
const express = require('express');

// path : react로 route를 넘기기 위한 라이브러리
const path = require('path');

// bodyParser
const bodyParser = require('body-parser')

//connect-flash : passport에서 사용할 flash 메시지 라이브러리
const flash = require('connect-flash')

// express-sanitizers : https 관련 라이브러리
const expressSanitizer = require("express-sanitizer");

// https
const https = require("https");
const fs = require("fs");

// SSL
const options = {
  key: fs.readFileSync("./secrets/cert.key"),
  cert: fs.readFileSync("./secrets/cert.crt"),
};

// OS 타입 확인 - 아직 사용할 일 없음
// const { type } = require('os');


// ======================================================================================== [Server Initialize] 객체 생성 및 미들웨어 적용, 서버 listen 함수 실행
// express 객체 생성
const app = express();

// 서버 미들웨어 적용
app.use(express.json({ limit: '10mb' })) // json 송수신 용량 제한
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(flash())
app.use(express.static(path.join(__dirname, process.env.react_build_path)));

// https 미들웨어
app.use(expressSanitizer());
app.use("/", express.static("public"));

// https 의존성으로 certificate와 private key로 새로운 서버를 시작
https.createServer(options, app).listen(process.env.PORT, async () => {
  console.log('HTTPS server started on port ' + process.env.PORT)
});


// ======================================================================================== [Import Component] js - app 객체 전달
const { ppLocal, ppLocalLogout, ppLocalSessionCheck } = require('./Auth/authPassportLocal')
ppLocal(app)
ppLocalLogout(app)
ppLocalSessionCheck(app)

const { authPermissionCheck } = require('./Auth/authPermissionCheck')
authPermissionCheck(app)

const { envClient } = require('./Env/envClient')
envClient(app)

const { mcsdata } = require('./MCSDATA/mcsdata')
mcsdata(app)

const { rdData } = require('./Rd/rdData')
rdData(app)

//================================================================================ [공통 기능] 모든 route를 react SPA로 연결 (이 코드는 맨 아래 있어야함)
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.react_build_path + 'index.html'));
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.react_build_path + 'index.html'));
});