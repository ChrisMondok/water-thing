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
