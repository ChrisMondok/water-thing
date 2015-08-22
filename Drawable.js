function Drawable(gl) {
	Actor.apply(this);

	this.vertices = new Float32Array([
		- 50.0, - 50.0, +  0.0, //lower left
		+ 50.0, - 50.0, +  0.0, //lower right
	 	+  0.0, + 50.0, +  0.0, //top
	 	+  0.0, +  0.0, + 50.0, //center
		- 50.0, - 50.0, +  0.0, //lower left
		+ 50.0, - 50.0, +  0.0 //lower right
	]);

	this.colors = new Uint8Array([
		0, 0, 255, 255, //lower left, blue
		0, 255, 0, 255, //lower right, green
		255, 0, 0, 255, //top, red
		0, 0, 0, 255, //center, black
		0, 0, 255, 255, //lower left, blue
		0, 255, 0, 255  //lower right, green
	]);

	this.createBuffers(gl);
}

Drawable.prototype = Object.create(Actor.prototype);
Drawable.prototype.vertexBuffer = null;
Drawable.prototype.colorBuffer = null;
Drawable.prototype.vertices = null;
Drawable.prototype.colors = null;

Drawable.prototype.draw = function(renderer) {
	renderer.drawTriangleStripColored(this.vertexBuffer, this.colorBuffer, this.vertices.length / 3);
};

Drawable.prototype.createBuffers = function(gl) {
	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

	this.colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
};
