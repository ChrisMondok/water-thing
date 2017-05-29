class Heightmap extends Actor {
  protected readonly vertices : Float32Array
  protected readonly normals : Float32Array

  constructor(game: Game, public material : Material, public readonly resolution : number) {
    super(game)

    let gl = this.game.gl

    this.vertices = Heightmap.buildVertexArray(this.resolution)

    this.vertexBuffer = notNull(gl.createBuffer())

    this.normalBuffer = notNull(gl.createBuffer())
    this.normals = new Float32Array(Math.pow(this.resolution, 2) * 3).map((x, i) => (i - 2) % 3 ? 0 : 1)

    this.updateBuffers()

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

  setNormalsFromVertices() {
    const vertices = this.vertices
    const normals = this.normals
    const resolution = this.resolution

    const scratch = vec3.create()

    for (let y = 0; y < this.resolution; y++) {
      for (let x = 0; x < this.resolution; x++) {
        const dx = getZ(x + 1, y) - getZ(x - 1, y)
        const dy = getZ(x, y + 1) - getZ(x, y - 1)
        vec3.set(scratch, dx, dy, 2 / resolution)
        vec3.normalize(scratch, scratch)
        const normalOffset = 3 * (y * this.resolution + x)
        normals[normalOffset + 0] = notNan(scratch[0])
        normals[normalOffset + 1] = notNan(scratch[1])
        normals[normalOffset + 2] = notNan(scratch[2])
      }
    }

    function getZ(x: number, y: number) {
      x = Math.max(Math.min(x, resolution - 1), 0)
      y = Math.max(Math.min(y, resolution - 1), 0)
      return vertices[3 * (resolution * y + x) + 2]
    }
  }

  protected updateBuffers() {
    const gl = this.game.gl

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.DYNAMIC_DRAW)
  }

  static fromImage(game: Game, material: Material, uri: string, maxHeight: number) {
    const img = document.createElement('img')
    img.src = uri

    return loadImage(uri).then(img => {
      if (img.width !== img.height) throw new Error('Heightmap image must be square.')
      const heights = getImageData(img).data.filter((n, i) => !(i % 4)) // Only use the red channel
      const heightmap = new Heightmap(game, material, img.width)
      heights.forEach((h, i) => {
        heightmap.vertices[2 + i * 3] = maxHeight * ((h - 128) / 255)
      })
      heightmap.setNormalsFromVertices()
      heightmap.updateBuffers()
      return heightmap
    })

    function loadImage(uri: string) {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        img.addEventListener('load', () => {
          resolve(img)
        })
      })
    }
  }

  private static buildVertexArray(resolution: number) {
    let i = 0

    let vertices = new Float32Array(Math.pow(resolution, 2) * 3)
    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
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
    for (let y = 1; y < resolution; y++) {
      for (let x = 1; x < resolution; x++) {
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
