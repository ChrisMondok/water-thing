/* globals MeshComponent, gl */

// TODO: get gl out of global scope

function PrismComponent (material, sides, smooth) {
  this.sides = sides || 4

  MeshComponent.apply(this, arguments)

  this.drawMode = gl.TRIANGLES
}

PrismComponent.prototype = Object.create(MeshComponent.prototype)
PrismComponent.prototype.constructor = PrismComponent

PrismComponent.prototype.createMesh = function () {
  var verts = []
  var norms = []
  for (var i = 0; i <= this.sides; i++) {
    var normalAngle = (i / this.sides % 1) * 2 * Math.PI
    var sideOffset = (Math.PI / this.sides)

    var nx = Math.cos(normalAngle)
    var ny = Math.sin(normalAngle)

    var xStart = Math.cos(normalAngle - sideOffset) * Math.sqrt(2) / 2
    var yStart = Math.sin(normalAngle - sideOffset) * Math.sqrt(2) / 2

    var xEnd = Math.cos(normalAngle + sideOffset) * Math.sqrt(2) / 2
    var yEnd = Math.sin(normalAngle + sideOffset) * Math.sqrt(2) / 2

    // side triangle 1
    verts.push(xStart, yStart, 0.5)
    verts.push(xStart, yStart, -0.5)
    verts.push(xEnd, yEnd, 0.5)
    norms.push(nx * 2, ny, 0)
    norms.push(nx * 2, ny, 0)
    norms.push(nx * 2, ny, 0)

    // side triangle 2
    verts.push(xEnd, yEnd, 0.5)
    verts.push(xStart, yStart, -0.5)
    verts.push(xEnd, yEnd, -0.5)
    norms.push(nx * 2, ny, 0)
    norms.push(nx * 2, ny, 0)
    norms.push(nx * 2, ny, 0)

    if (this.sides > 2) {
      // top triangle
      verts.push(xStart, yStart, 0.5)
      verts.push(xEnd, yEnd, 0.5)
      verts.push(0, 0, 0.5)
      norms.push(0, 0, 1)
      norms.push(0, 0, 1)
      norms.push(0, 0, 1)

      // bottom triangle
      verts.push(xStart, yStart, -0.5)
      verts.push(0, 0, -0.5)
      verts.push(xEnd, yEnd, -0.5)
      norms.push(0, 0, -1)
      norms.push(0, 0, -1)
      norms.push(0, 0, -1)
    }
  }

  return {
    vertices: new Float32Array(verts),
    normals: new Float32Array(norms)
  }
}
