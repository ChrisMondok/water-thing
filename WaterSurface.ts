class WaterSurface extends Actor{
  private vertexMap: Array<number>
  private normalMap: Array<number>
  private vertexBufferArray: Float32Array
  private normalBufferArray: Float32Array
  
  private material: Material
  private vertexBuffer: WebGLBuffer
  private normalBuffer: WebGLBuffer

  constructor (game : Game, private water : Water, private size : number, private cellsPerSide : number) {
    super(game)

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

    this.vertexBuffer = notNull(game.gl.createBuffer())
    this.normalBuffer = notNull(game.gl.createBuffer())
  }

  width = 100
  height = 100

  tick () {
    this.updateBuffers()
  }

  draw (renderer : GeometryRenderer) {
    super.draw(renderer)
    Actor.prototype.draw.apply(this, arguments)
    var gl = this.game.gl

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexBufferArray, gl.DYNAMIC_DRAW)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.normalBufferArray, gl.DYNAMIC_DRAW)

    renderer.setMaterial(this.material)

    renderer.draw(gl.TRIANGLE_STRIP, this.vertexBuffer, this.normalBuffer, this.vertexBufferArray.length / 3)
  }

  private updateBuffers = function () {
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

    function addVertex (x : number, y : number) {
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
          self.vertexMap[i + 2] = self.water.getZ(this.game.now, xyWorld)

          self.water.getNormal(normal, this.game.now, xyWorld)
          self.normalMap[i] = normal[0]
          self.normalMap[i + 1] = normal[1]
          self.normalMap[i + 2] = normal[2]
        }
      }
    }
  }
}

var xyWorld = vec2.create()
var normal = vec3.create()

class WaterMaterial extends Material {
  diffuse = new Float32Array([0, 0.2, 0.3])
  emissive = new Float32Array([0, 0, 0])
  ambient = new Float32Array([1, 1, 1])
  specular = new Float32Array([0.8, 0.8, 0.8])
  shininess = 24
}
