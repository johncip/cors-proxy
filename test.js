const http = require('http')
const logger = require('heroku-logger')

const target = process.env.TARGET || 'http://localhost:9000'

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  })

  res.write(`target: ${target}`)
  res.end(`port: ${port}`)
})

const port = process.env.PORT || 8080
logger.info('Starting server', { port: port })
server.listen(port)

