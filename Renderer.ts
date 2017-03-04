// There should be a 1:1 relationship between renderers and programs.
// Perhaps this is a poor name.
abstract class Renderer {
  protected readonly a_position: number
  protected u_transform: WebGLUniformLocation // TODO: push down
  protected readonly lightMatrix = mat4.create()

  protected readonly transformMatrix = mat4.identity(mat4.create())

  private static scratch = {
    nSun: vec3.create(),
    orthoMatrix: mat4.create()
  }

  constructor (protected game : Game, protected program: WebGLProgram) {
    this.a_position = game.gl.getAttribLocation(program, 'a_position')
    game.gl.enableVertexAttribArray(this.a_position)
  }


  render (sceneRoot, camera, timestamp) {
    this.game.gl.useProgram(this.program)

    vec3.normalize(Renderer.scratch.nSun, this.game.sun)

    lookAt(this.lightMatrix, Renderer.scratch.nSun, camera.target, Renderer.getUpVector(Renderer.scratch.nSun))

    mat4.invert(this.lightMatrix, this.lightMatrix)

    mat4.multiply(this.lightMatrix, Renderer.getOrthoMatrix(vec3.distance(camera.target, camera.position) * 2), this.lightMatrix)
  }

  private static getOrthoMatrix (width, height = undefined, depth = undefined) {
    if (height === undefined && depth === undefined) height = depth = width

    mat4.set(Renderer.scratch.orthoMatrix,
      2 / width, 0, 0, 0,
      0, 2 / height, 0, 0,
      0, 0, -2 / depth, 0,
      0, 0, 0, 1
    )

    return Renderer.scratch.orthoMatrix
  }

  protected static getUpVector = (function() {
    const upVector = vec3.create()
    return function getUpVector (lookVector) {
      var declination = Math.asin(lookVector[2])

      var xyAngle = Math.PI + Math.atan2(lookVector[1], lookVector[0])

      vec3.set(upVector,
        Math.cos(xyAngle) * Math.sin(declination),
        Math.sin(xyAngle) * Math.sin(declination),
        Math.cos(declination)
      )

      return upVector
    }
  })()

  // TODO: push down
  transform (transform) {
    mat4.multiply(this.transformMatrix, this.transformMatrix, transform)
    this.game.gl.uniformMatrix4fv(this.u_transform, false, this.transformMatrix)
  }

  setMaterial (material) {
    if (!material.isComplete()) throw new Error('Material is incomplete!')
  }

  // TODO: push down
  abstract draw (mode, vertBuffer, normalBuffer, numVerts)

  static create = function (type, game) {
    var gl = game.gl
    return Promise.all([
      getShader(gl, type.vertex, gl.VERTEX_SHADER),
      getShader(gl, type.fragment, gl.FRAGMENT_SHADER)
    ]).then(function (shaders) {
      var program = gl.createProgram()
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
    }).then(function (program) {
      var TypeWithACapitalTToMakeStandardHappy = type
      return new TypeWithACapitalTToMakeStandardHappy(game, program)
    })

    function getShader (gl, url, type) {
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
