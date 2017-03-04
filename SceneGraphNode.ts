class SceneGraphNode {
  components: SceneGraphNode[] = []
  position = vec3.create()
  rotation = quat.create()
  scale = vec3.fromValues(1, 1, 1)
  transformMatrix = mat4.create()
  ready = Promise.resolve().then(this.load.bind(this))

  protected inverseTransformMatrix = mat4.create()

  load() {
    return new Promise(function (resolve, reject) {
      resolve()
    })
  }

  walk(renderer, timestamp) {
    this.updateTransformMatrix()
    renderer.transform(this.transformMatrix)

    this.draw(renderer, timestamp)
    for (var i = 0; i < this.components.length; i++) {
      this.components[i].walk(renderer, timestamp)
    }

    renderer.transform(this.inverseTransformMatrix)
  }

  draw(renderer, timestamp) {}

  addComponent(c) {
    this.components.push(c)
  }

  updateTransformMatrix() {
    mat4.fromRotationTranslationScale(this.transformMatrix, this.rotation, this.position, this.scale)
    mat4.invert(this.inverseTransformMatrix, this.transformMatrix)
  }
}
