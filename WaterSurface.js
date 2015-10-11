function WaterSurface(gl, water, size, cellsPerSide) {
	Actor.apply(this, gl);
	this.size = size;
	this.cellsPerSide = cellsPerSide;
	this.water = water;

	var columns = rows = this.cellsPerSide + 1;
	var pointsPerRow = columns * 2;
	var duplicatePoints = (rows - 2) * 2;
	var numPoints = (rows - 1) * pointsPerRow + duplicatePoints;

	this.triangleStripArray = new Float32Array(numPoints * 3);
	this.normalArray = new Float32Array(numPoints * 3);

	this.diffuse = new Float32Array([
		0,
		0.2,
		0.3
	]);

	this.specular = new Float32Array([0.2, 0.8, 0.9]);

	this.vertexBuffer = gl.createBuffer();
	this.normalBuffer = gl.createBuffer();
}

WaterSurface.prototype = Object.create(Actor.prototype);
WaterSurface.prototype.constructor = WaterSurface;

WaterSurface.prototype.width = 100;
WaterSurface.prototype.height = 100;

WaterSurface.prototype.getVertices = function(timestamp) {
	var self = this;
	var cps = this.cellsPerSide;
	var output = new Array(cps + 1);

	var vec2 = Vector.create([0, 0]);
	for(var y = 0; y < cps + 1; y++) {
		output[y] = new Array(cps + 1);
		for(var x = 0; x < cps + 1; x++)
			output[y][x] = getVertex(x, y);
	}

	function getVertex(x, y) {
		var xWorld = (x - cps/2) / cps * self.size + self.x;
		var yWorld = (y - cps/2) / cps * self.size + self.y;
		vec2.elements[0] = xWorld;
		vec2.elements[1] = yWorld;
		return [
			xWorld - self.x,
			yWorld - self.y,
			self.water.getZ(timestamp, vec2)
		];
	}

	return output;
};

WaterSurface.prototype.getWorldZ = function(worldX, worldY) {
	return this.water.getZ(worldX, worldY);
};

WaterSurface.prototype.tick = function(timestamp) {
	this.updateBuffers(timestamp);
};

WaterSurface.prototype.draw = function(renderer, timestamp) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.triangleStripArray, gl.DYNAMIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.normalArray, gl.DYNAMIC_DRAW);

	renderer.setMaterial(this.diffuse, this.specular);

	renderer.drawTriangleStrip(this.vertexBuffer, this.normalBuffer, this.triangleStripArray.length / 3);
};

WaterSurface.prototype.updateBuffers = function(timestamp) {
	var self = this;
	var columns = rows = this.cellsPerSide + 1;
	var pointsPerRow = columns * 2;
	var duplicatePoints = (rows - 2) * 2;
	var numPoints = (rows - 1) * pointsPerRow + duplicatePoints;

	var verts = this.getVertices(timestamp);

	var s = 0, n = 0;
	var vv = Vector.Zero(2);
	function addVertex(x, y) { //it would be nice if I could inline functions...
		var v = verts[y][x];
		self.triangleStripArray[s+0] = v[0];
		self.triangleStripArray[s+1] = v[1];
		self.triangleStripArray[s+2] = v[2];
		s += 3;

		vv.setElements([v[0], v[1]]);
		var normal = self.water.getNormal(timestamp, vv);
		self.normalArray[n+0] = normal.e(1);
		self.normalArray[n+1] = normal.e(2);
		self.normalArray[n+2] = normal.e(3);
		n += 3;
	}

	for(var y = 0; y < rows - 1; y++) {
		for(var x = 0; x < columns; x++) {
			addVertex(x, y + 1);
			addVertex(x, y);
		}

		if(y < rows - 2) {
			addVertex(columns - 1, y);
			addVertex(0, y + 2);
		}
	}
};
