const httpServer = require('./http-server')
const io = require('socket.io')


const ioServer = io(httpServer)

module.exports = ioServer
