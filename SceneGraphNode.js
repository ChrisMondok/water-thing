function SceneGraphNode() {
	this.components = [];
	this.position = Vector.create([0, 0, 0]);
	this.rotation = Vector.create([0, 0, 0]);
}

SceneGraphNode.prototype.walk = function(renderer, timestamp) {
	renderer.pushTransform(this.getTransformMatrix());

	this.draw(renderer, timestamp);
	for(var i = 0; i < this.components.length; i++)
		this.components[i].walk(renderer, timestamp);

	renderer.popTransform();
};

SceneGraphNode.prototype.draw = function(renderer, timestamp) {
};

SceneGraphNode.prototype.addComponent = function(c) {
	this.components.push(c);
};

SceneGraphNode.prototype.getTransformMatrix = function() {
	var self = this;

	function makeTranslation() {
		var x = self.position.elements[0];
		var y = self.position.elements[1];
		var z = self.position.elements[2];
		return Matrix.create([
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[x, y, z, 1]
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
