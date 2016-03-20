function Boat(gl, water) {
	Actor.apply(this);

	this.water = water;

	this.scale.setElements([15, 15, 15]);

	this.material = new DinghyMaterial();

	this.createComponents();
}
Boat.mesh = null;

Boat.prototype = Object.create(Actor.prototype);
Boat.prototype.constructor = Boat;

Boat.prototype.createComponents = function() {
	if(!Boat.mesh)
		throw new Error("Boat instantiated before mesh was set.");

	var dinghy = new StaticMeshComponent(Boat.mesh, this.material);
	dinghy.position.setElements([0, 0, 0.1]);
	this.addComponent(dinghy);
};

Boat.prototype.tick = function(timestamp) {
	var xy = [this.x, this.y];
	this.z = this.water.getZ(timestamp, xy);
	var normal = this.water.getNormal(timestamp, xy);
	this.rotation.setElements([normal[1], normal[0], 0]);
};

function DinghyMaterial(color) {
	Material.apply(this);
	this.diffuse = new Float32Array([0.85, 0.85, 0.1]);
	this.emissive = new Float32Array([0, 0, 0]);
}

DinghyMaterial.prototype = Object.create(Material.prototype);
DinghyMaterial.prototype.constructor = DinghyMaterial;

DinghyMaterial.prototype.specular = new Float32Array([0.15, 0.15, 0.15]);
DinghyMaterial.prototype.shininess = 9.8;
