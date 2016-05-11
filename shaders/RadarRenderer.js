function RadarRenderer(world, program) {
	Renderer.apply(this, arguments);

	this.u_projection = gl.getUniformLocation(program, 'u_projection');
	this.u_transform = gl.getUniformLocation(program, 'u_transform');

	this.u_camera = gl.getUniformLocation(program, 'u_camera');

	this.u_pulse_radius = gl.getUniformLocation(program, 'u_pulse_radius');

	this.a_position = gl.getAttribLocation(program, 'a_position');

	this.cameraPosition = new Float32Array(3);
}

RadarRenderer.prototype = Object.create(Renderer.prototype);
RadarRenderer.constructor = RadarRenderer;

RadarRenderer.prototype.render = function(sceneRoot, camera, timestamp) {
	Renderer.prototype.render.apply(this, arguments);

	var gl = this.world.gl;

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	gl.disable(gl.DEPTH_TEST);
	gl.disable(gl.CULL_FACE);
	gl.enable(gl.BLEND);
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

	gl.uniformMatrix4fv(this.u_projection, false, camera.getMatrix().toArray());

	gl.uniform3f(this.u_camera, camera.x, camera.y, camera.z);

	gl.uniform1f(this.u_pulse_radius, (timestamp / 7) % 700);

	sceneRoot.walk(this, timestamp);
};

RadarRenderer.prototype.setMaterial = function(material) {
	Renderer.prototype.setMaterial.apply(this, arguments);
};

RadarRenderer.prototype.draw = function(mode, vertBuffer, normalBuffer, numVerts) {
	var gl = this.world.gl;
	gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
	gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

	gl.drawArrays(mode, 0, numVerts);
};

RadarRenderer.vertex = "shaders/radarVertex.glsl";
RadarRenderer.fragment = "shaders/radarFragment.glsl";
