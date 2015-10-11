function Buoy(gl, water, color) {
	Actor.apply(this);

	this.water = water;
	var cylinder = primitives.cylinder(0, 0, this.height / 4, this.height, this.radius, this.facetRes);
	this.vertices = cylinder.vertices;
	this.normals = cylinder.normals;
	this.colors = this.createColors(color);

	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

	this.colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
}

Buoy.prototype = Object.create(Actor.prototype);
Buoy.prototype.constructor = Buoy;

Buoy.prototype.radius = 15;
Buoy.prototype.facetRes = 12;
Buoy.prototype.height = 50;

Buoy.prototype.draw = function(renderer, timestamp) {
	renderer.drawTriangleStripColored(this.vertexBuffer, this.colorBuffer, this.vertices.length / 3);
};

Buoy.prototype.tick = function(timestamp) {
	var v = this.getVector2D();
	this.z = this.water.getZ(timestamp, v);
	var normal = this.water.getNormal(timestamp, v);
	this.rotation.setElements([normal.elements[1], normal.elements[0], 0]);
};

Buoy.prototype.createColors = function(color) {
	var colors = new Float32Array(this.vertices.length);
	for(var i = 0; i < colors.length; i += 3) {
		colors[i + 0] = color[0];
		colors[i + 1] = color[1];
		colors[i + 2] = color[2];
	}

	return colors;
};
