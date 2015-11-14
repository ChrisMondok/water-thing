function MeshComponent(material) {
	SceneGraphNode.apply(this, arguments);
	this.material = material;

	var mesh = this.createMesh();
	var vertices = mesh.vertices;
	var normals = mesh.normals;

	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	this.normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

	this.numVertices = vertices.length / 3;

	this.drawMode = gl.TRIANGLE_STRIP;
}

MeshComponent.prototype = Object.create(SceneGraphNode.prototype);
MeshComponent.prototype.constructor = MeshComponent;

MeshComponent.prototype.createMesh = function() {
	throw new Error("Cannot create abstract mesh.");
};

MeshComponent.prototype.draw = function(renderer, timestamp) {
	SceneGraphNode.prototype.draw.apply(this, arguments);
	renderer.setMaterial(this.material);
	renderer.draw(this.drawMode, this.vertexBuffer, this.normalBuffer, this.numVertices);
};
