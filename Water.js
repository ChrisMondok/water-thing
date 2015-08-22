function WaterSurface(gl, size, cellsPerSide) {
	this.size = size;
	this.cellsPerSide = cellsPerSide;
	this.cellsPerSide = cellsPerSide;

	Drawable.call(this, gl);
}

WaterSurface.prototype = Object.create(Drawable.prototype);

WaterSurface.prototype.width = 100;
WaterSurface.prototype.height = 100;

WaterSurface.prototype.getVertex = function(x, y) {
	var cps = this.cellsPerSide;
	var xWorld = (x - cps/2) / cps * this.size;
	var yWorld = (y - cps/2) / cps * this.size;
	return [
		xWorld,
		yWorld,
		this.getWorldZ(xWorld, yWorld)
	];
};

WaterSurface.prototype.getWorldZ = function(worldX, worldY) {
	return 25 + Math.sin(worldX * 10) * 25
};

WaterSurface.prototype.draw = function(renderer) {
	var verts = this.getTriangleStrip();

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, verts, gl.DYNAMIC_DRAW);

	var colors = this.getColors(verts);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

	renderer.drawTriangleStripColored(this.vertexBuffer, this.colorBuffer, verts.length / 3);
};

WaterSurface.prototype.createBuffers = function(gl) {
	this.vertexBuffer = gl.createBuffer();
	this.colorBuffer = gl.createBuffer();
};

//TODO: make this take a Float32Array for verts, and a Uint8Array for colors
WaterSurface.prototype.getTriangleStrip = function() {
	var self = this;
	var columns = rows = this.cellsPerSide + 1;
	var pointsPerRow = columns * 2;
	var duplicatePoints = (rows - 2) * 2;
	var numPoints = (rows - 1) * pointsPerRow + duplicatePoints;
	var output = new Float32Array(3 * numPoints);

	var c = 0;
	function addVertex(x, y) { //it would be nice if I could inline functions...
		var v = self.getVertex(x, y);
		output[c+0] = v[0];
		output[c+1] = v[1];
		output[c+2] = v[2];
		c += 3;
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
	return output;
};

WaterSurface.prototype.getColors = function(verts) {
	var colors = new Float32Array(4 * verts.length / 3);
	for(var i = 0; i < colors.length; i += 4) {
		colors[i + 0] = 0;
		colors[i + 1] = 130/255;
		colors[i + 2] = 148/255;
		colors[i + 3] = 1; //TODO: alpha?
	}
	return colors;
};

