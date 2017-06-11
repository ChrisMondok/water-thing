class RadarRenderer extends GeometryRenderer {
  static readonly vertex = "shaders/radarVertex.glsl"
  static readonly fragment = "shaders/radarFragment.glsl"

  protected readonly u_projection: WebGLUniformLocation
  protected readonly u_camera: WebGLUniformLocation
  protected readonly u_pulse_radius: WebGLUniformLocation
  protected readonly a_normal: number

  constructor (game: Game, program: WebGLProgram) {
    super(game, program)

    var gl = game.gl

    this.u_projection = notNull(gl.getUniformLocation(program, 'u_projection'))
    this.u_transform = notNull(gl.getUniformLocation(program, 'u_transform'))

    this.u_camera = notNull(gl.getUniformLocation(program, 'u_camera'))

    this.u_pulse_radius = notNull(gl.getUniformLocation(program, 'u_pulse_radius'))

    this.a_normal = notNull(gl.getAttribLocation(program, 'a_normal'))
  }

  render(camera: Camera) {
    super.render(camera)

    var gl = this.game.gl

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    gl.disable(gl.DEPTH_TEST)
    gl.disable(gl.CULL_FACE)
    gl.enable(gl.BLEND)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)

    gl.uniformMatrix4fv(this.u_projection, false, camera.getMatrix())

    gl.uniform3f(this.u_camera, camera.x, camera.y, camera.z)

    let timestamp = this.game.now

    gl.uniform1f(this.u_pulse_radius, (timestamp / 7) % 700)

    this.game.sceneRoot.walk(this)
  }

  drawArrays (mode : number, vertBuffer : WebGLBuffer, normalBuffer : WebGLBuffer, numVerts : number) {
    var gl = this.game.gl

    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer)
    gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)

    gl.drawArrays(mode, 0, numVerts)
  }

  drawElements (elementBuffer : WebGLBuffer, vertBuffer : WebGLBuffer, normalBuffer : WebGLBuffer, numElements : number) {
    var gl = this.game.gl

    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer)
    gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    gl.vertexAttribPointer(this.a_normal, 3, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer)

    gl.drawElements(gl.TRIANGLES, numElements, gl.UNSIGNED_SHORT, 0)
  }
}
