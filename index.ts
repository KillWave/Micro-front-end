import { registryApp } from './utils/router-proxy'

registryApp('http://localhost:8890', (location) => {
  // console.log(location.hash)
  return location.hash === '#/baidu'
})
registryApp('http://localhost:8889', (location) => {
  // console.log(location.pathname)
  return location.hash === '#/tianditu'
})
