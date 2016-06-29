/* globals MeshComponent */

function CylinderComponent (material, facetRes) {
  this.facetRes = facetRes || 24

  MeshComponent.apply(this, arguments)
}

CylinderComponent.prototype = Object.create(MeshComponent.prototype)
CylinderComponent.prototype.constructor = CylinderComponent

CylinderComponent.prototype.createMesh = function () {
  var verts = []
  var norms = []
  var angle, x, y, i
  for (i = 0; i <= this.facetRes; i++) {
    angle = (i / this.facetRes % 1) * 2 * Math.PI

    x = Math.cos(angle) / 2
    y = Math.sin(angle) / 2

    verts.push(x, y, 0.5)
    norms.push(x * 2, y * 2, 0)
    verts.push(x, y, -0.5)
    norms.push(x * 2, y * 2, 0)
  }

  // degenerate triangle between side and lid
  verts.push(x, y, -0.5)
  norms.push(x * 2, y * 2, 0)
  verts.push(x, y, 0.5)
  norms.push(0, 0, 1)

  for (i = 0; i <= this.facetRes; i++) {
    angle = ((this.facetRes - i) / this.facetRes % 1) * 2 * Math.PI
    x = Math.cos(angle) / 2
    y = Math.sin(angle) / 2

    verts.push(x, y, 0.5)
    norms.push(0, 0, 1)
    verts.push(0, 0, 0.5)
    norms.push(0, 0, 1)
  }

  // degenerate triangle between top and bottom
  verts.push(0, 0, 0.5)
  norms.push(0, 0, 1)
  verts.push(x, y, -0.5)
  norms.push(0, 0, -1)

  for (i = 0; i <= this.facetRes; i++) {
    angle = (i / this.facetRes % 1) * 2 * Math.PI
    x = Math.cos(angle) / 2
    y = Math.sin(angle) / 2

    verts.push(x, y, -0.5)
    norms.push(0, 0, -1)
    verts.push(0, 0, -0.5)
    norms.push(0, 0, -1)
  }

  return {
    vertices: new Float32Array(verts),
    normals: new Float32Array(norms)
  }
}
