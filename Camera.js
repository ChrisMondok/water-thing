function Camera(gl, program) {
	Actor.apply(this);

	this.pitch = 0;
	this.yaw = 0;
	this.roll = 0;
	this.fov = Math.degToRad(60);
	this.near = 1;
	this.far = 1000;

	this.position.setElements([0, 50, 50]);
	this.target = Vector.create([0, 0, 0]);
	this.up = Vector.create([0, 0, 1]);
}

Camera.prototype = Object.create(Actor.prototype);

(function() {
	Camera.prototype.getMatrix = function() {
		var cameraMatrix = lookAt(this.position, this.target, this.up);
		var viewMatrix = cameraMatrix.inverse();
		return viewMatrix.x(perspectiveMatrix(this.fov, 4/3, this.near, this.far));
		//return viewMatrix.x(orthoMatrix(400, 300, 1000));
	};
})();
