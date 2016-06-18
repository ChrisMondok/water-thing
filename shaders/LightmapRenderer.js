function LightmapRenderer(world, program) {
	Renderer.apply(this, arguments);

	this.u_projection = gl.getUniformLocation(program, 'u_projection');
	this.u_transform = gl.getUniformLocation(program, 'u_transform');

	this.framebuffer = createFramebuffer(world.gl, world.lightmap, world.lightmap.width, world.lightmap.height);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

LightmapRenderer.prototype = Object.create(Renderer.prototype);
LightmapRenderer.constructor = LightmapRenderer;

LightmapRenderer.prototype.render = function(sceneRoot, camera, timestamp) {
	Renderer.prototype.render.apply(this, arguments);
	var gl = this.world.gl;

	gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
	gl.viewport(0, 0, this.world.lightmap.width, this.world.lightmap.height);

	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.uniformMatrix4fv(this.u_projection, false, this.lightMatrix);

	sceneRoot.walk(this, timestamp);
};

LightmapRenderer.prototype.draw = function(mode, vertBuffer, normalBuffer, numVerts) {
	var gl = this.world.gl;
	gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
	gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0);

	gl.drawArrays(mode, 0, numVerts);
};

LightmapRenderer.vertex = "shaders/lightmapVertex.glsl";
LightmapRenderer.fragment = "shaders/lightmapFragment.glsl";
