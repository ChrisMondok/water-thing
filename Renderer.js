//There should be a 1:1 relationship between renderers and programs.
//Perhaps this is a poor name.
function Renderer(world, program) {
	this.world = world;
	this.program = program;

	this.a_position = gl.getAttribLocation(program, 'a_position');
	world.gl.enableVertexAttribArray(this.a_position);

	this.transformMatrix = mat4.identity(mat4.create())

	this.lightMatrix = mat4.create()
}

Renderer.prototype.render = function(sceneRoot, camera, timestamp) {
	this.world.gl.useProgram(this.program);

	//TODO: don't create a new vec3 here
	var n_sun = vec3.normalize(vec3.create(), world.sun)

	this.lightMatrix = lookAt(n_sun, camera.target, getUpVector(n_sun))

	mat4.invert(this.lightMatrix, this.lightMatrix)

	mat4.multiply(this.lightMatrix, orthoMatrix(vec3.distance(camera.target, camera.position) * 2), this.lightMatrix)
};

Renderer.prototype.transform = function(transform) {
	mat4.multiply(this.transformMatrix, transform, this.transformMatrix);
	this.world.gl.uniformMatrix4fv(this.u_transform, false, this.transformMatrix);
};

Renderer.prototype.setMaterial = function(material) {
	var gl = this.world.gl;
	if(!material.isComplete())
		throw new Error("Material is incomplete!");
};

Renderer.prototype.draw = function(mode, vertBuffer, normalBuffer, numVerts) {
	throw new Error("Override me");
};

Renderer.create = function(type, world) {
	return Promise.all([
		getShader(gl, type.vertex, gl.VERTEX_SHADER),
		getShader(gl, type.fragment, gl.FRAGMENT_SHADER)
	]).then(function(shaders) {
		var program = gl.createProgram();
		shaders.forEach(function(shader) {
			gl.attachShader(program, shader);
		});
		return program;
	}).then(function(program) {
		gl.linkProgram(program);
		return program;
	}).then(function(program) {
		if(!gl.getProgramParameter(program, gl.LINK_STATUS))
			throw "Error in program: "+gl.getProgramInfoLog(program);
		return program;
	}).then(function(program) {
		return new type(world, program);
	});

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
};
