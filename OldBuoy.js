function OldBuoy(gl, water, color) {
	Actor.apply(this);

	this.water = water;
	this.createComponents(color);

	this.scale.setElements([30, 30, 30]);
}

OldBuoy.prototype = Object.create(Actor.prototype);
OldBuoy.prototype.constructor = OldBuoy;

OldBuoy.prototype.radius = 30;
OldBuoy.prototype.facetRes = 24;
OldBuoy.prototype.height = 25;

OldBuoy.prototype.createComponents = function(color) {
	this.material = new OldBuoyMaterial(color);

	var base = new CylinderComponent(this.material, this.facetRes);
	base.scale.setElements([1, 1, 0.5]);
	this.addComponent(base);

	var numLegs = 4;
	for(var i = 0; i < numLegs; i++) {
		var angle = 2 * Math.PI * (i- 0.5) / numLegs;
		var x = Math.cos(angle) * 0.3;
		var y = Math.sin(angle) * 0.3;

		var leg = new PrismComponent(this.material, 3);
		leg.scale.setElements([0.05, 0.05, 1]);
		leg.position.setElements([x, y, 0.75]);
		leg.rotation.setElements([0, -0.1, angle]);
		this.addComponent(leg);

		x = Math.cos(angle) * 0.25;
		y = Math.sin(angle) * 0.25;
		var topBrace = new PrismComponent(this.material, 3);
		topBrace.scale.setElements([0.05, 0.05, 0.5]);
		topBrace.position.setElements([x, y, 1.5]);
		this.addComponent(topBrace);
	}

	var middleCylinder = new CylinderComponent(this.material, this.facetRes);
	middleCylinder.position.setElements([0, 0, 1.25]);
	middleCylinder.scale.setElements([0.6, 0.6, 0.05]);
	this.addComponent(middleCylinder);

	var topCylinder = new CylinderComponent(this.material, this.facetRes);
	topCylinder.position.setElements([0, 0, 1.75]);
	topCylinder.scale.setElements([0.6, 0.6, 0.05]);
	this.addComponent(topCylinder);

	var panel1 = new PrismComponent(this.material, 2);
	panel1.scale.setElements([0.35, 0.35, 0.5]);
	panel1.position.setElements([0, 0, 1.5]);
	panel1.rotation.setElements([0, 0, Math.PI/4]);
	this.addComponent(panel1);

	var panel2 = new PrismComponent(this.material, 2);
	panel2.scale.setElements([0.35, 0.35, 0.5]);
	panel2.position.setElements([0, 0, 1.5]);
	panel2.rotation.setElements([0, 0, 3 * Math.PI/4]);
	this.addComponent(panel2);

	var light = new OldBuoyLight(color);
	light.position.setElements([0, 0, 1.75]);
	this.addComponent(light);
};

OldBuoy.prototype.tick = function(timestamp) {
	var xy = [this.x, this.y];
	this.z = this.water.getZ(timestamp, xy);
	var normal = this.water.getNormal(timestamp, xy);
	this.rotation.setElements([normal[1], normal[0], 0]);
};

function OldBuoyMaterial(color) {
	Material.apply(this);
	this.diffuse = new Float32Array(color);
	this.emissive = new Float32Array([0, 0, 0]);
}

OldBuoyMaterial.prototype = Object.create(Material.prototype);
OldBuoyMaterial.prototype.constructor = OldBuoyMaterial;

OldBuoyMaterial.prototype.specular = new Float32Array([0.3, 0.3, 0.3]);
OldBuoyMaterial.prototype.shininess = 6;

function OldBuoyLight(color) {
	SceneGraphNode.apply(this, arguments);
	this.color = color.slice().normalize();

	this.material = new Material();
	this.material.specular = new Float32Array([0.4, 0.4, 0.4]);
	this.material.shininess = 12;
	this.material.diffuse = new Float32Array([color[0], color[1], color[2]]);
	this.material.emissive = new Float32Array([0, 0, 0]);

	this.scale.setElements([0.1, 0.1, 0.1]);

	var base = new CylinderComponent(new OldBuoyMaterial([0.5, 0.5, 0.5]), 8);
	base.position.setElements([0, 0, 0.5]);
	this.addComponent(base);

	var light = new CylinderComponent(this.material, 8);
	light.position.setElements([0, 0, 1.5]);
	this.addComponent(light);
}

OldBuoyLight.prototype = Object.create(SceneGraphNode.prototype);
OldBuoyLight.prototype.constructor = OldBuoyLight;

OldBuoyLight.prototype.draw = function(renderer, timestamp) {
	SceneGraphNode.prototype.draw.apply(this, arguments);
	var l = (timestamp/1000) % 1 < 0.25 ? 1 : 0;
	this.material.emissive[0] = l * this.color[0];
	this.material.emissive[1] = l * this.color[1];
	this.material.emissive[2] = l * this.color[2];
};
