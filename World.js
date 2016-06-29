/* globals SceneRenderer, LightmapRenderer, Renderer, Camera, SceneGraphNode, createTexture, TextureRenderer */

function World (canvas) {
  this.renderers = []
  this.actors = []

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

World.prototype.sceneRoot = null
World.prototype.camera = null

World.prototype.latitude = 40
World.prototype.timeOfDay = 0.6 // 0-1 => 0h-24h
World.prototype.timeScale = 1

World.prototype.createComponents = function () {
  this.camera = new Camera()
  this.sceneRoot = new SceneGraphNode()
}

;(function () {
  var origin = vec3.create()

  function computeSunIntensity (timeOfDay) {
    return 1.0
  }

  World.prototype.tick = function tick (ts) {
    ts *= this.timeScale

    vec3.set(this.sun, 0, 0, -1 * computeSunIntensity(this.timeOfDay))
    vec3.rotateX(this.sun, this.sun, origin, this.timeOfDay * Math.PI * 2)
    vec3.rotateY(this.sun, this.sun, origin, -this.latitude / 180 * Math.PI)

    for (var i = 0; i < this.actors.length; i++) {
      this.actors[i].tick(ts)
    }
    this.draw(ts)
    window.requestAnimationFrame(this._tick)
  }
})()

World.prototype.draw = function draw (ts) {
  for (var i = 0; i < this.renderers.length; i++) {
    this.renderers[i].render(this.sceneRoot, this.camera, ts)
  }
}

World.prototype.addRenderer = function (type) {
  return Renderer.create(type, this).then(function (r) {
    this.renderers.push(r)
  }.bind(this))
}
