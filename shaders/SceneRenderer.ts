class SceneRenderer extends GeometryRenderer {
  static vertex = 'shaders/sceneVertex.glsl'
  static fragment = 'shaders/sceneFragment.glsl'

  protected readonly u_projection: WebGLUniformLocation
  protected readonly u_sun: WebGLUniformLocation
  protected readonly u_ambient_light: WebGLUniformLocation
  protected readonly u_camera: WebGLUniformLocation

  protected readonly u_mat_diffuse: WebGLUniformLocation
  protected readonly u_mat_emissive: WebGLUniformLocation
  protected readonly u_mat_specular: WebGLUniformLocation
  protected readonly u_mat_ambient: WebGLUniformLocation
  protected readonly u_mat_shininess: WebGLUniformLocation

  protected readonly u_lightmap_sampler: WebGLUniformLocation
  protected readonly u_sun_projection: WebGLUniformLocation

  protected readonly a_normal: number

  constructor (game : Game, program : WebGLProgram) {
    super(game, program)

    var gl = game.gl
    this.u_projection = notNull(gl.getUniformLocation(program, 'u_projection'))
    this.u_transform = notNull(gl.getUniformLocation(program, 'u_transform'))

    this.u_sun = notNull(gl.getUniformLocation(program, 'u_sun'))
    this.u_ambient_light = notNull(gl.getUniformLocation(program, 'u_ambient_light'))
    this.u_camera = notNull(gl.getUniformLocation(program, 'u_camera'))

    this.u_mat_diffuse = notNull(gl.getUniformLocation(program, 'u_mat_diffuse'))
    this.u_mat_emissive = notNull(gl.getUniformLocation(program, 'u_mat_emissive'))
    this.u_mat_specular = notNull(gl.getUniformLocation(program, 'u_mat_specular'))
    this.u_mat_ambient = notNull(gl.getUniformLocation(program, 'u_mat_ambient'))
    this.u_mat_shininess = notNull(gl.getUniformLocation(program, 'u_mat_shininess'))

    this.u_lightmap_sampler = notNull(gl.getUniformLocation(program, 'u_lightmap_sampler'))
    this.u_sun_projection = notNull(gl.getUniformLocation(program, 'u_sun_projection'))

    this.a_normal = notNull(gl.getAttribLocation(program, 'a_normal'))
  }

  render (camera : Camera) {
    super.render(camera)

    var gl = this.game.gl

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.enableVertexAttribArray(this.a_normal)
    gl.enableVertexAttribArray(this.a_position)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.game.lightmap)
    gl.uniform1i(this.u_lightmap_sampler, 0)

    gl.uniformMatrix4fv(this.u_projection, false, camera.getMatrix())

    gl.uniformMatrix4fv(this.u_sun_projection, false, this.game.sun.matrix)

    gl.uniform3fv(this.u_sun, this.game.sun.position)
    var ambient = 0.4
    gl.uniform3fv(this.u_ambient_light, new Float32Array([ambient, ambient, ambient]))
    gl.uniform3fv(this.u_camera, camera.position)

    this.game.sceneRoot.walk(this)

    gl.disableVertexAttribArray(this.a_normal)
    gl.disableVertexAttribArray(this.a_position)
  }

  setMaterial (material : Material) {
    super.setMaterial(material)

    var gl = this.game.gl

    gl.uniform3fv(this.u_mat_diffuse, material.diffuse)
    gl.uniform3fv(this.u_mat_emissive, material.emissive)
    gl.uniform3fv(this.u_mat_specular, material.specular)
    gl.uniform3fv(this.u_mat_ambient, material.ambient)
    gl.uniform1f(this.u_mat_shininess, material.shininess)
  }

  drawArrays (mode : number, vertBuffer : WebGLBuffer, normalBuffer : WebGLBuffer, numVerts : number) {
    var gl = this.game.gl

    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer)
    gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    gl.vertexAttribPointer(this.a_normal, 3, gl.FLOAT, false, 0, 0)

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
