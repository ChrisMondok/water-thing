// There should be a 1:1 relationship between renderers and programs.
// Perhaps this is a poor name.

interface RendererType<T extends Renderer> {
  vertex: string
  fragment: string
  new (game: Game, program: WebGLProgram): T
}

abstract class Renderer {
  protected readonly a_position: number

  protected readonly transformMatrix = mat4.identity(mat4.create())

  constructor (protected game : Game, protected program: WebGLProgram) {
    this.a_position = game.gl.getAttribLocation(program, 'a_position')
    game.gl.enableVertexAttribArray(this.a_position)
  }

  render (camera : Camera) {
    this.game.gl.useProgram(this.program)
  }

  setMaterial (material : Material) {
    if (!material.isComplete()) throw new Error('Material is incomplete!')
  }

  static create<T extends Renderer>(type : RendererType<T>, game : Game) : Promise<T> {
    var gl = game.gl
    return Promise.all([
      getShader(gl, type.vertex, gl.VERTEX_SHADER),
      getShader(gl, type.fragment, gl.FRAGMENT_SHADER)
    ]).then(function (shaders) {
      var program = notNull(gl.createProgram())
      shaders.forEach(function (shader) {
        gl.attachShader(program, shader)
      })
      return program
    }).then(function (program) {
      gl.linkProgram(program)
      return program
    }).then(function (program) {
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('Error in program: ' + gl.getProgramInfoLog(program))
      }
      return program
    }).then((program) => new type(game, program) as Renderer)

    function getShader (gl : WebGLRenderingContext, url : string, type : number) {
      return fetch(url)
        .then(function (response) { return response.text() })
        .then(function (glsl) {
          var shader = gl.createShader(type)
          gl.shaderSource(shader, glsl)
          gl.compileShader(shader)

          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error('Error in shader ' + url + ': ' + gl.getShaderInfoLog(shader))
          }

          return shader
        })
    }
  }
}

abstract class GeometryRenderer extends Renderer {
  protected u_transform: WebGLUniformLocation

  abstract drawArrays (mode : number, vertBuffer : WebGLBuffer, normalBuffer : WebGLBuffer, numVerts : number): void
  abstract drawElements (elementBuffer: WebGLBuffer, vertBuffer : WebGLBuffer, normalBuffer : WebGLBuffer, numVerts : number): void

  transform (transform : Float32Array) {
    mat4.multiply(this.transformMatrix, this.transformMatrix, transform)
    this.game.gl.uniformMatrix4fv(this.u_transform, false, this.transformMatrix)
  }
}
