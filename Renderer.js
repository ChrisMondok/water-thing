/* globals http */

// There should be a 1:1 relationship between renderers and programs.
// Perhaps this is a poor name.
function Renderer (world, program) {
  this.world = world
  this.program = program

  this.a_position = world.gl.getAttribLocation(program, 'a_position')
  world.gl.enableVertexAttribArray(this.a_position)

  this.transformMatrix = mat4.identity(mat4.create())

  this.lightMatrix = mat4.create()
}

(function () {
  var nSun = vec3.create()

  Renderer.prototype.render = function (sceneRoot, camera, timestamp) {
    this.world.gl.useProgram(this.program)

    vec3.normalize(nSun, this.world.sun)

    mat4.lookAt(this.lightMatrix, nSun, camera.target, getUpVector(nSun))

    mat4.invert(this.lightMatrix, this.lightMatrix)

    mat4.multiply(this.lightMatrix, getOrthoMatrix(vec3.distance(camera.target, camera.position) * 2), this.lightMatrix)
  }

  var orthoMatrix = mat4.create()
  function getOrthoMatrix (width, height, depth) {
    if (height === undefined && depth === undefined) height = depth = width

    mat4.set(orthoMatrix,
      2 / width, 0, 0, 0,
      0, 2 / height, 0, 0,
      0, 0, -2 / depth, 0,
      0, 0, 0, 1
    )

    return orthoMatrix
  }

  var upVector = vec3.create()
  function getUpVector (lookVector) {
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

Renderer.prototype.transform = function (transform) {
  mat4.multiply(this.transformMatrix, this.transformMatrix, transform)
  this.world.gl.uniformMatrix4fv(this.u_transform, false, this.transformMatrix)
}

Renderer.prototype.setMaterial = function (material) {
  if (!material.isComplete()) throw new Error('Material is incomplete!')
}

Renderer.prototype.draw = function (mode, vertBuffer, normalBuffer, numVerts) {
  throw new Error('Override me')
}

Renderer.create = function (type, world) {
  var gl = world.gl
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
    return new TypeWithACapitalTToMakeStandardHappy(world, program)
  })

  function getShader (gl, url, type) {
    return http.get(url).then(function (glsl) {
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
