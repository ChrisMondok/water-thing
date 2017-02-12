/* globals DemoGame */

window.addEventListener('load', start)

function start () {
  var canvas = document.querySelector('canvas')

  var game = window.game = new DemoGame(canvas)

  game.ready.then(function () {
    console.log('GAME READY')
  })
}
