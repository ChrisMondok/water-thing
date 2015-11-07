function Buoy(gl, water, color) {
	Actor.apply(this);

	this.water = water;
	var cylinder = primitives.cylinder(0, 0, this.height / 4, this.height, this.radius, this.facetRes);
	this.vertices = cylinder.vertices;
	this.normals = cylinder.normals;
	this.material = new BuoyMaterial(color);

	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

	this.normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
}

Buoy.prototype = Object.create(Actor.prototype);
Buoy.prototype.constructor = Buoy;

Buoy.prototype.radius = 15;
Buoy.prototype.facetRes = 24;
Buoy.prototype.height = 50;

Buoy.prototype.draw = function(renderer, timestamp) {
	renderer.setMaterial(this.material);
	renderer.drawTriangleStrip(this.vertexBuffer, this.normalBuffer, this.vertices.length / 3);
};

Buoy.prototype.tick = function(timestamp) {
	var xy = this.getVector2D().elements;
	this.z = this.water.getZ(timestamp, xy);
	var normal = this.water.getNormal(timestamp, xy);
	this.rotation.setElements([normal[1], normal[0], 0]);
};

function BuoyMaterial(color) {
	Material.apply(this);
	this.diffuse = new Float32Array(color);
	this.ambient = new Float32Array(color);
}

BuoyMaterial.prototype = Object.create(Material.prototype);
BuoyMaterial.prototype.reflectivity = 0.3;
BuoyMaterial.prototype.shininess = 6;
BuoyMaterial.prototype.constructor = BuoyMaterial;
