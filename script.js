addEventListener('load', start);

var transformation = Matrix.I(4);

var pyramidVerts = new Float32Array([
	-0.5, -0.5,  0.0, //lower left
	 0.5, -0.5,  0.0, //lower right
	 0.0,  0.5,  0.0, //top
	 0.0,  0.0,  0.25, //center
	-0.5, -0.5,  0.0, //lower left
	 0.5, -0.5,  0.0 //lower right
]);

function start() {
	var canvas = document.querySelector('canvas');
	var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

	window.gl = gl;


	getProgram(gl).then(function(program) {
		window.program = program;
		draw(gl, program);
	}).then(null, function(e) {
		console.error(e);
	});
}

function draw(gl, program) {
	gl.useProgram(program);

	var transformLocation = gl.getUniformLocation(program, 'u_transform');
	gl.uniformMatrix4fv(gl.getUniformLocation(program, 'u_transform'), false, Array.prototype.concat.apply([], transformation.elements));


	var vertexPosAttrib = gl.getAttribLocation(program, 'position');
	gl.enableVertexAttribArray(vertexPosAttrib);

	var vertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, pyramidVerts, gl.STATIC_DRAW);
	gl.vertexAttribPointer(vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, pyramidVerts.length / 3);
}

function getProgram(gl) {
	var program = gl.createProgram();

	return Promise.all([
		getShader(gl, 'vertex.glsl', gl.VERTEX_SHADER),
		getShader(gl, 'fragment.glsl', gl.FRAGMENT_SHADER)
	]).then(function(shaders) {
		shaders.forEach(function(shader) {
			gl.attachShader(program, shader);
		});
		gl.linkProgram(program);

		if(!gl.getProgramParameter(program, gl.LINK_STATUS))
			throw "Error in program: "+gl.getProgramInfoLog(program);

		return program;
	});
}

function getShader(gl, url, type) {
	return http.get(url).then(function(glsl) {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, glsl);
		gl.compileShader(shader);

		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
			throw "Error in shader "+url+": "+gl.getShaderInfoLog(shader);

		return shader;
	});
}
