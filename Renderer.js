//There should be a 1:1 relationship between renderers and programs.
//Perhaps this is a poor name.
function Renderer(world, program) {
	this.world = world;
	this.program = program;

	//TODO: these should be moved into draw or something
	//      so that multiple renderers won't break each other
	world.gl.enable(gl.DEPTH_TEST);
	world.gl.enable(gl.CULL_FACE);

	this.u_sun = gl.getUniformLocation(program, 'u_sun');
	this.u_projection = gl.getUniformLocation(program, 'u_projection');
	this.u_ambient_light = gl.getUniformLocation(program, 'u_ambient_light');
	this.u_camera = gl.getUniformLocation(program, 'u_camera');

	this.u_transform = gl.getUniformLocation(program, 'u_transform');

	this.u_diffuse = gl.getUniformLocation(program, 'u_diffuse');
	this.u_emissive = gl.getUniformLocation(program, 'u_emissive');
	this.u_specular = gl.getUniformLocation(program, 'u_specular');
	this.u_shininess = gl.getUniformLocation(program, 'u_shininess');

	this.a_position = gl.getAttribLocation(program, 'a_position');
	world.gl.enableVertexAttribArray(this.a_position);

	this.a_normal = gl.getAttribLocation(program, 'a_normal');
	world.gl.enableVertexAttribArray(this.a_normal);

	this.sunPosition = Vector.create([1, 2, 5]).normalize();

	this.transformStack = [Matrix.I(4)];
}

Renderer.prototype.render = function(sceneRoot, camera, timestamp) {
	var gl = this.world.gl;
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.useProgram(this.program);

	gl.uniformMatrix4fv(this.u_projection, false, camera.getMatrix().toArray());

	gl.uniform3f(this.u_sun, this.sunPosition.e(1), this.sunPosition.e(2), this.sunPosition.e(3));
	gl.uniform3f(this.u_ambient_light, 0.1, 0.1, 0.1);
	gl.uniform3f(this.u_camera, camera.x, camera.y, camera.z);

	sceneRoot.walk(this, timestamp);
};

Renderer.prototype.pushTransform = function(transform) {
	//shift and unshift for easier peek
	this.transformStack.unshift(transform.x(this.transformStack[0]));
	this.world.gl.uniformMatrix4fv(this.u_transform, false, this.transformStack[0].toArray());
};

Renderer.prototype.popTransform = function() {
	this.transformStack.shift();
	this.world.gl.uniformMatrix4fv(this.u_transform, false, this.transformStack[0].toArray());
};

Renderer.prototype.setMaterial = function(material) {
	var gl = this.world.gl;
	if(!material.isComplete())
		throw new Error("Material is incomplete!");
	gl.uniform3fv(this.u_diffuse, material.diffuse);
	gl.uniform3fv(this.u_emissive, material.emissive);
	gl.uniform3fv(this.u_specular, material.specular);
	gl.uniform1f(this.u_shininess, material.shininess);
};

Renderer.prototype.draw = function(mode, vertBuffer, normalBuffer, numVerts) {
	var gl = this.world.gl;
	gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
	gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.vertexAttribPointer(this.a_normal, 3, gl.FLOAT, false, 0, 0);

	gl.drawArrays(mode, 0, numVerts);
};
