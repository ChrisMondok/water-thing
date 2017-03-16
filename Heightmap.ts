class Heightmap extends Actor {
  protected vertices : Float32Array
  protected normals : Float32Array

  constructor(game: Game, public material : Material, public readonly resolution : number) {
    super(game)

    let gl = this.game.gl

    this.vertices = Heightmap.buildVertexArray(this.resolution)

    this.vertexBuffer = notNull(gl.createBuffer())
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW)

    this.normalBuffer = notNull(gl.createBuffer())
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
    this.normals = new Float32Array(Math.pow(this.resolution, 2) * 3).map((x, i) => (i - 2) % 3 ? 0 : 1)
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.DYNAMIC_DRAW)

    this.elementBuffer = notNull(gl.createBuffer())
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Heightmap.buildElementArray(this.resolution), gl.STATIC_DRAW)
  }

  draw(renderer : GeometryRenderer) {
    SceneGraphNode.prototype.draw.apply(this, arguments)
    renderer.setMaterial(this.material)

    let numPoints = Math.pow(this.resolution - 1, 2) * 3 * 2
    renderer.drawElements(this.elementBuffer, this.vertexBuffer, this.normalBuffer, numPoints)
  }

  private static buildVertexArray(resolution: number) {
    let i = 0

    let vertices = new Float32Array(Math.pow(resolution, 2) * 3)
    for(let y = 0; y < resolution; y++) {
      for(let x = 0; x < resolution; x++) {
        add(-0.5 + (x / (resolution - 1)), -0.5 + (y / (resolution - 1)))
      }
    }

    return vertices

    function add(x: number, y: number) {
      vertices[i++] = x
      vertices[i++] = y
      vertices[i++] = 0
    }
  }

  private static buildElementArray(resolution: number) {
    let i = 0

    let points = new Uint16Array(Math.pow(resolution - 1, 2) * 3 * 2)
    for(let y = 1; y < resolution; y++) {
      for(let x = 1; x < resolution; x++) {
        addPoint(x - 1, y)
        addPoint(x - 1, y - 1)
        addPoint(x, y - 1)

        addPoint(x - 1, y)
        addPoint(x, y - 1)
        addPoint(x, y)
      }
    }

    function addPoint(x: number, y: number) {
      points[i++] = x + resolution * y
    }

    return points
  }

  protected vertexBuffer: WebGLBuffer
  protected normalBuffer: WebGLBuffer
  private elementBuffer: WebGLBuffer
}
