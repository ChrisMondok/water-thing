Matrix.prototype.toArray = function() {
	return Array.prototype.concat.apply([], this.elements);
};

Vector.prototype.magnitude = function() {
	return this.distanceFrom(Vector.Zero(this.elements.length));
};

Vector.prototype.normalize = function() {
	var magnitude = this.magnitude();
	return this.map(function(value) {
		return magnitude > Sylvester.precision ? value / magnitude : 0;
	});
};

Array.prototype.flatten = function() {
	//yeah, this is ugly, but it's much faster than array.reduce(concat)
	var count = this.reduce(function(count, a) {
		return count + a.length;
	}, 0);

	var output = new Array(count);

	var o = 0;
	for(var iA = 0; iA < this.length; iA++)
		for(var i = 0; i < this[iA].length; i++)
			output[o++] = this[iA][i];

	return output;
};

Math.degToRad = Math.degToRad || function degToRad(deg) {
	return deg / 180 * Math.PI;
};

Math.radToDeg = Math.radToDeg || function radToDeg(rad) {
	return rad / Math.PI * 180;
};
