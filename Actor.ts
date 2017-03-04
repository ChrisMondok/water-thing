/// <reference path="SceneGraphNode.ts"/>

class Actor extends SceneGraphNode{
  constructor(public game: Game) {
    super()
  }

  tick() {}

  get x() { return this.position[0] }
  set x(x) { this.position[0] = x }

  get y() { return this.position[1] }
  set y(x) { this.position[1] = x }

  get z() { return this.position[2] }
  set z(x) { this.position[2] = x }
}
