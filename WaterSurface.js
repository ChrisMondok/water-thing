/* globals Actor, Material */

function WaterSurface (gl, water, size, cellsPerSide) {
  Actor.apply(this, gl)
  this.size = size
  this.cellsPerSide = cellsPerSide
  this.water = water

  var columns, rows
  columns = rows = this.cellsPerSide + 1
  var pointsPerRow = columns * 2
  var duplicatePoints = (rows - 2) * 2
  var numPoints = (rows - 1) * pointsPerRow + duplicatePoints

  this.vertexMap = new Array(Math.pow(cellsPerSide + 1, 2))
  this.normalMap = new Array(Math.pow(cellsPerSide + 1, 2))

  this.vertexBufferArray = new Float32Array(numPoints * 3)
  this.normalBufferArray = new Float32Array(numPoints * 3)

  this.material = new WaterMaterial()

  this.vertexBuffer = gl.createBuffer()
  this.normalBuffer = gl.createBuffer()
}

WaterSurface.prototype = Object.create(Actor.prototype)
WaterSurface.prototype.constructor = WaterSurface

WaterSurface.prototype.width = 100
WaterSurface.prototype.height = 100

WaterSurface.prototype.getWorldZ = function (xy) {
  return this.water.getZ(xy)
}

WaterSurface.prototype.tick = function (timestamp) {
  this.updateBuffers(timestamp)
}

WaterSurface.prototype.draw = function (renderer, timestamp) {
  Actor.prototype.draw.apply(this, arguments)
  var gl = renderer.world.gl

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, this.vertexBufferArray, gl.DYNAMIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, this.normalBufferArray, gl.DYNAMIC_DRAW)

  renderer.setMaterial(this.material)

  renderer.draw(gl.TRIANGLE_STRIP, this.vertexBuffer, this.normalBuffer, this.vertexBufferArray.length / 3)
}

;(function () {
  var xyWorld = vec2.create()
  var normal = vec3.create()

  WaterSurface.prototype.updateBuffers = function (timestamp) {
    var self = this
    var cps = this.cellsPerSide

    updateMaps()

    var v = 0
    for (var y = 0; y < cps; y++) {
      for (var x = 0; x < cps + 1; x++) {
        addVertex(x, y + 1)
        addVertex(x, y)
      }

      if (y < cps - 1) {
        addVertex(cps, y)
        addVertex(0, y + 2)
      }
    }

    function addVertex (x, y) {
      var verts = self.vertexMap
      var norms = self.normalMap
      var i = y * (cps + 1) + x
      self.vertexBufferArray[v + 0] = verts[i * 3 + 0]
      self.vertexBufferArray[v + 1] = verts[i * 3 + 1]
      self.vertexBufferArray[v + 2] = verts[i * 3 + 2]

      self.normalBufferArray[v + 0] = norms[i * 3 + 0]
      self.normalBufferArray[v + 1] = norms[i * 3 + 1]
      self.normalBufferArray[v + 2] = norms[i * 3 + 2]

      v += 3
    }

    function updateMaps () {
      for (var y = 0; y < cps + 1; y++) {
        for (var x = 0; x < cps + 1; x++) {
          vec2.set(xyWorld, (x - cps / 2) / cps * self.size + self.x, (y - cps / 2) / cps * self.size + self.y)

          var i = 3 * (y * (cps + 1) + x)
          self.vertexMap[i] = xyWorld[0]
          self.vertexMap[i + 1] = xyWorld[1]
          self.vertexMap[i + 2] = self.water.getZ(timestamp, xyWorld)

          self.water.getNormal(normal, timestamp, xyWorld)
          self.normalMap[i] = normal[0]
          self.normalMap[i + 1] = normal[1]
          self.normalMap[i + 2] = normal[2]
        }
      }
    }
  }
})()

function WaterMaterial () {
  Material.apply(this)
  this.diffuse = new Float32Array([0, 0.2, 0.3])
  this.emissive = new Float32Array([0, 0, 0])
  this.ambient = new Float32Array([1, 1, 1])
}
WaterMaterial.prototype = Object.create(Material.prototype)
WaterMaterial.prototype.specular = new Float32Array([0.8, 0.8, 0.8])
WaterMaterial.prototype.shininess = 24
WaterMaterial.prototype.constructor = WaterMaterial
