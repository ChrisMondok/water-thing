/// <reference path="Actor.ts"/>

class Sun extends Actor {
  readonly matrix = mat4.create()

  private readonly orthoMatrix = mat4.create()
  private readonly up = vec3.create()

  constructor (game: Game, public lightCubeSize = 512) {
    super(game)
  }

  tick() {
    super.tick()
    this.updateRay()
    this.updateMatrix()
  }

  private updateRay() {
    vec3.set(this.position, 0, 0, -1)
    vec3.rotateX(this.position, this.position, this.game.origin, this.game.timeOfDay * Math.PI * 2)
    vec3.rotateY(this.position, this.position, this.game.origin, -this.game.latitude / 180 * Math.PI)
    vec3.normalize(this.position, this.position)
  }

  private updateMatrix() {
    lookAt(this.matrix, this.position, this.game.origin, getUpVector(this.up, this.position))

    mat4.invert(this.matrix, this.matrix)

    orthoMatrix(this.orthoMatrix, this.lightCubeSize)

    mat4.multiply(this.matrix, this.orthoMatrix, this.matrix)
  }

  readonly ray = vec3.create()
}
