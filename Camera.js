function Camera(gl, program) {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.pitch = 0;
	this.yaw = 0;
	this.roll = 0;
	this.fov = 48;
}

Camera.prototype.getMatrix = function() {
	var mats = [
		makePerspective(this.fov, 4/3, 1, 100),
		makeTranslation(this.x, this.y, this.z),
		makeYawMatrix(this.yaw),
		makeRollMatrix(this.roll),
		makePitchMatrix(this.pitch),
	];

	return mats.reduce(function(a, b) {
		return a.x(b);
	});
};

function makePerspective(fov, aspect, near, far) {
	var f = Math.tan(Math.PI * 0.5 - 0.5 * fov);

	return Matrix.create([
		[f / aspect, 0, 0, 0],
		[0, f, 0, 0],
		[0, 0, (near + far) / (near - far), -1],
		[0, 0, near * far / (near - far) * 2, 0]
	]);
}

function makeYawMatrix(yaw) { 
	var c = Math.cos(yaw);
	var s = Math.sin(yaw);
	return Matrix.create([
		[ c,  s,  0,  0],
		[-s,  c,  0,  0],
		[ 0,  0,  1,  0],
		[ 0,  0,  0,  1]
	]);
}

function makePitchMatrix(pitch) {
	var c = Math.cos(pitch);
	var s = Math.sin(pitch);

	return Matrix.create([
		[ 1,  0,  0,  0],
		[ 0,  c,  s,  0],
		[ 0, -s,  c,  0],
		[ 0,  0,  0,  1]
	]);
}

function makeRollMatrix(roll) {
	var c = Math.cos(roll);
	var s = Math.sin(roll);

	return Matrix.create([
		[ c,  0, -s,  0],
		[ 0,  1,  0,  0],
		[ s,  0,  c,  0],
		[ 0,  0,  0,  1]
	]);
}

function makeTranslation(x, y, z) {
	return Matrix.create([
		[ 1,  0,  0,  0],
		[ 0,  1,  0,  0],
		[ 0,  0,  1,  0],
		[ x,  y,  z,  1]
	]);
}

var camera = new Camera();
