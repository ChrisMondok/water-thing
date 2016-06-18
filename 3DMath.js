function lookAt(position, target, up) {
	//TODO: don't create so many vec3s.
	
	var z = vec3.subtract(vec3.create(), position, target)
	vec3.normalize(z, z)
	var x = vec3.cross(vec3.create(), up, z)
	var y = vec3.cross(vec3.create(), z, x)

	return mat4.fromValues(
		x[0], x[1], x[2], 0,
		y[0], y[1], y[2], 0,
		z[0], z[1], z[2], 0,
		position[0], position[1], position[2], 1
	);

}

function perspectiveMatrix(fov, aspect, near, far) {
	var f = Math.tan(Math.PI * 0.5 - 0.5 * fov);

	return mat4.fromValues(
		f/aspect, 0, 0, 0,
		0, f, 0, 0,
		0, 0, (near + far) / (near - far), -1,
		0, 0, near * far / (near - far) * 2, 0
	);

}

function orthoMatrix(width, height, depth) {
	if(height === undefined && depth === undefined)
		height = depth = width;

	return mat4.fromValues(
		2/width, 0, 0, 0,
		0, 2/height, 0, 0,
		0, 0, -2/depth, 0,
		0, 0, 0, 1
	);
}

function getUpVector(lookVector) {
	var declination = Math.asin(lookVector[2]);

	var xyAngle = Math.PI + Math.atan2(lookVector[1], lookVector[0]);

	return vec3.fromValues(
		Math.cos(xyAngle) * Math.sin(declination),
		Math.sin(xyAngle) * Math.sin(declination),
		Math.cos(declination)
	)
}

function eulerToRotation(eulerAngles) {
	return mat4.rotateZ(mat4.rotateY(mat4.fromXRotation(eulerAngles[0]), eulerAngles[1]), eulerAngles[2])
}
