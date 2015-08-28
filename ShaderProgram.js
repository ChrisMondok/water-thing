function ShaderProgram(gl, program) {
	this.gl = gl;
	this.program = program;
}

ShaderProgram.prototype.use = function() {
	this.gl.useProgram(this.program);
};

ShaderProgram.compileProgram = function compileProgram(gl, shaders) {
	var program = gl.createProgram();
	shaders.forEach(function(shader) {
		gl.attachShader(program, shader);
	});
	gl.linkProgram(program);

	if(!gl.getProgramParameter(program, gl.LINK_STATUS))
		throw "Error in program: "+gl.getProgramInfoLog(program);

	return program;
};

ShaderProgram.getShader = function getShader(gl, url, type) {
	return http.get(url).then(function(glsl) {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, glsl);
		gl.compileShader(shader);

		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
			throw "Error in shader "+url+": "+gl.getShaderInfoLog(shader);

		return shader;
	});
};
