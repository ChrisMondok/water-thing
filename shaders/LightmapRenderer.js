function LightmapRenderer(world, program) {
	Renderer.apply(this, arguments);
}

LightmapRenderer.prototype = Object.create(Renderer.prototype);
LightmapRenderer.constructor = LightmapRenderer;

LightmapRenderer.prototype.render = function(sceneRoot, camera, timestamp) {
	Renderer.prototype.render.apply(this, arguments);
	var gl = this.world.gl;

	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.uniformMatrix4fv(this.u_projection, false, this.lightMatrix.toArray());

	gl.uniform3fv(this.u_sun, this.world.sun.elements);
	gl.uniform3fv(this.u_ambient_light, new Float32Array([0.1, 0.1, 0.1]));
	gl.uniform3f(this.u_camera, camera.x, camera.y, camera.z);

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
