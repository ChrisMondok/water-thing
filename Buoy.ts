/// <reference path="Actor.ts"/>

class Buoy extends Actor {
  period = 2000
  phase = 0
  private lampMaterial: Material

  private static readonly scratch = {
    up: vec3.fromValues(0, 0, 1),
    normal: vec3.create(),
    xy: vec2.create()
  }

  constructor (game: Game, private water: Water) {
    super(game)
    vec3.set(this.scale, 15, 15, 15)
  }

  load() {
    return loadMesh('models', 'buoy.obj').then((meshes) => {
      this.lampMaterial = meshes.map(function (m) { return m.material })
        .filter(function (mat) { return mat.name === 'Lamp' })[0]
        .clone()

      meshes.forEach(function (m) {
        if (m.name === 'Lamp_Cone') {
          m = Object.create(m)
          m.material = this.lampMaterial
        }
        var mesh = new StaticMeshComponent(this.game.gl, m)
        vec3.set(mesh.position, 0, 0, 0.1)
        this.addComponent(mesh)
      }, this)
    }).then(() => {
      return this
    })
  }

  tick() {
    vec2.set(Buoy.scratch.xy, this.x, this.y)
    this.z = this.water.getZ(this.game.now, Buoy.scratch.xy)
    this.water.getNormal(Buoy.scratch.normal, this.game.now, Buoy.scratch.xy)
    quat.rotationTo(this.rotation, Buoy.scratch.up, Buoy.scratch.normal)
    this.updateLampMaterial()
  }

  updateLampMaterial() {
    var l = ((this.game.now / this.period) + this.phase) % 1 < 0.25 ? 1 : 0
    this.lampMaterial.emissive[0] = l * 1
    this.lampMaterial.emissive[1] = l * 0
    this.lampMaterial.emissive[2] = l * 0
  }
}
