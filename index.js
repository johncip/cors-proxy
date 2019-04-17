const http = require('http')
const logger = require('heroku-logger')
const httpProxy = require('http-proxy')

const target = process.env.TARGET || 'http://localhost:9000'
const proxy = httpProxy.createProxyServer({})

proxy.on('proxyReq', (proxyReq, req, res, options) => {
  proxyReq.setHeader('X-Special-Proxy-Header', 'foobar')
})

proxy.on('error', (err, req, res) => {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  })

  logger.error(err.toString())
  res.end(err.toString())
})

const server = http.createServer((req, res) => {
  proxy.web(req, res, { target })
})

const port = process.env.PORT || 8080
logger.info('Starting server', { port: port })
server.listen(port)
