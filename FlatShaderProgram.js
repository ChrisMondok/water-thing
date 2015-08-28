function FlatShaderProgram(gl, program) {
	ShaderProgram.apply(this, arguments);

	this.u_transform = gl.getUniformLocation(program, 'u_transform');

	this.a_position =  gl.getAttribLocation(program, 'a_position');
	this.a_color = gl.getAttribLocation(this.program, 'a_color');

	this.gl.enableVertexAttribArray(this.a_position);
	this.gl.enableVertexAttribArray(this.a_color);
}

FlatShaderProgram.prototype = Object.create(ShaderProgram.prototype);
FlatShaderProgram.prototype.constructor = FlatShaderProgram;

FlatShaderProgram.prototype.drawTriangleStrip = function(vertBuffer, colorBuffer, numVerts) {
	this.gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
	this.gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0);

	this.gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	this.gl.vertexAttribPointer(this.a_color, 3, gl.FLOAT, false, 0, 0);

	this.gl.drawArrays(gl.TRIANGLE_STRIP, 0, numVerts);
};

FlatShaderProgram.create = function(gl) {
	return Promise.all([
		ShaderProgram.getShader(gl, 'vertex.glsl', gl.VERTEX_SHADER),
		ShaderProgram.getShader(gl, 'fragment.glsl', gl.FRAGMENT_SHADER)
	]).then(function(shaders) {
		return ShaderProgram.compileProgram(gl, shaders);
	}).then(function(program) {
		return new FlatShaderProgram(gl, program);
	})['catch'](function(e) {
		console.error(e);
	});
};

function FlatShaded(gl) {
	this.createBuffers(gl);
}

FlatShaded.prototype.shaderProgramType = FlatShaderProgram;

FlatShaded.prototype.draw = function(timestamp) {
	if(!this.shaderProgram) {
		console.error("Shader program not initialized for %s", this.constructor.name);
		return;
	}

	this.shaderProgram.use();
	this.shaderProgram.gl.uniformMatrix4fv(this.u_transform, false, this.getTransformMatrix().x(camera.getMatrix()).toArray());
	this.shaderProgram.drawTriangleStrip(this.vertexBuffer, this.colorBuffer, this.vertices.length / 3);
};

FlatShaded.prototype.createBuffers = function(gl) {
	if(!this.vertices || !this.colors)
		throw new Error("%s did not set its vertices / colors!", this.constructor.name);

	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

	this.colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
}
