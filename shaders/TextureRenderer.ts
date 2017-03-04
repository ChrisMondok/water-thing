// renders a texture to the screen
class TextureRenderer extends Renderer {
  static vertex = 'shaders/textureVertex.glsl'
  static fragment = 'shaders/textureFragment.glsl'

  private readonly vertexBuffer: Float32Array

  constructor(game, program) {
    super(game, program)

    var gl = game.gl
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    var verts = new Float32Array([
      0, 0, 0,
      0, 1, 0,
      1, 1, 0,

      1, 1, 0,
      1, 0, 0,
      0, 0, 0
    ])

    this.vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
  }

  render (sceneRoot, camera, timestamp) {
    if (!(<any>window).debugging) return
    Renderer.prototype.render.apply(this, arguments)
    var gl = this.game.gl

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.disable(gl.DEPTH_TEST)
    gl.disable(gl.CULL_FACE)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.game.lightmap)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  draw(mode, vertBuffer, normalBuffer, numVerts) {
    throw new Error('Not implemented')
  }

}
