function WaterSurface(gl, water, size, cellsPerSide) {
	this.size = size;
	this.cellsPerSide = cellsPerSide;
	this.water = water;

	var columns = rows = this.cellsPerSide + 1;
	var pointsPerRow = columns * 2;
	var duplicatePoints = (rows - 2) * 2;
	var numPoints = (rows - 1) * pointsPerRow + duplicatePoints;

	this.triangleStripArray = new Float32Array(numPoints * 3);
	this.colorArray = new Float32Array(numPoints * 4);

	Drawable.call(this, gl);
}

WaterSurface.prototype = Object.create(Drawable.prototype);

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
		var xWorld = (x - cps/2) / cps * self.size;
		var yWorld = (y - cps/2) / cps * self.size;
		vec2.elements[0] = xWorld;
		vec2.elements[1] = yWorld;
		return [
			xWorld,
			yWorld,
			self.water.getZ(timestamp, vec2)
		];
	}

	return output;
};

WaterSurface.prototype.getWorldZ = function(worldX, worldY) {
	return this.water.getZ(worldX, worldY);
};

WaterSurface.prototype.draw = function(renderer, timestamp) {
	this.updateBuffers(timestamp);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.triangleStripArray, gl.DYNAMIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.colorArray, gl.STATIC_DRAW);

	renderer.drawTriangleStripColored(this.vertexBuffer, this.colorBuffer, this.triangleStripArray.length / 3);
};

WaterSurface.prototype.createBuffers = function(gl) {
	this.vertexBuffer = gl.createBuffer();
	this.colorBuffer = gl.createBuffer();
};

WaterSurface.prototype.updateBuffers = function(timestamp) {
	var self = this;
	var columns = rows = this.cellsPerSide + 1;
	var pointsPerRow = columns * 2;
	var duplicatePoints = (rows - 2) * 2;
	var numPoints = (rows - 1) * pointsPerRow + duplicatePoints;

	var verts = this.getVertices(timestamp);

	var s = 0, c = 0;
	function addVertex(x, y) { //it would be nice if I could inline functions...
		var v = verts[y][x];
		self.triangleStripArray[s+0] = v[0];
		self.triangleStripArray[s+1] = v[1];
		self.triangleStripArray[s+2] = v[2];
		s += 3;

		var color = self.getColor(x, y, v[2]);
		self.colorArray[c+0] = color[0];
		self.colorArray[c+1] = color[1];
		self.colorArray[c+2] = color[2];
		self.colorArray[c+3] = color[3];
		c += 4;
	}

	for(var y = 0; y < rows - 1; y++) {
		for(var x = 0; x < columns; x++) {
			addVertex(x, y);
			addVertex(x, y + 1);
		}

		if(y < rows - 2) {
			addVertex(columns - 1, y + 1);
			addVertex(0, y + 1);
		}
	}
};

WaterSurface.prototype.getColor = function(x, y, z) {
	return [
		0,
		130/255 * (20 + z) / 30,
		148/255 * (20 + z) / 30,
		1
	];
};
