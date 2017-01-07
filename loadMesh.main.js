/* global Material */

(function (global) {
  global.loadMesh = loadMesh

  var promises = {}

  var loader = new window.Worker('loadMesh.worker.js')

  loader.addEventListener('message', function (message) {
    ;['log', 'info', 'warn', 'error'].forEach(function (fn) {
      if (fn in message.data) console[fn].apply(console, message.data[fn])
    })
  })

  function loadMesh (path, filename) {
    var key = [path, filename].join('/')
    if (key in promises) return promises[key]
    else {
      var promise = new Promise(function (resolve, reject) {
        function listener (message) {
          if (message.data.key !== key) return

          loader.removeEventListener('message', listener)

          if ('resolve' in message.data) {
            message.data.resolve.forEach(function (mesh) {
              mesh.material = convertToMaterial(mesh.material)
            })

            resolve(message.data.resolve)
          } else reject(message.data.reject)
        }
        loader.addEventListener('message', listener)
      })

      promises[key] = promise

      loader.postMessage({key: key, path: path, filename: filename})

      return promise
    }
  }

  function convertToMaterial (input) {
    var material = new Material()
    for (var key in input) material[key] = input[key]
    return material
  }
})(window)
