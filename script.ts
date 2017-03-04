window.addEventListener('load', start)

function start () {
  var canvas = notNull(document.querySelector('canvas'))

  var game = (<any>window).game = new DemoGame(canvas)

  game.ready.then(function () {
    console.log('GAME READY')
  }, function(e) {
    console.error('Something broke: %O', e)
  })
}
