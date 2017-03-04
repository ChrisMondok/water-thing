/* globals SceneGraphNode, gl */

declare const gl: WebGLRenderingContext

interface Mesh {
  vertices: Float32Array
  normals: Float32Array
  material?: any
  name?: string
}

abstract class MeshComponent extends SceneGraphNode {
  drawMode = gl.TRIANGLE_STRIP
  numVertices: number
  vertexBuffer: WebGLBuffer
  normalBuffer: WebGLBuffer

  constructor (mesh : Mesh, public material) {
    super()

    var vertices = mesh.vertices
    var normals = mesh.normals

    this.vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    this.normalBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW)

    this.numVertices = vertices.length / 3

    this.drawMode = gl.TRIANGLE_STRIP
  }

  draw(renderer, timestamp) {
    SceneGraphNode.prototype.draw.apply(this, arguments)
    renderer.setMaterial(this.material)
    renderer.draw(this.drawMode, this.vertexBuffer, this.normalBuffer, this.numVertices)
  }

}

class StaticMeshComponent extends MeshComponent {
  constructor (staticMeshDefinition) {
    super({
      vertices: staticMeshDefinition.vertices,
      normals: staticMeshDefinition.normals
    }, staticMeshDefinition.material)

    this.drawMode = gl.TRIANGLES
  }
}

StaticMeshComponent.prototype = Object.create(MeshComponent.prototype)
