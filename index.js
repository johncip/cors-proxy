const http = require('http')
const logger = require('heroku-logger')
const httpProxy = require('http-proxy')

function createProxy (target, auth) {
  const proxy = httpProxy.createProxyServer({})

  proxy.on('proxyReq', (proxyReq) => {
    if (auth) {
      proxyReq.setHeader('Authorization', `Basic ${auth}`)
    }
  })

  proxy.on('proxyRes', (proxyRes) => {
    proxyRes.setHeader('Access-Control-Allow-Origin', '*')
    proxyRes.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
  })

  proxy.on('error', (err, req, res) => {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    })

    logger.error(err.toString())
    res.end(err.toString())
  })

  return proxy
}

const port = process.env.PORT || 8080
const target = process.env.TARGET || 'http://httpbin.org'
const auth = process.env.AUTH_B64
const proxy = createProxy(target, auth)

const server = http.createServer((req, res) => {
  proxy.web(req, res, { target, changeOrigin: true })
})

logger.info('Starting server', { port })
server.listen(port)
