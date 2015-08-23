function Actor() {
	Actor2D.apply(this);
	this.position = Vector.create([0, 0, 0]);
	this.rotation = Vector.create([0, 0, 0]);
}

Actor.prototype = Object.create(Actor2D.prototype);

Object.defineProperty(Actor.prototype, 'z', {
	get: function() { return this.position.elements[2]; },
	set: function(z) { return this.position.elements[2] = z; }
});

Object.defineProperty(Actor.prototype, 'pitch', {
	get: function() { return this.rotation.elements[0]; },
	set: function(pitch) { return this.rotation.elements[0] = pitch; }
});

Object.defineProperty(Actor.prototype, 'yaw', {
	get: function() { return this.rotation.elements[2]; },
	set: function(yaw) { return this.rotation.elements[2] = yaw; }
});

Object.defineProperty(Actor.prototype, 'roll', {
	get: function() { return this.rotation.elements[1]; },
	set: function(roll) { return this.rotation.elements[1] = roll; }
});

Actor.prototype.getVector2D = function() {
	return Vector.create([this.x, this.y]);
};

Actor.prototype.getTransformMatrix = function() {
	var self = this;

	function makeTranslation() {
		return Matrix.create([
				[ 1,  0,  0,  0],
				[ 0,  1,  0,  0],
				[ 0,  0,  1,  0],
				self.position.elements.concat(1)
		]);
	}

	function makeXRotation() {
		var c = Math.cos(self.rotation.e(1));
		var s = Math.sin(self.rotation.e(1));
		return Matrix.create([
			[1,  0, 0, 0],
			[0,  c, s, 0],
			[0, -s, c, 0],
			[0,  0, 0, 1]
		]);
	}

	function makeYRotation() {
		var c = Math.cos(self.rotation.e(2));
		var s = Math.sin(self.rotation.e(2));
		return Matrix.create([
			[c, 0, -s, 0],
			[0, 1,  0, 0],
			[s, 0,  c, 0],
			[0, 0,  0, 1]
		]);
	}

	function makeZRotation() {
		var c = Math.cos(self.rotation.e(3));
		var s = Math.sin(self.rotation.e(3));
		return Matrix.create([
			[ c, s, 0, 0],
			[-s, c, 0, 0],
			[ 0, 0, 1, 0],
			[ 0, 0, 0, 1]
		]);
	}

	return makeXRotation().x(makeYRotation()).x(makeZRotation()).x(makeTranslation());
};

function Actor2D() {
	this.position = Vector.create([0, 0]);
}

Object.defineProperty(Actor2D.prototype, 'x', {
	get: function() { return this.position.elements[0]; },
	set: function(x) { return this.position.elements[0] = x; }
});
Object.defineProperty(Actor2D.prototype, 'y', {
	get: function() { return this.position.elements[1]; },
	set: function(y) { return this.position.elements[1] = y; }
});

Actor2D.prototype.tick = function(dt) { };
