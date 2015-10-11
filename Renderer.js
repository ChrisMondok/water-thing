function Renderer(gl, program) {
	this.gl = gl;
	this.program = program;
	this.drawables = [];

	this.gl.enable(gl.DEPTH_TEST);
	//this.gl.enable(gl.CULL_FACE);

	this.u_sun = gl.getUniformLocation(program, 'u_sun');
	this.u_projection = gl.getUniformLocation(program, 'u_projection');
	this.u_ambient_light = gl.getUniformLocation(program, 'u_ambient_light');
	this.u_camera = gl.getUniformLocation(program, 'u_camera');

	this.u_translation = gl.getUniformLocation(program, 'u_translation');
	this.u_rotation = gl.getUniformLocation(program, 'u_rotation');

	this.u_diffuse = gl.getUniformLocation(program, 'u_diffuse');
	this.u_specular = gl.getUniformLocation(program, 'u_specular');
	this.u_ambient = gl.getUniformLocation(program, 'u_ambient');
	this.u_shininess = gl.getUniformLocation(program, 'u_shininess');

	this.a_position = gl.getAttribLocation(program, 'a_position');
	this.gl.enableVertexAttribArray(this.a_position);

	this.a_normal = gl.getAttribLocation(program, 'a_normal');
	this.gl.enableVertexAttribArray(this.a_normal);

	this.sunPosition = Vector.create([1, 2, 5]).normalize();
}

Renderer.prototype.render = function(camera, timestamp) {
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	this.gl.useProgram(this.program);

	this.gl.uniformMatrix4fv(this.u_projection, false, camera.getMatrix().toArray());

	this.gl.uniform3f(this.u_sun, this.sunPosition.e(1), this.sunPosition.e(2), this.sunPosition.e(3));
	this.gl.uniform3f(this.u_ambient_light, 0.1, 0.1, 0.1);
	this.gl.uniform3f(this.u_camera, camera.x, camera.y, camera.z);

	for(var i = 0; i < this.drawables.length; i++) {
		var d = this.drawables[i];
		this.gl.uniformMatrix4fv(this.u_rotation, false, d.getRotationMatrix().toArray());
		this.gl.uniformMatrix4fv(this.u_translation, false, d.getTranslationMatrix().toArray());
		this.drawables[i].draw(this, timestamp);
	}
};

Renderer.prototype.setMaterial = function(material) {
	if(!material.isComplete())
		throw new Error("Material is incomplete!");
	this.gl.uniform3fv(this.u_diffuse, material.diffuse);
	this.gl.uniform3fv(this.u_specular, material.specular);
	this.gl.uniform3fv(this.u_ambient, material.ambient);
	this.gl.uniform1f(this.u_shininess, material.shininess);
};

Renderer.prototype.drawTriangleStrip= function(vertBuffer, normalBuffer, numVerts) {
	this.gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
	this.gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0);

	this.gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	this.gl.vertexAttribPointer(this.a_normal, 3, gl.FLOAT, false, 0, 0);

	this.gl.drawArrays(gl.TRIANGLE_STRIP, 0, numVerts);
};
