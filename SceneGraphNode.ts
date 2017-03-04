class SceneGraphNode {
  components: SceneGraphNode[] = []
  position = vec3.create()
  rotation = quat.create()
  scale = vec3.fromValues(1, 1, 1)
  transformMatrix = mat4.create()
  ready = Promise.resolve().then(() => this.load())

  protected inverseTransformMatrix = mat4.create()

  load() : Promise<this> {
    return new Promise(function (resolve, reject) {
      resolve(this)
    })
  }

  walk(renderer : GeometryRenderer) {
    this.updateTransformMatrix()
    renderer.transform(this.transformMatrix)

    this.draw(renderer)
    for (var i = 0; i < this.components.length; i++) {
      this.components[i].walk(renderer)
    }

    renderer.transform(this.inverseTransformMatrix)
  }

  draw(renderer : Renderer) {}

  addComponent(c : SceneGraphNode) {
    this.components.push(c)
  }

  updateTransformMatrix() {
    mat4.fromRotationTranslationScale(this.transformMatrix, this.rotation, this.position, this.scale)
    mat4.invert(this.inverseTransformMatrix, this.transformMatrix)
  }
}
