function SceneRenderer(world, program) {
	Renderer.apply(this, arguments);

	this.u_projection = gl.getUniformLocation(program, 'u_projection');
	this.u_transform = gl.getUniformLocation(program, 'u_transform');

	this.u_sun = gl.getUniformLocation(program, 'u_sun');
	this.u_ambient_light = gl.getUniformLocation(program, 'u_ambient_light');
	this.u_camera = gl.getUniformLocation(program, 'u_camera');

	this.u_diffuse = gl.getUniformLocation(program, 'u_diffuse');
	this.u_emissive = gl.getUniformLocation(program, 'u_emissive');
	this.u_specular = gl.getUniformLocation(program, 'u_specular');
	this.u_shininess = gl.getUniformLocation(program, 'u_shininess');

	this.u_lightmap_sampler = gl.getUniformLocation(program, 'u_lightmap_sampler');
	this.u_sun_projection = gl.getUniformLocation(program, 'u_sun_projection');

	this.a_normal = gl.getAttribLocation(program, 'a_normal');
}

SceneRenderer.prototype = Object.create(Renderer.prototype);
SceneRenderer.constructor = SceneRenderer;

SceneRenderer.prototype.render = function(sceneRoot, camera, timestamp) {
	Renderer.prototype.render.apply(this, arguments);

	var gl = this.world.gl;

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.enableVertexAttribArray(this.a_normal);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.world.lightmap);
	gl.uniform1i(this.u_lightmap_sampler, 0);

	gl.uniformMatrix4fv(this.u_projection, false, camera.getMatrix().toArray());

	gl.uniformMatrix4fv(this.u_sun_projection, false, this.lightMatrix.toArray());

	gl.uniform3fv(this.u_sun, this.world.sun.elements);
	gl.uniform3fv(this.u_ambient_light, new Float32Array([0.1, 0.1, 0.1]));
	gl.uniform3f(this.u_camera, camera.x, camera.y, camera.z);

	sceneRoot.walk(this, timestamp);
};

SceneRenderer.prototype.setMaterial = function(material) {
	Renderer.prototype.setMaterial.apply(this, arguments);
	gl.uniform3fv(this.u_diffuse, material.diffuse);
	gl.uniform3fv(this.u_emissive, material.emissive);
	gl.uniform3fv(this.u_specular, material.specular);
	gl.uniform1f(this.u_shininess, material.shininess);
};

SceneRenderer.prototype.draw = function(mode, vertBuffer, normalBuffer, numVerts) {
	var gl = this.world.gl;
	gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
	gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.vertexAttribPointer(this.a_normal, 3, gl.FLOAT, false, 0, 0);

	gl.drawArrays(mode, 0, numVerts);
};

SceneRenderer.vertex = "shaders/sceneVertex.glsl";
SceneRenderer.fragment = "shaders/sceneFragment.glsl";
