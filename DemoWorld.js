function DemoWorld() {
	World.apply(this, arguments);
}

DemoWorld.prototype = Object.create(World.prototype);
DemoWorld.prototype.constructor = DemoWorld;

DemoWorld.prototype.createComponents = function() {
	World.prototype.createComponents.apply(this, arguments);

	var water = window.water = new Water();

	var pws = new PointWaveSource(water);
	pws.x = 200;
	pws.y = 50;
	pws.period = 3;
	pws.amplitude = 10;
	water.waveSources.push(pws);

	pws = new PointWaveSource(water);
	pws.x = -50;
	pws.y = -100;
	pws.period = 2;
	water.waveSources.push(pws);

	var b = new Buoy(this.gl, water, [0, 0.5, 0.2]);
	this.sceneRoot.addComponent(b);
	b.x = -100;
	this.actors.push(b);

	new MaterialEditor(b.material, 'Green Buoy');

	b = new Buoy(this.gl, water, [0.8, 0, 0]);
	this.sceneRoot.addComponent(b);
	b.x = 100;
	this.actors.push(b);

	new MaterialEditor(b.material, 'Red Buoy');

	var waterSurface = window.waterSurface = new WaterSurface(this.gl, water, 512, 16);
	this.sceneRoot.addComponent(waterSurface);
	this.actors.push(waterSurface);

	new MaterialEditor(waterSurface.material);

	loadMesh("models", "dinghy.obj").then(function(meshes) {
		Boat.meshes = meshes;
		var boat = window.boat = new Boat(this.gl, water);
		this.actors.push(boat);
		this.sceneRoot.addComponent(boat);

		var allmats = [];

		for(var i = 0; i < meshes.length; i++) {
			if(allmats.indexOf(meshes[i].material) == -1)
				allmats.push(meshes[i].material);
		}

		allmats.forEach(function(mat) {
			new MaterialEditor(mat);
		});
	}.bind(this), function(error) {
		debugger;
	});
};

DemoWorld.prototype.tick = function tick(ts) {
	World.prototype.tick.apply(this, arguments);
	var angle = ts / 10000;
	this.camera.x = Math.sin(angle) * 200;
	this.camera.y = Math.cos(angle) * 200;
	this.camera.z = Math.sin(ts / 7000) * 50 + 75;
};
