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

Array.prototype.unique = function() {
	return this.filter(function(value, index, array) {
		return array.indexOf(value) == index;
	});
};
