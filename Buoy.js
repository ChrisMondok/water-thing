/* globals Actor, StaticMeshComponent, loadMesh */

function Buoy (gl, water) {
  Actor.apply(this)

  this.water = water

  vec3.set(this.scale, 15, 15, 15)
}

Buoy.meshes = null

Buoy.prototype = Object.create(Actor.prototype)
Buoy.prototype.constructor = Buoy

Buoy.prototype.period = 2000
Buoy.prototype.phase = 0

Buoy.prototype.load = function () {
  return loadMesh('models', 'buoy.obj').then(function (meshes) {
    this.lampMaterial = meshes.map(function (m) { return m.material })
      .filter(function (mat) { return mat.name === 'Lamp' })[0]
      .clone()

    meshes.forEach(function (m) {
      if (isLampMesh(m)) {
        m = Object.create(m)
        m.material = this.lampMaterial
      }
      var mesh = new StaticMeshComponent(m)
      vec3.set(mesh.position, 0, 0, 0.1)
      this.addComponent(mesh)
    }, this)

    meshes.filter(isLampMesh).forEach(function (m) {}, this)
  }.bind(this)).then(function () {
    return this
  }.bind(this))

  function isLampMesh (mesh) {
    return mesh.name === 'Lamp_Cone'
  }
}

;(function () {
  var up = vec3.fromValues(0, 0, 1)
  var normal = vec3.create()
  Buoy.prototype.tick = function (timestamp) {
    var xy = [this.x, this.y]
    this.z = this.water.getZ(timestamp, xy)
    this.water.getNormal(normal, timestamp, xy)
    quat.rotationTo(this.rotation, up, normal)
    this.updateLampMaterial(timestamp)
  }
})()

Buoy.prototype.updateLampMaterial = function (timestamp) {
  var l = (timestamp / this.period + this.phase) % 1 < 0.25 ? 1 : 0
  this.lampMaterial.emissive[0] = l * 1
  this.lampMaterial.emissive[1] = l * 0
  this.lampMaterial.emissive[2] = l * 0
}
