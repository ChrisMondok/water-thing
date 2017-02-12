/* global SceneGraphNode */

function Actor (game) {
  this.game = game
  SceneGraphNode.apply(this)
}

Actor.prototype = Object.create(SceneGraphNode.prototype)

Actor.prototype.tick = function () {}

Object.defineProperty(Actor.prototype, 'x', {
  get: function () { return this.position[0] },
  set: function (x) { return (this.position[0] = x) }
})

Object.defineProperty(Actor.prototype, 'y', {
  get: function () { return this.position[1] },
  set: function (y) { return (this.position[1] = y) }
})

Object.defineProperty(Actor.prototype, 'z', {
  get: function () { return this.position[2] },
  set: function (z) { return (this.position[2] = z) }
})
