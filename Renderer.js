function Renderer(gl, program) {
	this.gl = gl;
	this.program = program;

	this.gl.enable(gl.DEPTH_TEST);
	this.gl.enable(gl.CULL_FACE);

	this.u_reflection = gl.getUniformLocation(program, 'u_reflection');

	this.u_sun = gl.getUniformLocation(program, 'u_sun');
	this.u_projection = gl.getUniformLocation(program, 'u_projection');
	this.u_ambient_light = gl.getUniformLocation(program, 'u_ambient_light');
	this.u_camera = gl.getUniformLocation(program, 'u_camera');

	this.u_transform = gl.getUniformLocation(program, 'u_transform');

	this.u_diffuse = gl.getUniformLocation(program, 'u_diffuse');
	this.u_emissive = gl.getUniformLocation(program, 'u_emissive');
	this.u_reflectivity = gl.getUniformLocation(program, 'u_reflectivity');
	this.u_shininess = gl.getUniformLocation(program, 'u_shininess');

	this.a_position = gl.getAttribLocation(program, 'a_position');
	this.gl.enableVertexAttribArray(this.a_position);

	this.a_normal = gl.getAttribLocation(program, 'a_normal');
	this.gl.enableVertexAttribArray(this.a_normal);

	this.sunPosition = Vector.create([1, 2, 5]).normalize();

	this.sceneRoot = new SceneGraphNode();

	this.transformStack = [Matrix.I(4)];
}

Renderer.prototype.render = function(camera, timestamp) {
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);

	this.gl.useProgram(this.program);

	this.gl.uniformMatrix4fv(this.u_projection, false, camera.getMatrix().toArray());

	this.gl.uniform3f(this.u_sun, this.sunPosition.e(1), this.sunPosition.e(2), this.sunPosition.e(3));
	this.gl.uniform3f(this.u_ambient_light, 0.1, 0.1, 0.1);
	this.gl.uniform3f(this.u_camera, camera.x, camera.y, camera.z);

	this.sceneRoot.walk(this, timestamp);
};

Renderer.prototype.pushTransform = function(transform) {
	//shift and unshift for easier peek
	this.transformStack.unshift(transform.x(this.transformStack[0]));
	this.gl.uniformMatrix4fv(this.u_transform, false, this.transformStack[0].toArray());
};

Renderer.prototype.popTransform = function() {
	this.transformStack.shift();
	this.gl.uniformMatrix4fv(this.u_transform, false, this.transformStack[0].toArray());
};

Renderer.prototype.setMaterial = function(material) {
	if(!material.isComplete())
		throw new Error("Material is incomplete!");
	this.gl.uniform3fv(this.u_diffuse, material.diffuse);
	this.gl.uniform3fv(this.u_emissive, material.emissive);
	this.gl.uniform1f(this.u_reflectivity, material.reflectivity);
	this.gl.uniform1f(this.u_shininess, material.shininess);
};

Renderer.prototype.draw = function(mode, vertBuffer, normalBuffer, numVerts) {
	this.gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
	this.gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0);

	this.gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	this.gl.vertexAttribPointer(this.a_normal, 3, gl.FLOAT, false, 0, 0);

	this.gl.cullFace(gl.BACK);
	this.gl.uniform1i(this.u_reflection, 0);

	//draw geometry
	this.gl.drawArrays(mode, 0, numVerts);

	//draw reflection
	if(true) {
		this.gl.enable(gl.STENCIL_TEST);
		this.gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
		this.gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
		this.gl.stencilMask(0xFF);

		this.gl.cullFace(gl.FRONT);
		this.gl.uniform1i(this.u_reflection, 1);
		this.gl.drawArrays(mode, 0, numVerts);
		this.gl.disable(gl.STENCIL_TEST);
	}
};

Renderer.prototype.drawWater = function(mode, vertBuffer, normalBuffer, numVerts) {
	this.gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
	this.gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0);

	this.gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	this.gl.vertexAttribPointer(this.a_normal, 3, gl.FLOAT, false, 0, 0);

	this.gl.cullFace(gl.BACK);
	this.gl.uniform1i(this.u_reflection, 0);

	this.gl.enable(gl.STENCIL_TEST);
	this.gl.stencilFunc(this.gl.NOTEQUAL, 1, 0xFF);
	this.gl.depthMask(false);
	this.gl.drawArrays(mode, 0, numVerts);
	this.gl.depthMask(true);
	this.gl.disable(gl.STENCIL_TEST);
};
