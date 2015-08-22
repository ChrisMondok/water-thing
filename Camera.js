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
	};

	function lookAt(position, target, up) {
		var zAxis = position.subtract(target).normalize();
		var xAxis = up.cross(zAxis);
		var yAxis = zAxis.cross(xAxis);

		return Matrix.create([
			xAxis.elements.concat(0),
			yAxis.elements.concat(0),
			zAxis.elements.concat(0),
			position.elements.concat(1)
		]);
	}

	function perspectiveMatrix(fov, aspect, near, far) {
		var f = Math.tan(Math.PI * 0.5 - 0.5 * fov);

		return Matrix.create([
			[f / aspect, 0, 0, 0],
			[0, f, 0, 0],
			[0, 0, (near + far) / (near - far), -1],
			[0, 0, near * far / (near - far) * 2, 0]
		]);
	}

	function translateMatrix(x, y, z) {
		return Matrix.create([
			[ 1,  0,  0,  0],
			[ 0,  1,  0,  0],
			[ 0,  0,  1,  0],
			[ x,  y,  z,  1]
		]);
	}

	function yawMatrix(yaw) { 
		var c = Math.cos(yaw);
		var s = Math.sin(yaw);
		return Matrix.create([
			[ c,  s,  0,  0],
			[-s,  c,  0,  0],
			[ 0,  0,  1,  0],
			[ 0,  0,  0,  1]
		]);
	}

	function pitchMatrix(pitch) {
		var c = Math.cos(pitch);
		var s = Math.sin(pitch);

		return Matrix.create([
			[ 1,  0,  0,  0],
			[ 0,  c,  s,  0],
			[ 0, -s,  c,  0],
			[ 0,  0,  0,  1]
		]);
	}

	function rollMatrix(roll) {
		var c = Math.cos(roll);
		var s = Math.sin(roll);

		return Matrix.create([
			[ c,  0, -s,  0],
			[ 0,  1,  0,  0],
			[ s,  0,  c,  0],
			[ 0,  0,  0,  1]
		]);
	}

})();
