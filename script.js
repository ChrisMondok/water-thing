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

var drawables = [];

function start() {
	var canvas = document.querySelector('canvas');
	var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

	gl.enable(gl.DEPTH_TEST);

	window.gl = gl;


	getProgram(gl).then(function(program) {
		drawables.push(new Drawable(gl, program));
		window.program = program;
		requestAnimationFrame(draw);
	}).then(null, function(e) {
		console.error(e);
	});
}

function draw() {
	drawables.forEach(function(d) {
		d.draw();
	});
	requestAnimationFrame(draw);
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
