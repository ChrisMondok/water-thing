function DemoWorld() {
	World.apply(this, arguments);
}

DemoWorld.prototype = Object.create(World.prototype);
DemoWorld.prototype.constructor = DemoWorld;

DemoWorld.prototype.createComponents = function() {
	World.prototype.createComponents.apply(this, arguments);

	new EnvironmentEditor(this);

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

	new WaterEditor(water);

	var waterSurface = window.waterSurface = new WaterSurface(this.gl, water, 512, 16);
	this.sceneRoot.addComponent(waterSurface);
	this.actors.push(waterSurface);

	new MaterialEditor(waterSurface.material);

	loadMesh("models", "buoy.obj").then(function(meshes) {
		Buoy.meshes = meshes;
		var b2 = window.b2 = new Buoy(this.gl, water);

		b2.x = 100;

		this.actors.push(b2);
		this.sceneRoot.addComponent(b2);

		addMaterialEditorsForMeshes(meshes);
	}.bind(this));

	loadMesh("models", "dinghy.obj").then(function(meshes) {
		Boat.meshes = meshes;
		var boat = window.boat = new Boat(this.gl, water);
		this.actors.push(boat);
		this.sceneRoot.addComponent(boat);

		addMaterialEditorsForMeshes(meshes);

	}.bind(this), function(error) {
		debugger;
	});

	function addMaterialEditorsForMeshes(meshes) {
		var allmats = [];

		for(var i = 0; i < meshes.length; i++) {
			if(allmats.indexOf(meshes[i].material) == -1)
				allmats.push(meshes[i].material);
		}

		allmats.forEach(function(mat) {
			new MaterialEditor(mat);
		});
	}
};

DemoWorld.prototype.tick = function tick(ts) {
	World.prototype.tick.apply(this, arguments);
	var angle = ts / 10000;
	this.camera.x = Math.sin(angle) * 200;
	this.camera.y = Math.cos(angle) * 200;
	this.camera.z = Math.sin(ts / 7000) * 50 + 75;
};
