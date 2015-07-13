Matrix.prototype.toArray = function() {
	return Array.prototype.concat.apply([], this.elements);
};

function logMatrix(m) {
	m.elements.forEach(function(row) {
		console.log(row);
	});
}
