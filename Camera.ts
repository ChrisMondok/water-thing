/// <reference path="typings/gl-matrix.d.ts"/>

class Camera extends Actor {
  fov = degToRad(60)
  near = 1
  far = 1000
  target = vec3.create()
  up = vec3.fromValues(0, 0, 1)
  aspectRatio = 4 / 3
  private matrix = mat4.create()

  private static perspectiveMatrix = mat4.create()

  constructor (game: Game) {
    super(game)

    vec3.set(this.position, 0, 50, 50)
  }

  getMatrix() {
    var matrix = mat4.create()
    lookAt(matrix, this.position, this.target, this.up)
    mat4.invert(matrix, matrix)
    mat4.multiply(matrix, this.getPerspectiveMatrix(), matrix)
    return matrix
  }

  private getPerspectiveMatrix() {
    var f = Math.tan((Math.PI * 0.5) - (0.5 * this.fov))

    mat4.set(Camera.perspectiveMatrix,
      f / this.aspectRatio, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (this.near + this.far) / (this.near - this.far), -1,
      0, 0, this.near * this.far / (this.near - this.far) * 2, 0
    )

    return Camera.perspectiveMatrix
  }
}
