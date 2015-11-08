function Buoy(gl, water, color) {
	Actor.apply(this);

	this.water = water;
	this.material = new BuoyMaterial(color);
	this.lightMaterial = new LightMaterial(color);

	this.addComponent(new CylinderComponent(this.material, this.height, this.radius, this.facetRes));
	var light = new CylinderComponent(this.lightMaterial, 8, this.radius / 4, 16);
	light.position.setElements([0, 0, this.height/2 + 4]);
	this.addComponent(light);
}

Buoy.prototype = Object.create(Actor.prototype);
Buoy.prototype.constructor = Buoy;

Buoy.prototype.radius = 15;
Buoy.prototype.facetRes = 24;
Buoy.prototype.height = 50;

Buoy.prototype.tick = function(timestamp) {
	var xy = [this.x, this.y];
	this.z = this.water.getZ(timestamp, xy);
	var normal = this.water.getNormal(timestamp, xy);
	this.rotation.setElements([normal[1], normal[0], 0]);
};

Buoy.prototype.draw = function(renderer, timestamp) {
	var l = (timestamp/1000) % 1 < 0.25 ? 1 : 0;
	this.lightMaterial.emissive[0] = l;
	this.lightMaterial.emissive[1] = l;
	this.lightMaterial.emissive[2] = l;
	Actor.prototype.draw.apply(this, arguments);
};

function BuoyMaterial(color) {
	Material.apply(this);
	this.diffuse = new Float32Array(color);
	this.emissive = new Float32Array([0, 0, 0]);
}

BuoyMaterial.prototype = Object.create(Material.prototype);
BuoyMaterial.prototype.constructor = BuoyMaterial;

BuoyMaterial.prototype.reflectivity = 0.3;
BuoyMaterial.prototype.shininess = 6;

function LightMaterial(color) {
	Material.apply(this);
	this.diffuse = new Float32Array([0.2, 0.2, 0.2]);
	this.emissive = new Float32Array(color);
}

LightMaterial.prototype = Object.create(Material.prototype);
LightMaterial.prototype.constructor = LightMaterial;

LightMaterial.prototype.reflectivity = 0.4;
LightMaterial.prototype.shininess = 12;
