Matrix.prototype.toArray = function() {
	return Array.prototype.concat.apply([], this.elements);
};

Vector.prototype.magnitude = function() {
	return this.distanceFrom(Vector.Zero(this.elements.length));
};

Vector.prototype.normalize = function() {
	var magnitude = this.magnitude();
	return this.map(function(value) {
		return magnitude > 0.00001 ? value / magnitude : 0;
	});
};
