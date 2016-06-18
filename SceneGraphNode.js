function SceneGraphNode() {
	this.components = []
	this.position = vec3.create()
	this.rotation = quat.create()
	this.scale = vec3.create()
	this.scale.set([1, 1, 1])

	this.transformMatrix = mat4.create()
}

SceneGraphNode.prototype.walk = function(renderer, timestamp) {
	this.updateTransformMatrix()
	renderer.pushTransform(this.transformMatrix)

	this.draw(renderer, timestamp);
	for(var i = 0; i < this.components.length; i++)
		this.components[i].walk(renderer, timestamp)

	renderer.popTransform()
};

SceneGraphNode.prototype.draw = function(renderer, timestamp) {};

SceneGraphNode.prototype.addComponent = function(c) {
	this.components.push(c);
};

SceneGraphNode.prototype.updateTransformMatrix = function() {
	mat4.fromRotationTranslationScale(this.transformMatrix, this.rotation, this.position, this.scale)
};
