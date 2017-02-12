/* globals SceneRenderer, LightmapRenderer, Renderer, Camera, SceneGraphNode, createTexture, TextureRenderer */

function Game (canvas) {
  this.renderers = []
  this.actors = []

  this.origin = vec3.create()

  this.sun = vec3.create()

  var gl = this.gl = window.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

  var tick = this._tick = this.tick.bind(this)

  this.createComponents()

  var size = Math.min(2048, gl.MAX_RENDERBUFFER_SIZE, gl.MAX_VIEWPORT_DIMS)
  this.lightmap = createTexture(this.gl, size, size)

  this.ready = this.addRenderer(LightmapRenderer)
    .then(this.addRenderer.bind(this, SceneRenderer))
    .then(this.addRenderer.bind(this, TextureRenderer))
    .then(function () {
      window.requestAnimationFrame(tick)
    }, function (error) {
      console.error(error)
    })
}

Game.prototype.sceneRoot = null
Game.prototype.camera = null

Game.prototype.latitude = 40
Game.prototype.timeOfDay = 0.6 // 0-1 => 0h-24h
Game.prototype.timeScale = 1

Game.prototype.now = 0
Game.prototype.dt = 0

Game.prototype.createComponents = function () {
  this.camera = new Camera()
  this.sceneRoot = new SceneGraphNode()
}

;(function () {
  var lastTs = 0
  Game.prototype.tick = function tick (ts) {
    this.dt = this.timeScale * (ts - lastTs)
    this.now += this.dt

    this._updateSun()

    for (var i = 0; i < this.actors.length; i++) {
      this.actors[i].tick()
    }

    this.draw()

    lastTs = ts

    window.requestAnimationFrame(this._tick)
  }
})()

Game.prototype._updateSun = function () {
  function computeSunIntensity (timeOfDay) {
    return 1.0
  }

  vec3.set(this.sun, 0, 0, -1 * computeSunIntensity(this.timeOfDay))
  vec3.rotateX(this.sun, this.sun, this.origin, this.timeOfDay * Math.PI * 2)
  vec3.rotateY(this.sun, this.sun, this.origin, -this.latitude / 180 * Math.PI)
}

Game.prototype.draw = function draw () {
  for (var i = 0; i < this.renderers.length; i++) {
    this.renderers[i].render(this.sceneRoot, this.camera, this.now)
  }
}

Game.prototype.addRenderer = function (type) {
  return Renderer.create(type, this).then(function (r) {
    this.renderers.push(r)
  }.bind(this))
}
