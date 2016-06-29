/* globals Actor */

function Camera (gl, program) {
  Actor.apply(this)

  this.fov = Math.degToRad(60)
  this.near = 1
  this.far = 1000

  vec3.set(this.position, 0, 50, 50)
  this.target = vec3.create()
  this.up = vec3.fromValues(0, 0, 1)
}

Camera.prototype = Object.create(Actor.prototype)

;(function () {
  Camera.prototype.getMatrix = function () {
    var matrix = mat4.create()
    mat4.lookAt(matrix, this.position, this.target, this.up)
    mat4.invert(matrix, matrix)
    mat4.multiply(matrix, perspectiveMatrix(this.fov, 4 / 3, this.near, this.far), matrix)
    return matrix
  }

  function perspectiveMatrix (fov, aspect, near, far) {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fov)

    return mat4.fromValues(
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) / (near - far), -1,
      0, 0, near * far / (near - far) * 2, 0
    )
  }
})()
