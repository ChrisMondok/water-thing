var primitives = {};

primitives.cylinder = function(cx, cy, cz, height, radius, facetRes) {
	if(facetRes === undefined)
		facetRes = 12;

	var verts = [];
	var norms = [];
	var angle, x, y, nx, ny, i;
	for(i = 0; i <= facetRes; i++) {
		angle = (i/facetRes % 1) * 2 * Math.PI;
		
		nx = Math.cos(angle);
		ny = Math.sin(angle);

		x = cx + nx * radius;
		y = cy + ny * radius;

		verts.push(x, y, cz + height / 2);
		norms.push(nx, ny, 0);
		verts.push(x, y, cz - height / 2);
		norms.push(nx, ny, 0);
	}

	//degenerate triangle between side and lid
	verts.push(x, y, cz - height/2);
	norms.push(nx, ny, 0);
	verts.push(x, y, cz + height/2);
	norms.push(0, 0, 1);

	for(i = 0; i <= facetRes; i++) {
		angle = (i/facetRes % 1) * 2 * Math.PI;
		nx = 0;
		ny = 0;
		x = cx + Math.cos(angle) * radius;
		y = cy +Math.sin(angle) * radius;

		verts.push(x, y, cz + height/2);
		norms.push(0, 0, 1);
		verts.push(cx, cy, cz + height/2);
		norms.push(0, 0, 1);
	}
	
	//degenerate triangle between top and bottom
	verts.push(cx, cy, cz + height/2);
	norms.push(0, 0, 1);
	verts.push(x, y, cz - height/2);
	norms.push(0, 0, -1);

	for(i = 0; i <= facetRes; i++) {
		angle = (i/facetRes % 1) * 2 * Math.PI;
		nx = 0;
		ny = 0;
		x = cx + Math.cos(angle) * radius;
		y = cy + Math.sin(angle) * radius;

		verts.push(x, y, cz - height/2);
		norms.push(0, 0, -1);
		verts.push(cx, cy, cz - height/2);
		norms.push(0, 0, -1);
	}

	return {
		vertices: new Float32Array(verts),
		normals: new Float32Array(norms)
	};
};
