import AopYJS from '../aop/index'

// const HIJACK_EVENTS_NAME = /^(hashchange|popstate)$/i
// const EVENTS_POOL = {
//   hashchange: [],
//   popstate: [],
// }
// const listenerAop = new AopYJS()
// listenerAop.$before('addEventListener', function (eventName: string, handler) {
//   if (
//     eventName &&
//     HIJACK_EVENTS_NAME.test(eventName) &&
//     typeof handler === 'function'
//   ) {
//     EVENTS_POOL[eventName].indexOf(handler) === -1 &&
//       EVENTS_POOL[eventName].push(handler)
//   }
// })
// listenerAop.$before(
//   'removeEventListener',
//   function (eventName: string, handler) {
//     if (eventName && HIJACK_EVENTS_NAME.test(eventName)) {
//       let eventsList = EVENTS_POOL[eventName]
//       eventsList.indexOf(handler) > -1 &&
//         (EVENTS_POOL[eventName] = eventsList.filter((fn) => fn !== handler))
//     }
//   }
// )

// function mockPopStateEvent(state) {
//   console.log(state)
//   return new PopStateEvent('popstate', { state })
// }

// 拦截history的方法，因为pushState和replaceState方法并不会触发onpopstate事件，所以我们即便在onpopstate时执行了reroute方法，也要在这里执行下reroute方法。

const historyAop = new AopYJS(history)
historyAop.$after('pushState', function (state) {
  reroute(new PopStateEvent('pushState', { state }))
})
historyAop.$after('replaceState', function (state) {
  reroute(new PopStateEvent('popstate', { state }))
})

window.addEventListener('popstate', reroute)
window.addEventListener('hashchange', reroute)
// 再执行完load、mount、unmout操作后，执行此函数，就可以保证微前端的逻辑总是第一个执行。然后App中的Vue或React相关Router就可以收到Location的事件了。
// export function callCapturedEvents(eventArgs) {
//   if (!eventArgs) {
//     return
//   }
//   if (!Array.isArray(eventArgs)) {
//     eventArgs = [eventArgs]
//   }
//   let name = eventArgs[0].type
//   if (!HIJACK_EVENTS_NAME.test(name)) {
//     return
//   }
//   EVENTS_POOL[name].forEach((handler) => handler.apply(window, eventArgs))
// }
const root = document.querySelector('#root')
function reroute(e) {
  // console.log('path', location.pathname)
  // console.log('reroute', e)
  loadApp(root)
}

//---------------------------------------------------------------------------------------
const Apps = [] //子应用队列
export function registryApp(entry, activeRule) {
  Apps.push({
    entry,
    activeRule,
  })
}

export function loadApp(container: Element) {
  const [{ entry }] = Apps.filter(shouldBeActive)
  fetch(entry)
    .then(function (response) {
      return response.text()
    })
    .then(function (myJson) {
      if (!container.shadowRoot) {
        const root = container.attachShadow({ mode: 'open' })
        root.innerHTML = myJson
      } else {
        container.shadowRoot.innerHTML = myJson
      }
    })
}

export function shouldBeActive(app) {
  return app.activeRule(window.location)
}

window.onload = function () {
  history.pushState(null, '', location.pathname)
}
