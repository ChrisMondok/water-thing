function Actor() {
	this.position = Vector.create([0, 0, 0]);
}

Object.defineProperty(Actor.prototype, 'x', {
	get: function() { return this.position.elements[0]; },
	set: function(x) { return this.position.elements[0] = x; }
});
Object.defineProperty(Actor.prototype, 'y', {
	get: function() { return this.position.elements[1]; },
	set: function(y) { return this.position.elements[1] = y; }
});
Object.defineProperty(Actor.prototype, 'z', {
	get: function() { return this.position.elements[2]; },
	set: function(z) { return this.position.elements[2] = z; }
});

Actor.prototype.getTransformMatrix = function() {
	return Matrix.create([
		[ 1,  0,  0,  0],
		[ 0,  1,  0,  0],
		[ 0,  0,  1,  0],
		[ this.position.elements.concat(1) ]
	]);
};
