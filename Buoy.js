function Buoy(gl, water) {
	Actor.apply(this);

	this.water = water;

	this.scale.setElements([15, 15, 15]);

	this.createComponents();
}
Buoy.meshes = null;

Buoy.prototype = Object.create(Actor.prototype);
Buoy.prototype.constructor = Buoy;

Buoy.prototype.period= 2000;
Buoy.prototype.phase = 0;

Buoy.prototype.createComponents = function() {
	if(!Buoy.meshes)
		throw new Error("Buoy instantiated before mesh was set.");
	
	var materials = Buoy.meshes.map(function(m) { return m.material; }).unique();

	this.lampMaterial = materials.filter(function(mat) {
		return mat.name == 'Lamp';
	})[0].clone();

	Buoy.meshes.forEach(function(m) {
		if(isLampMesh(m)) {
			m = Object.create(m);
			m.material = this.lampMaterial;
		}
		var mesh = new StaticMeshComponent(m);
		mesh.position.setElements([0, 0, 0.1]);
		this.addComponent(mesh);
	}, this);

	Buoy.meshes.filter(isLampMesh).forEach(function(m) {
	}, this);

	function isLampMesh(mesh) {
		return mesh.name == 'Lamp_Cone';
	}
};

Buoy.prototype.tick = function(timestamp) {
	var xy = [this.x, this.y];
	this.z = this.water.getZ(timestamp, xy);
	var normal = this.water.getNormal(timestamp, xy);
	this.rotation.setElements([normal[1], normal[0], 0]);
	this.updateLampMaterial(timestamp);
};

Buoy.prototype.updateLampMaterial = function(timestamp) {
	var l = (timestamp/this.period + this.phase) % 1 < 0.25 ? 1 : 0;
	this.lampMaterial.emissive[0] = l * 1;
	this.lampMaterial.emissive[1] = l * 0;
	this.lampMaterial.emissive[2] = l * 0;
};
