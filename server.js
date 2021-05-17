const ParcelProxyServer = require('parcel-proxy-server')

// configure the proxy server
const server = new ParcelProxyServer({
  entryPoint: './index.html',
  // parcelOptions: {
  //   https: true,
  // },
  // https: true,
  proxies: {
    // add proxies here
    // 'https://www.baidu.com': {
    //   target: 'https://www.baidu.com',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     'https://www.baidu.com': '/',
    //   },
    // },
    // '/tianditu': {
    //   target: 'https://www.tianditu.gov.cn/',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '/tianditu': '/',
    //   },
    // },
  },
})

// the underlying parcel bundler is exposed on the server
// and can be used if needed
server.bundler.on('buildEnd', () => {
  console.log('Build completed!')
})

// start up the server
server.listen(8080, () => {
  console.log('Parcel proxy server has started')
})
