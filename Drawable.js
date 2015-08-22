function Drawable(gl) {
	Actor.apply(this);
	this.createBuffers(gl);
}

Drawable.prototype = Object.create(Actor.prototype);
Drawable.prototype.vertexBuffer = null;
Drawable.prototype.colorBuffer = null;
Drawable.prototype.vertices = null;
Drawable.prototype.colors = null;

Drawable.prototype.draw = function(renderer, timestamp) {
	renderer.drawTriangleStripColored(this.vertexBuffer, this.colorBuffer, this.vertices.length / 3);
};

Drawable.prototype.createBuffers = function(gl) {
	if(!this.vertices || !this.colors)
		throw new Error("Drawable did not set its vertices / colors!");

	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

	this.colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
};
