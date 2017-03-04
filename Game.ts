/* globals SceneRenderer, LightmapRenderer, Renderer, Camera, SceneGraphNode, createTexture, TextureRenderer */

class Game {
  renderers = []
  actors: Actor[] = []
  sceneRoot: SceneGraphNode = null

  origin = vec3.create()
  sun = vec3.create()

  gl: WebGLRenderingContext

  camera = null

  latitude = 40
  timeOfDay = 0.6 // 0-1 => 0h-24h
  timeScale = 1

  now = 0
  dt = 0

  lightmap: WebGLTextureWithDimensions

  ready: Promise<void>

  private _tick: FrameRequestCallback

  private lastTs = 0

  constructor (canvas : HTMLCanvasElement) {
    var gl = this.gl = (<any>window).gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

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

  createComponents() {
    this.camera = new Camera(this)
    this.sceneRoot = new SceneGraphNode()
  }

  tick(ts) {
    this.dt = this.timeScale * (ts - this.lastTs)
    this.now += this.dt

    this.updateSun()

    for (var i = 0; i < this.actors.length; i++) {
      this.actors[i].tick()
    }

    this.draw()

    this.lastTs = ts

    window.requestAnimationFrame(this._tick)
  }

  draw() {
    for (var i = 0; i < this.renderers.length; i++) {
      this.renderers[i].render(this.sceneRoot, this.camera, this.now)
    }
  }

  addRenderer = function (type) {
    return Renderer.create(type, this).then(function (r) {
      this.renderers.push(r)
    }.bind(this))
  }

  private updateSun() {
    function computeSunIntensity (timeOfDay) {
      return 1.0
    }

    vec3.set(this.sun, 0, 0, -1 * computeSunIntensity(this.timeOfDay))
    vec3.rotateX(this.sun, this.sun, this.origin, this.timeOfDay * Math.PI * 2)
    vec3.rotateY(this.sun, this.sun, this.origin, -this.latitude / 180 * Math.PI)
  }
}
