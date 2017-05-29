/// <reference path="Game.ts"/>
/// <reference path="Material.ts"/>

class DemoGame extends Game{
  water: Water
  private visitedMaterials: Material[]

  createComponents () {
    super.createComponents()

    new Editors.EnvironmentEditor(this)

    var water = this.water = new Water()

    var pws = new PointWaveSource(this, water)
    pws.x = 200
    pws.y = 50
    pws.period = 3
    pws.amplitude = 10
    water.waveSources.push(pws)

    pws = new PointWaveSource(this, water)
    pws.x = -50
    pws.y = -100
    pws.period = 2
    water.waveSources.push(pws)

    new Editors.WaterEditor(water)

    var waterSurface = new WaterSurface(this, water, 32)
    vec3.set(waterSurface.scale, 512, 512, 512)
    this.sceneRoot.addComponent(waterSurface)
    this.actors.push(waterSurface)

    Heightmap.fromImage(this, new SandMaterial(), 'heightmaps/test.png', 0.3).then(hm => {
      this.sceneRoot.addComponent(hm)
      vec3.set(hm.scale, 2048, 2048, 2048)
      vec3.set(hm.position, -512, 0, 0)
    })

    Promise.all([this.spawnBoat(), this.spawnBuoy()]).then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 1000)
      })
    }).then(() => {
      this.addMaterialEditorsForNodeAndChildren(this.sceneRoot)
    })

    this.visitedMaterials = []
  }

  tick (ts: number) {
    super.tick(ts)
    var angle = ts / 10000
    vec3.set(this.camera.position, Math.sin(angle) * 200, Math.cos(angle) * 200, Math.sin(ts / 7000) * 50 + 75)
  }

  private spawnBoat() {
    var boat = new Boat(this, this.water)
    return boat.ready.then((boat) => {
      this.actors.push(boat)
      this.sceneRoot.addComponent(boat)
    }, function (e) {
      console.error(e)
    })
  }

  private spawnBuoy() {
    var buoy = new Buoy(this, this.water)

    buoy.ready.then((buoy) => {
      buoy.x = 100

      this.actors.push(buoy)
      this.sceneRoot.addComponent(buoy)
    })
  }

  private addMaterialEditorsForNodeAndChildren (component: any)  {
    if (component.material instanceof Material &&
      this.visitedMaterials.indexOf(component.material) === -1) {
      this.visitedMaterials.push(component.material)
      new Editors.MaterialEditor(component.material)
    }

    component.components.forEach(this.addMaterialEditorsForNodeAndChildren, this)
  }
}

class SandMaterial extends Material {
  name = 'Sand'
  diffuse = new Float32Array([0.78, 0.65, 0.47])
  emissive = new Float32Array([0, 0, 0])
  ambient = new Float32Array([1, 1, 1])
  specular = new Float32Array([0.4, 0.4, 0.4])
  shininess = 4
}
