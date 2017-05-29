// renders a texture to the screen
class TextureRenderer extends Renderer {
  static vertex = 'shaders/textureVertex.glsl'
  static fragment = 'shaders/textureFragment.glsl'

  private readonly vertexBuffer: WebGLBuffer

  constructor(game : Game, program : WebGLProgram) {
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

    this.vertexBuffer = notNull(gl.createBuffer())
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
  }

  render (camera : Camera) {
    if (!(<any>window).debugging) return
    super.render(camera)
    var gl = this.game.gl

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.disable(gl.DEPTH_TEST)
    gl.disable(gl.CULL_FACE)

    gl.enableVertexAttribArray(this.a_position)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.game.lightmap)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  draw(mode : number, vertBuffer : WebGLBuffer, normalBuffer : WebGLBuffer, numVerts : number) {
    throw new Error('Not implemented')
  }
}
