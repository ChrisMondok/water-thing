function Actor() {
	SceneGraphNode.apply(this);
}

Actor.prototype = Object.create(SceneGraphNode.prototype);

Actor.prototype.tick = function() {};

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
