function Camera(gl, program) {
	Actor.apply(this);

	this.fov = Math.degToRad(60);
	this.near = 1;
	this.far = 1000;

	vec3.set(this.position, 0, 50, 50);
	this.target = vec3.create();
	this.up = vec3.fromValues(0, 0, 1);
}

Camera.prototype = Object.create(Actor.prototype);

(function() {
	Camera.prototype.getMatrix = function() {
		var matrix = lookAt(this.position, this.target, this.up);
		mat4.invert(matrix, matrix)
		mat4.multiply(matrix, perspectiveMatrix(this.fov, 4/3, this.near, this.far), matrix)
		return matrix
	};
})();
