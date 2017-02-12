/* globals Game, Water, WaterSurface, PointWaveSource, Buoy, Boat, Editors, Material */

function DemoGame () {
  Game.apply(this, arguments)
}

DemoGame.prototype = Object.create(Game.prototype)
DemoGame.prototype.constructor = DemoGame

DemoGame.prototype.createComponents = function () {
  Game.prototype.createComponents.apply(this, arguments)

  var editors = []

  editors.push(new Editors.EnvironmentEditor(this))

  var water = window.water = new Water()

  var pws = new PointWaveSource(water)
  pws.x = 200
  pws.y = 50
  pws.period = 3
  pws.amplitude = 10
  water.waveSources.push(pws)

  pws = new PointWaveSource(water)
  pws.x = -50
  pws.y = -100
  pws.period = 2
  water.waveSources.push(pws)

  editors.push(new Editors.WaterEditor(water))

  var waterSurface = window.waterSurface = new WaterSurface(this, water, 512, 16)
  this.sceneRoot.addComponent(waterSurface)
  this.actors.push(waterSurface)

  var buoy = window.buoy = new Buoy(this, water)

  buoy.ready.then(function (buoy) {
    buoy.x = 100

    this.actors.push(buoy)
    this.sceneRoot.addComponent(buoy)
  }.bind(this))

  var boat = window.boat = new Boat(this, water)
  boat.ready.then(function () {
    this.actors.push(boat)
    this.sceneRoot.addComponent(boat)
  }.bind(this), function (e) {
    console.error(e)
  })

  Promise.all([boat.ready, buoy.ready]).then(function () {
    addMaterialEditorsForNodeAndChildren(this.sceneRoot)
  }.bind(this))

  var visitedMaterials = []
  function addMaterialEditorsForNodeAndChildren (component) {
    if (component.material instanceof Material &&
      visitedMaterials.indexOf(component.material) === -1) {
      visitedMaterials.push(component.material)
      editors.push(new Editors.MaterialEditor(component.material))
    }

    component.components.forEach(addMaterialEditorsForNodeAndChildren)
  }
}

DemoGame.prototype.tick = function tick (ts) {
  Game.prototype.tick.apply(this, arguments)
  var angle = ts / 10000
  vec3.set(this.camera.position, Math.sin(angle) * 200, Math.cos(angle) * 200, Math.sin(ts / 7000) * 50 + 75)
}
