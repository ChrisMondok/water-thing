class WaterSurface extends Heightmap {
  constructor(game: Game, private water: Water, resolution : number) {
    super(game, new WaterMaterial(), resolution)
  }

  private static readonly scratchXY = vec2.create()
  private static readonly scratchXYZ = vec3.create()

  tick() {
    vec3.set(WaterSurface.scratchXYZ, 0, 0, 1)
    // TODO: handle having a transformed parent
    vec3.transformMat4(WaterSurface.scratchXYZ, WaterSurface.scratchXYZ, this.inverseTransformMatrix)
    let heightScale = WaterSurface.scratchXYZ[2]

    for (let i = 0; i < this.vertices.length; i += 3) {
      vec2.set(WaterSurface.scratchXY, this.vertices[i], this.vertices[i + 1])
      vec2.transformMat4(WaterSurface.scratchXY, WaterSurface.scratchXY, this.transformMatrix)
      // HACK: heightScale only works as long as the water surface isn't rotated along X / Y.
      this.vertices[i + 2] = this.water.getZ(this.game.now, WaterSurface.scratchXY) * heightScale
      this.water.getNormal(WaterSurface.scratchXYZ, this.game.now, WaterSurface.scratchXY)
      this.normals[i] = WaterSurface.scratchXYZ[0]
      this.normals[i + 1] = WaterSurface.scratchXYZ[1]
      this.normals[i + 2] = WaterSurface.scratchXYZ[2]
    }

    this.game.gl.bindBuffer(this.game.gl.ARRAY_BUFFER, this.vertexBuffer)
    this.game.gl.bufferData(this.game.gl.ARRAY_BUFFER, this.vertices, this.game.gl.DYNAMIC_DRAW)

    this.game.gl.bindBuffer(this.game.gl.ARRAY_BUFFER, this.normalBuffer)
    this.game.gl.bufferData(this.game.gl.ARRAY_BUFFER, this.normals, this.game.gl.DYNAMIC_DRAW)

  }
}

class WaterMaterial extends Material {
  diffuse = new Float32Array([0, 0.2, 0.3])
  emissive = new Float32Array([0, 0, 0])
  ambient = new Float32Array([1, 1, 1])
  specular = new Float32Array([0.8, 0.8, 0.8])
  shininess = 24
}
