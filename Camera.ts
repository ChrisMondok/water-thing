/// <reference path="typings/gl-matrix.d.ts"/>

class Camera extends Actor {
  fov = degToRad(60)
  near = 1
  far = 1000
  target = vec3.create()
  up = vec3.fromValues(0, 0, 1)
  private matrix = mat4.create()

  private static perspectiveMatrix = mat4.create()

  constructor (game) {
    super(game)

    vec3.set(this.position, 0, 50, 50)
  }

  getMatrix() {
    var matrix = mat4.create()
    lookAt(matrix, this.position, this.target, this.up)
    mat4.invert(matrix, matrix)
    mat4.multiply(matrix, Camera.getPerspectiveMatrix(this.fov, 4 / 3, this.near, this.far), matrix)
    return matrix
  }

  private static getPerspectiveMatrix(fov, aspect, near, far) {
    var f = Math.tan((Math.PI * 0.5) - (0.5 * fov))

    mat4.set(Camera.perspectiveMatrix,
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) / (near - far), -1,
      0, 0, near * far / (near - far) * 2, 0
    )

    return Camera.perspectiveMatrix
  }
}
