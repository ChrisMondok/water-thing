/// <reference path="Sun.ts"/>

class Game {
  renderers: Renderer[] = []
  actors: Actor[] = []
  sceneRoot: SceneGraphNode

  origin = vec3.create()
  sun: Sun

  gl: WebGLRenderingContext

  camera: Camera

  latitude = 40
  timeOfDay = 0.6 // 0-1 => 0h-24h
  timeScale = 1

  now = 0
  dt = 0

  lightmap: WebGLTextureWithDimensions

  ready: Promise<void>

  private _tick: FrameRequestCallback

  private lastTs = 0

  constructor (canvas: HTMLCanvasElement) {
    let context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    let gl = this.gl = (window as any).gl = (context) as WebGLRenderingContext

    let tick = this._tick = this.tick.bind(this)

    this.createComponents()

    let size = Math.min(2048, gl.MAX_RENDERBUFFER_SIZE, gl.MAX_VIEWPORT_DIMS)
    this.lightmap = createTexture(this.gl, size, size)

    this.ready = this.addRenderer(LightmapRenderer)
      .then(this.addRenderer.bind(this, SceneRenderer))
      .then(this.addRenderer.bind(this, TextureRenderer))
      .then(function () {
        window.requestAnimationFrame(tick)
      }, function (error: any) {
        console.error(error)
      })
  }

  createComponents() {
    this.camera = new Camera(this)
    this.sceneRoot = new SceneGraphNode()
    this.sun = new Sun(this)
    this.actors.push(this.sun)
    this.sceneRoot.addComponent(this.sun)
  }

  tick(ts: number) {
    this.dt = this.timeScale * (ts - this.lastTs)
    this.now += this.dt

    for (let i = 0; i < this.actors.length; i++) {
      this.actors[i].tick()
    }

    this.draw()

    this.lastTs = ts

    window.requestAnimationFrame(this._tick)
  }

  draw() {
    for (let i = 0; i < this.renderers.length; i++) {
      this.renderers[i].render(this.camera)
    }
  }

  private addRenderer<TType extends Renderer, TCtor extends RendererType<TType>> (type: TCtor) {
    return Renderer.create(type, this).then(function (r: Renderer) {
      this.renderers.push(r)
    }.bind(this))
  }
}
