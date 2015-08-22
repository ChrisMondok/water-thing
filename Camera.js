function Camera(gl, program) {
	this.x = 0;
	this.y = 0;
	this.z = -100;
	this.pitch = 0;
	this.yaw = 0;
	this.roll = 0;
	this.fov = 60;
	this.near = 1;
	this.far = 1000;
}


(function() {
	Camera.prototype.getMatrix = function() {
		var mats = [
			translateMatrix(this.x, this.y, this.z),
			yawMatrix(this.yaw),
			rollMatrix(this.roll),
			pitchMatrix(this.pitch),
			perspectiveMatrix(this.fov, 4/3, this.near, this.far)
		];

		return mats.reduce(function(a, b) {
			return a.x(b);
		});
	};

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
var camera = new Camera();
