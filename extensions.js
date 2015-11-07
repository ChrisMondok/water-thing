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
	var i = 0, count = 0;
	for(i = 0; i < this.length; i++)
		count += this[i].length;

	var output = new Array(count);

	var o = 0;
	for(var iA = 0; iA < this.length; iA++) {
		for(i = 0; i < this[iA].length; i++)
			output[o++] = this[iA][i];
	}

	return output;
};

Math.degToRad = Math.degToRad || function degToRad(deg) {
	return deg / 180 * Math.PI;
};

Math.radToDeg = Math.radToDeg || function radToDeg(rad) {
	return rad / Math.PI * 180;
};

Array.prototype.normalize = function() {
	var precision = 0.000001;
	var magnitude = this.magnitude();
	for(var i = 0; i < this.length; i++)
		this[i] = magnitude > precision ? this[i] / magnitude : 0;
	return this;
};

Array.prototype.magnitude = function() {
	var sum = 0;
	for(var i = 0; i < this.length; i++)
		sum += Math.pow(this[i], 2);
	
	return Math.sqrt(sum);
};

Array.prototype.add = function(other) {
	for(var i = 0; i < this.length; i++)
		this[i] += other[i];
	return this;
};

Array.prototype.subtract = function(other) {
	for(var i = 0; i < this.length; i++)
		this[i] -= other[i];
	return this;
};
