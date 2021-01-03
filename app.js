const path = require('path')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const sqlite = require('sqlite')
const userAccountMiddleware = require('./user-account')
const io = require('socket.io')

const http = require('http')
const app = express()
const server = http.createServer(app)

const ioServer = io(server, {
  cors: {
    origin: true,
    credentials: true
  }
})

global.ioServer = ioServer
const restaurantMiddleware = require('./restaurant')

ioServer.on('connection', (socket) => {
    console.log('someone on')
});

app.use(cors({
    origin: true,
    maxAge: 86400000,
    credentials: true,
}))




app.use(cookieParser('sadf9a7sdf79afd9'))
// 加入build文件夹
// app.use(express.static(__dirname + '/build'))
app.use(express.static(path.join(__dirname, 'build')));
app.use('/static',express.static(__dirname + '/static'))
app.use('/upload',express.static(__dirname + '/upload')) //图片静态文件
app.use(express.urlencoded({extended: true})) // 用来扩展utl编码的请求体
app.use(express.json()) //用来解析json请求体

app.use('/api', userAccountMiddleware)
app.use('/api', restaurantMiddleware)
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
})



// 检查签名的用户为已签名的用户添加req.user
app.use(async(req, res, next) => {
    if(req.signedCookies.user) {
      req.user = await db.get('SELECT * FROM users WHERE name = ?', req.signedCookies.user)
    }
    next()
  })


server.listen(5000, () => console.log(5000))

// module.exports = app
