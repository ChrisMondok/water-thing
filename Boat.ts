/// <reference path="Actor.ts"/>
/// <reference path="typings/gl-matrix.d.ts"/>

declare var loadMesh: (path: string, name: string) => Promise<Mesh[]>

class Boat extends Actor {
  steeringAngle = 0
  motor = new SceneGraphNode()
  prop = new SceneGraphNode()

  private static readonly scratch = {
    up: vec3.fromValues(0, 0, 1),
    noRotation: quat.create(),
    normal: vec3.create(),
    xy: vec2.create()
  }

  constructor(game: Game, public water: Water) {
    super(game)
    vec3.set(this.scale, 15, 15, 15)
  }

  load() {
    var dinghyPromise = loadMesh('models', 'dinghy.obj').then((meshes : Mesh[]) => {
      meshes.forEach((m) => {
        var mesh = new StaticMeshComponent(m)
        vec3.set(mesh.position, 0, 0, 0.1)
        this.addComponent(mesh)
      })
    })

    vec3.set(this.motor.position, 0, -2.1, 0)

    this.addComponent(this.motor)

    var motor = this.motor
    var motorPromise = loadMesh('models', 'outboard-motor.obj').then(function (meshes) {
      meshes.forEach(function (mesh) {
        motor.addComponent(new StaticMeshComponent(mesh))
      })
    })

    vec3.set(this.prop.position, 0, -0.1, -0.8)
    this.motor.addComponent(this.prop)

    var prop = this.prop
    var propPromise = loadMesh('models', 'prop.obj').then(function (meshes) {
      meshes.forEach(function (mesh) {
        prop.addComponent(new StaticMeshComponent(mesh))
      })
    })

    return Promise.all([dinghyPromise, motorPromise, propPromise]).then(() => this)
  }

  tick() {
    Boat.scratch.xy.set(this.x, this.y)
    this.z = this.water.getZ(this.game.now, Boat.scratch.xy)

    this.water.getNormal(Boat.scratch.normal, this.game.now, Boat.scratch.xy)

    quat.rotationTo(this.rotation, Boat.scratch.up, Boat.scratch.normal)

    quat.rotateZ(this.motor.rotation, Boat.scratch.noRotation, this.steeringAngle)

    quat.rotateY(this.prop.rotation, Boat.scratch.noRotation, (this.game.now / 500) % 2 * Math.PI)
  }
}
