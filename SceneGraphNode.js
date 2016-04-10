function SceneGraphNode() {
	this.components = [];
	this.position = Vector.create([0, 0, 0]);
	this.rotation = Matrix.I(4);
	this.scale = Vector.create([1, 1, 1]);
}

SceneGraphNode.prototype.walk = function(renderer, timestamp) {
	renderer.pushTransform(this.getTransformMatrix());

	this.draw(renderer, timestamp);
	for(var i = 0; i < this.components.length; i++)
		this.components[i].walk(renderer, timestamp);

	renderer.popTransform();
};

SceneGraphNode.prototype.draw = function(renderer, timestamp) {};

SceneGraphNode.prototype.addComponent = function(c) {
	this.components.push(c);
};

SceneGraphNode.prototype.getTransformMatrix = function() {
	var self = this;

	function makeScale() {
		var sx = self.scale.elements[0];
		var sy = self.scale.elements[1];
		var sz = self.scale.elements[2];
		return Matrix.create([
			[sx, 0, 0, 0],
			[0, sy, 0, 0],
			[0, 0, sz, 0],
			[0, 0, 0,  1]
		]);
	}

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

	return makeScale().x(this.rotation).x(makeTranslation());
};
