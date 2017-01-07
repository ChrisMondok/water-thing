/* globals self */

var global = typeof window === 'undefined' ? self : window

global.http = {
  get: function (url) {
    return new Promise(function (resolve, reject) {
      var req = new XMLHttpRequest(url)
      req.open('GET', url, true)
      req.addEventListener('load', function (loadEvent) {
        resolve(loadEvent.target.response)
      })
      req.addEventListener('error', function (e) {
        reject(e)
      })
      req.send()
    })
  }
}
