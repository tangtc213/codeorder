const fs = require('fs')
const multer = require('multer')

// const md5 = require('md5')
const express = require('express')
// const sharp = require('sharp')
const svgCaptcha = require('svg-captcha')
const fsp = fs.promises
const uploader = multer({
  dest: './upload/',
  preservePath: true,
})

let db
(async function(){
  db = await require('./db')
}())

const changePasswordTokenMap = {}
const mailer = require('./mailer')

const app = express.Router()


app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})


// 使用session空间储存信息
var sessionStore = Object.create(null)

app.use(function sessionMW(req,res,next) {
    if(req.cookies.sessionId) {
        req.session = sessionStore[req.cookies.sessionId]
        if(!req.session) {
            req.session = sessionStore[req.cookies.sessionId] = {}
        }
    } else {
        let id =  Math.random().toString(16).slice(2)
        req.session = sessionStore[id] = {}
        res.cookie('sessionId', id, {
            maxAge: 86400000,
        })
    }
    next()
})




// 检查签名的用户为已签名的用户添加req.user
app.use(async(req, res, next) => {
  if(req.signedCookies.user) {
    req.user = await db.get('SELECT * FROM users WHERE name = ?', req.signedCookies.user)
  }
  next()
})



app.post('/register', async (req, res, next) => {
    var regInfo = req.body

    if (req.session.captcha !== regInfo.captcha) {
      res.status(403).json({
        code: -1,
        msg: '验证码错误',
      })
      return
  }

    var user = await db.get('SELECT * FROM users WHERE name=?', regInfo.name)
    var email = await db.get('SELECT * FROM users WHERE email=?', regInfo.email)

    if (user) {
      // if (req.file) {
      //   await fsp.unlink(req.file.path)
      // }
      res.status(401).json({
        code: -1,
        msg: '用户名已被占用'
      })
    } else if(email){
      res.status(401).json({
        code: -1,
        msg: '用户邮箱已注册'
      })
    } else {
      let lastId = db.get('SELECT id FROM users ORDER BY ID DESC LIMIT 1')
      let currentId = Number(lastId.id) + 1
      await db.run('INSERT INTO users (id, name, email, password, title) VALUES (?,?,?,?,?)',
        [currentId, regInfo.name, regInfo.email, regInfo.password, regInfo.title]
      )

      res.json({
        code: 0,
        msg: '注册成功'
      })
    }
  })

// 请求验证图片
app.get('/captcha', function (req, res, next) {
  var captcha = svgCaptcha.create();
  req.session.captcha = captcha.text;
  res.type('svg');
  res.status(200).send(captcha.data);
  next()
});


app.get('/userinfo', async (req, res, next) => {
  var userid = req.cookies.userid
  if (userid) {
    var user = await db.get('SELECT id,name,title FROM users WHERE id=?', userid)
    res.json(user)
  } else {
    res.status(404).json({
      code: -1,
      msg: '不存在此餐厅'
    })
  }
})

app.route('/login')
  .post(async (req, res, next) => {
    var tryLoginInfo = req.body

    if (req.session.captcha !== tryLoginInfo.captcha) {
        res.status(403).json({
          code: -1,
          msg: '验证码错误',
        })
        return
    }

    var user = await db.get('SELECT id, name, title FROM users WHERE name=? AND password=?',
      tryLoginInfo.name, tryLoginInfo.password
    )

    if (user) {
      res.cookie('userid', user.id, {
        maxAge: 86400000,
        // signed: true,
      })
      res.json(user)
    } else {
      res.status(403).json({
        code: -1,
        msg: '用户名或密码错误',
      })
    }
  })


app.route('/forgot')
  .post(async (req, res, next) => {
    var email = req.body.email
    var user = await db.get('SELECT * FROM users WHERE email=?', email)

    if (!user) {
      res.status(403).json({
        code: -1,
        msg: '不存在此用户'
      })
    } else {
      res.json({
        code: 0,
        user
      })
    }

    // var token = Math.random().toString().slice(2)

    changePasswordTokenMap[user.id] = email

    setTimeout(() => {
      delete changePasswordTokenMap[token]
    }, 60 * 1000 * 20)//20分钟后删除token

    var link = `http://localhost:3005/change-password/${id}`

    // console.log(link)

    // mailer.sendMail({
    //   from: 'tang213213@qq.com',
    //   to: email,
    //   subject: '密码修改',
    //   text: link
    // }, (err, info) => {
    //   res.json({
    //     code: 0,
    //     msg: '已向您的邮箱发送密码重置链接，请于20分钟内点击链接修改密码！'
    //   })
    // })
  })

app.route('/change-password/:token')
  .post(async (req, res, next) => {
    var token = req.params.token
    var email = changePasswordTokenMap[token]
    var password = req.body.password

    if (!email) {
      res.json({
        code: -1,
        msg: '链接已失效'
      })
      return
    }

    delete changePasswordTokenMap[token]

    await db.run('UPDATE users SET password=? WHERE email=?', md5(md5(password)), email)

    res.end({
      code: 0,
      msg: '密码修改成功'
    })
  })

app.get('/logout', (req, res, next) => {
  res.clearCookie('userid')
  res.json({
    code: 0,
    msg: '登出成功'
  })
})

module.exports = app
