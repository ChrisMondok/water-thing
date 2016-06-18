function Boat(gl, water) {
	Actor.apply(this);

	this.water = water;

	vec3.set(this.scale, 15, 15, 15);

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
		vec3.set(mesh.position, 0, 0, 0.1);
		this.addComponent(mesh);
	}, this);

};

Boat.prototype.tick = function(timestamp) {
	var xy = [this.x, this.y];
	this.z = this.water.getZ(timestamp, xy);
	var normal = this.water.getNormal(timestamp, xy);
	//TODO: don't create a matrix here
	var mat4 = lookAt(normal, vec3.create(), vec3.fromValues(0, 1, 0));
	this.rotation = quat.fromMat3(quat.create(), 
		mat4[0], mat4[1], mat4[2],
		mat4[4], mat4[5], mat4[6],
		mat4[8], mat4[9], mat4[10],
		mat4[12], mat4[13], mat4[14]
	);
};
