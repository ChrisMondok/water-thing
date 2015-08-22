function RenderPass(gl, program) {
	this.gl = gl;
	this.program = program;
	this.drawables = [];

	this.gl.enable(gl.DEPTH_TEST);
	//this.gl.enable(gl.CULL_FACE);

	this.u_transform = gl.getUniformLocation(program, 'u_transform');
	this.a_position =  gl.getAttribLocation(program, 'a_position');
	this.a_color = gl.getAttribLocation(this.program, 'a_color');

	this.gl.enableVertexAttribArray(this.a_position);
	this.gl.enableVertexAttribArray(this.a_color);
}

RenderPass.prototype.render = function(camera, timestamp) {
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	this.gl.useProgram(this.program);

	for(var i = 0; i < this.drawables.length; i++) {
		var d = this.drawables[i];
		this.gl.uniformMatrix4fv(this.u_transform, false, d.getTransformMatrix().x(camera.getMatrix()).toArray());
		this.drawables[i].draw(this, timestamp);
	}
};

RenderPass.prototype.drawTriangleStripColored = function(vertBuffer, colorBuffer, numVerts) {
		this.gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
		this.gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0);

		this.gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		this.gl.vertexAttribPointer(this.a_color, 4, gl.FLOAT, false, 0, 0);

		this.gl.drawArrays(gl.TRIANGLE_STRIP, 0, numVerts);
};
