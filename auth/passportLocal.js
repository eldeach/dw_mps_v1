// ======================================================================================== [Import Libaray]
// passport
const passport = require('passport'); // passport
const LocalStrategy = require('passport-local').Strategy; // passport 로컬 인증 전략 적용

//session
const session = require('express-session'); // 세션 라이브러리

//bcrypt
// const bcrypt = require('bcrypt'); // bcrypt 라이브러리 
// const saltRounds = 12;

//crypt
const crypto = require('crypto');
const salt = 10; //crypto.randomBytes(128).toString('base64');
const algorithm = 'SHA512'

//moment
const moment = require("moment");


// ======================================================================================== [Import Component] js
const sendReq = require('../dbConns/msSqlCPV').sendReq;

async function sesstionTimeGet() {
  let sesstimePrm = {
    p: [],
    o: [
      {
        name: 'P_SESSTIME'
      },
    ],
    procedure: 'DWS_CPV_SEL_LOGIN_SESSIONTIME'
  }

  return parseInt((await sendReq(sesstimePrm)).P_SESSTIME)
}

async function ppLocal(app) {
  app.use(session({
    name: 'cpv.connect.sid',
    secret: process.env.passport_secret_code,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000,
    },
    rolling: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.post('/local-login',
    passport.authenticate('local', { successRedirect: "/local-login-success", failureRedirect: '/local-login-fail', failureFlash: true }));



  passport.use(new LocalStrategy({
    usernameField: 'user_account', // form에서 전달받은 값 중 username으로 사용할 html div의 id 값
    passwordField: 'user_pw', // form에서 전달받은 값 중 password로 사용할 html div의 id 값
    session: true, // 세션 사용 여부 : true
    passReqToCallback: true, // true 일경우 다음 콜백함수에서 req 인자를 첫번째로 주고 클라이언트가 전송한 req객체를 사용할 수 있음
    // 사용하지 않는다면 false로 하고 다음 콜백함수에서 req 인자를 제거해서 총 3개의 인자만 전달해야함
  }, async function (req, userID, userPW, done) { // 첫번째 인자는 위에서 지정한 usernameField 값, 두번째 인자는 passwordField 값, passReqToCallback : true이면 맨 앞에 req 객체를 받을 수 있음
    let loginPrm = {
      p: [
        {
          name: 'P_USER_ID',
          value: `${userID}`
        },
        {
          name: 'P_PWD',
          value: crypto.createHash(algorithm).update(userPW + salt).digest("base64")
        },
        {
          name: 'PLANT_CD',
          value: `${req.body.plant_cd}`
        },
      ],
      o: [
        {
          name: 'P_RESULT'
        },
      ],
      procedure: 'DWS_CPV_SEL_LOGIN_FINDUSER'
    }

    if ((await sendReq(loginPrm)).P_RESULT == '1') {
      return done(null, userID)
    } else {
      return done(null, false, { message: "F_LOGIN_09" })
    }
  }));

  passport.serializeUser(function (userID, done) {
    return done(null, userID)
  });

  passport.deserializeUser(function (userID, done) {
    done(null, userID)
  });

  app.get('/local-login-success', async function (req, res) {
    let expireTimeSec = await sesstionTimeGet()
    req.session.cookie.maxAge = expireTimeSec * 1000
    res.status(200).json({ msg : 'F_LOGIN_07', extraData : {expireDateTime:  moment(new Date).add(expireTimeSec, 's')}})
  })

  app.get('/local-login-fail', function (req, res) {
    res.status(200).json({ msg : req.session.flash.error.slice(-1)[0]})
  })
}


function ppLocalLogout(app) {
  app.get('/local-logout', function (req, res) {
    req.session.destroy(async () => {
      res.status(200).json({msg : 'F_LOGIN_14'})
    });
  })
}

function ppLocalSessionCheck(app) {
  app.get('/sessioncheck', async function (req, res) {
    if (req.user) {
      let expireTimeSec = await sesstionTimeGet()
      req.session.cookie.maxAge = expireTimeSec * 1000
      res.status(200).json({ msg : 'F_LOGIN_13', extraData : {expireDateTime:  moment(new Date).add(expireTimeSec, 's')}})
    } else {
      res.status(200).json({ msg : 'F_LOGIN_11'})
    }
  })
}

module.exports = { ppLocal, ppLocalLogout, ppLocalSessionCheck };