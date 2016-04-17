//renders a texture to the screen
function TextureRenderer(world, program) {
	Renderer.apply(this, arguments);

	this.framebuffer = createFramebuffer(world.gl, world.lightmap);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	verts = new Float32Array([
		0, 0, 0,
		0, 1, 0,
		1, 1, 0,

		1, 1, 0,
		1, 0, 0,
		0, 0, 0

	]);

	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
}

TextureRenderer.prototype = Object.create(Renderer.prototype);
TextureRenderer.constructor = TextureRenderer;

TextureRenderer.prototype.render = function(sceneRoot, camera, timestamp) {
	if(!window.debug)
		return;
	Renderer.prototype.render.apply(this, arguments);
	var gl = this.world.gl;

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.disable(gl.DEPTH_TEST);
	gl.disable(gl.CULL_FACE);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.world.lightmap);
	gl.uniform1i(this.u_sampler, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.TRIANGLES, 0, 6);
	var e = gl.getError();
};

TextureRenderer.prototype.draw = function(mode, vertBuffer, normalBuffer, numVerts) {
	throw new Error("Not implemented");
};

TextureRenderer.vertex = "shaders/textureVertex.glsl";
TextureRenderer.fragment = "shaders/textureFragment.glsl";

