/* globals Renderer, createFramebuffer */

function LightmapRenderer (game, program) {
  Renderer.apply(this, arguments)

  this.u_projection = this.game.gl.getUniformLocation(program, 'u_projection')
  this.u_transform = this.game.gl.getUniformLocation(program, 'u_transform')

  this.framebuffer = createFramebuffer(game.gl, game.lightmap, game.lightmap.width, game.lightmap.height)
  this.game.gl.bindFramebuffer(this.game.gl.FRAMEBUFFER, null)
}

LightmapRenderer.prototype = Object.create(Renderer.prototype)
LightmapRenderer.constructor = LightmapRenderer

LightmapRenderer.prototype.render = function (sceneRoot, camera, timestamp) {
  Renderer.prototype.render.apply(this, arguments)
  var gl = this.game.gl

  gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
  gl.viewport(0, 0, this.game.lightmap.width, this.game.lightmap.height)

  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.uniformMatrix4fv(this.u_projection, false, this.lightMatrix)

  sceneRoot.walk(this, timestamp)
}

LightmapRenderer.prototype.draw = function (mode, vertBuffer, normalBuffer, numVerts) {
  var gl = this.game.gl

  gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer)
  gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0)

  gl.drawArrays(mode, 0, numVerts)
}

LightmapRenderer.vertex = 'shaders/lightmapVertex.glsl'
LightmapRenderer.fragment = 'shaders/lightmapFragment.glsl'
