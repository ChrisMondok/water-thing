class LightmapRenderer extends GeometryRenderer {
  static readonly vertex = 'shaders/lightmapVertex.glsl'
  static readonly fragment = 'shaders/lightmapFragment.glsl'

  u_projection: WebGLUniformLocation
  framebuffer: WebGLFramebuffer

  constructor (game : Game, program : WebGLProgram) {
    super(game, program)

    this.u_projection = notNull(this.game.gl.getUniformLocation(program, 'u_projection'))
    this.u_transform = notNull(this.game.gl.getUniformLocation(program, 'u_transform'))

    this.framebuffer = createFramebuffer(game.gl, game.lightmap, game.lightmap.width, game.lightmap.height)
    this.game.gl.bindFramebuffer(this.game.gl.FRAMEBUFFER, null)
  }

  render (camera : Camera) {
    super.render(camera)
    var gl = this.game.gl

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    gl.viewport(0, 0, this.game.lightmap.width, this.game.lightmap.height)

    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.uniformMatrix4fv(this.u_projection, false, this.lightMatrix)

    this.game.sceneRoot.walk(this)
  }

  draw (mode : number, vertBuffer : WebGLBuffer, normalBuffer : WebGLBuffer, numVerts : number) {
    var gl = this.game.gl

    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer)
    gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0)

    gl.drawArrays(mode, 0, numVerts)
  }

}
