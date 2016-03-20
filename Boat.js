function Boat(gl, water) {
	Actor.apply(this);

	this.water = water;

	this.scale.setElements([15, 15, 15]);

	this.createComponents();
}
Boat.meshes = null;

Boat.prototype = Object.create(Actor.prototype);
Boat.prototype.constructor = Boat;

Boat.prototype.createComponents = function() {
	if(!Boat.meshes)
		throw new Error("Boat instantiated before mesh was set.");

	Boat.meshes.forEach(function(m) {
		var mesh = new StaticMeshComponent(m);
		mesh.position.setElements([0, 0, 0.1]);
		this.addComponent(mesh);
	}, this);

};

Boat.prototype.tick = function(timestamp) {
	var xy = [this.x, this.y];
	this.z = this.water.getZ(timestamp, xy);
	var normal = this.water.getNormal(timestamp, xy);
	this.rotation.setElements([normal[1], normal[0], 0]);
};
