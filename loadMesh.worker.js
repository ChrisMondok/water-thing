/* globals self, loadMesh */
if (!('console' in self)) {
  self.console = self.console || makeProxyConsole()
}

self.importScripts('loadMtl.js', 'loadMesh.js', 'Material.js', 'lib/promise-polyfill/promise.min.js', 'lib/fetch/fetch.js')

self.addEventListener('message', function (message) {
  self.console.log('going to load %s', message.data.key)
  loadMesh(message.data.path, message.data.filename).then(function (response) {
    self.postMessage({key: message.data.key, resolve: response})
  }, function (error) {
    self.postMessage({key: message.data.key, reject: error})
  })
})

function makeProxyConsole () {
  var console = {}
  ;['log', 'info', 'warn', 'error'].forEach(function (fn) {
    console[fn] = function () {
      var message = {}
      message[fn] = Array.prototype.slice.apply(arguments)
      self.postMessage(message)
    }
  })
  return console
}
