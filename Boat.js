/* global Actor, loadMesh, SceneGraphNode, StaticMeshComponent */

function Boat (game, water) {
  Actor.call(this, game)

  this.water = water

  vec3.set(this.scale, 15, 15, 15)
}

Boat.prototype = Object.create(Actor.prototype)
Boat.prototype.constructor = Boat

Boat.prototype.steeringAngle = 0

Boat.prototype.load = function () {
  var dinghyPromise = loadMesh('models', 'dinghy.obj').then(function (meshes) {
    meshes.forEach(function (m) {
      var mesh = new StaticMeshComponent(m)
      vec3.set(mesh.position, 0, 0, 0.1)
      this.addComponent(mesh)
    }, this)
  }.bind(this))

  var motor = this.motor = new SceneGraphNode()

  vec3.set(motor.position, 0, -2.1, 0)

  this.addComponent(motor)

  var motorPromise = loadMesh('models', 'outboard-motor.obj').then(function (meshes) {
    meshes.forEach(function (mesh) {
      motor.addComponent(new StaticMeshComponent(mesh))
    })
  })

  var prop = this.prop = new SceneGraphNode()
  vec3.set(prop.position, 0, -0.1, -0.8)
  motor.addComponent(prop)

  var propPromise = loadMesh('models', 'prop.obj').then(function (meshes) {
    meshes.forEach(function (mesh) {
      prop.addComponent(new StaticMeshComponent(mesh))
    }, this)
  }.bind(this))

  return Promise.all([dinghyPromise, motorPromise, propPromise])
}

;(function () {
  var up = vec3.fromValues(0, 0, 1)

  var noRotation = quat.create()

  var normal = vec3.create()
  Boat.prototype.tick = function () {
    var xy = [this.x, this.y]
    this.z = this.water.getZ(this.game.now, xy)

    this.water.getNormal(normal, this.game.now, xy)

    quat.rotationTo(this.rotation, up, normal)

    quat.rotateZ(this.motor.rotation, noRotation, this.steeringAngle)

    quat.rotateY(this.prop.rotation, noRotation, (this.game.now / 500) % 2 * Math.PI)
  }
})()
