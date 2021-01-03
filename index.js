

const app = require('./app')
const httpServer = require('./http-server')


httpServer.on('request', app)

const port = 5000

httpServer.listen(port, () => {
    console.log('server listening on port', port)
})
