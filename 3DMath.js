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

function orthoMatrix(width, height, depth) {
	if(height === undefined && depth === undefined)
		height = depth = width;

	return Matrix.create([
		[2/width, 0, 0, 0],
		[0, 2/height, 0, 0],
		[0, 0, -2/depth, 0],
		[0, 0, 0, 1]
	]);
}

function getUpVector(lookVector) {
	var declination = Math.asin(lookVector.e(3));

	var xyAngle = Math.PI + Math.atan2(lookVector.e(2), lookVector.e(1));

	return Vector.create([
		Math.cos(xyAngle) * Math.sin(declination),
		Math.sin(xyAngle) * Math.sin(declination),
		Math.cos(declination)
	]);
}

function eulerToRotation(eulerAngles) {
	function makeXRotation() {
		var c = Math.cos(eulerAngles.e(1));
		var s = Math.sin(eulerAngles.e(1));
		return Matrix.create([
			[1,  0, 0, 0],
			[0,  c, s, 0],
			[0, -s, c, 0],
			[0,  0, 0, 1]
		]);
	}

	function makeYRotation() {
		var c = Math.cos(eulerAngles.e(2));
		var s = Math.sin(eulerAngles.e(2));
		return Matrix.create([
			[c, 0, -s, 0],
			[0, 1,  0, 0],
			[s, 0,  c, 0],
			[0, 0,  0, 1]
		]);
	}

	function makeZRotation() {
		var c = Math.cos(eulerAngles.e(3));
		var s = Math.sin(eulerAngles.e(3));
		return Matrix.create([
			[ c, s, 0, 0],
			[-s, c, 0, 0],
			[ 0, 0, 1, 0],
			[ 0, 0, 0, 1]
		]);
	}

	return makeXRotation().x(makeYRotation()).x(makeZRotation());
}
