function Drawable(gl, program) {
	this.gl = gl;
	this.program = program;

	this.vertices =  new Float32Array([
		-50.0, -50.0, -50.0, //lower left
	 	 50.0, -50.0, -50.0, //lower right
	 	  0.0,  50.0, -50.0, //top
	 	  0.0,   0.0,   0.0, //center
		-50.0, -50.0, -50.0, //lower left
	 	 50.0, -50.0, -50.0 //lower right
	]);

	this.colors = new Uint8Array([
		0, 0, 255, 255, //lower left, blue
		0, 255, 0, 255, //lower right, green
		255, 0, 0, 255, //top, red
		0, 0, 0, 255, //center, black
		0, 0, 255, 255, //lower left, blue
		0, 255, 0, 255  //lower right, green
	]);

	this.createBuffers();
}

Drawable.prototype.draw = function() {
	this.gl.useProgram(this.program);

	var transMatLoc = this.gl.getUniformLocation(this.program, 'u_transform');
	this.gl.uniformMatrix4fv(transMatLoc, false, camera.getMatrix().toArray());

	var vertexPosAttrib = gl.getAttribLocation(this.program, 'a_position');
	this.gl.enableVertexAttribArray(vertexPosAttrib);

	var vertexColorAttrib = gl.getAttribLocation(this.program, 'a_color');
	this.gl.enableVertexAttribArray(vertexColorAttrib);
	
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	this.gl.vertexAttribPointer(vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);

	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	this.gl.vertexAttribPointer(vertexColorAttrib, 4, gl.UNSIGNED_BYTE, false, 0, 0);

	this.gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices.length / 3);
};

Drawable.prototype.createBuffers = function() {
	this.vertexBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	this.gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

	this.colorBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	this.gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
};
