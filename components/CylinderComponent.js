function CylinderComponent(material, height, radius, facetRes) {
	this.height = height;
	this.radius = radius;
	this.facetRes = facetRes || 24;

	MeshComponent.apply(this, arguments);
}

CylinderComponent.prototype = Object.create(MeshComponent.prototype);
CylinderComponent.prototype.constructor = CylinderComponent;

CylinderComponent.prototype.createMesh = function() {
	var verts = [];
	var norms = [];
	var angle, x, y, nx, ny, i;
	for(i = 0; i <= this.facetRes; i++) {
		angle = (i/this.facetRes % 1) * 2 * Math.PI;
		
		nx = Math.cos(angle);
		ny = Math.sin(angle);

		x = nx * this.radius;
		y = ny * this.radius;

		verts.push(x, y, this.height / 2);
		norms.push(nx, ny, 0);
		verts.push(x, y, -this.height / 2);
		norms.push(nx, ny, 0);
	}

	//degenerate triangle between side and lid
	verts.push(x, y, -this.height/2);
	norms.push(nx, ny, 0);
	verts.push(x, y, this.height/2);
	norms.push(0, 0, 1);

	for(i = 0; i <= this.facetRes; i++) {
		angle = ((this.facetRes - i)/this.facetRes % 1) * 2 * Math.PI;
		nx = 0;
		ny = 0;
		x = Math.cos(angle) * this.radius;
		y = Math.sin(angle) * this.radius;

		verts.push(x, y, this.height/2);
		norms.push(0, 0, 1);
		verts.push(0, 0, this.height/2);
		norms.push(0, 0, 1);
	}
	
	//degenerate triangle between top and bottom
	verts.push(0, 0, this.height/2);
	norms.push(0, 0, 1);
	verts.push(x, y, -this.height/2);
	norms.push(0, 0, -1);

	for(i = 0; i <= this.facetRes; i++) {
		angle = (i/this.facetRes % 1) * 2 * Math.PI;
		nx = 0;
		ny = 0;
		x = Math.cos(angle) * this.radius;
		y = Math.sin(angle) * this.radius;

		verts.push(x, y, -this.height/2);
		norms.push(0, 0, -1);
		verts.push(0, 0, -this.height/2);
		norms.push(0, 0, -1);
	}

	return {
		vertices: new Float32Array(verts),
		normals: new Float32Array(norms)
	};
};
