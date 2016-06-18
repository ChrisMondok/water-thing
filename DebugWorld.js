function DebugWorld() {
	World.apply(this, arguments);
}

DebugWorld.prototype = Object.create(World.prototype);
DebugWorld.prototype.constructor = DebugWorld;

DebugWorld.prototype.createComponents = function() {
	World.prototype.createComponents.apply(this, arguments);

	new EnvironmentEditor(this);

	var water = window.water = new Water();

	new WaterEditor(water);

	var waterSurface = window.waterSurface = new WaterSurface(this.gl, water, 512, 16);
	this.sceneRoot.addComponent(waterSurface);
	this.actors.push(waterSurface);

	new MaterialEditor(waterSurface.material);

	loadMesh("models", "dinghy.obj").then(function(meshes) {
		Boat.meshes = meshes;
		var boat = this.boat = new Boat(this.gl, water);
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

DebugWorld.prototype.tick = function tick(ts) {
	World.prototype.tick.apply(this, arguments);
	var angle = ts / 10000;

	this.camera.x = 100;
	this.camera.y = 100;
	this.camera.z = 50;

	this.log();

};

DebugWorld.prototype.log = function() {
	if(!window.logged) {
		console.log("Boat matrix")
		printMat4(this.boat.transformMatrix)
		console.log("Camera matrix")
		printMat4(this.camera.getMatrix())
	}
	window.logged = true;
}

printMat4 = function(array) {
	var columns = {};

	var dim = Math.sqrt(array.length);

	for(var row = 0; row < dim; row ++) {
		var list = columns['row'+row] = {};
		for(var col = 0; col < dim; col++) {
			list['col'+col] = array[row * dim + col]
		}
	}

	console.table(columns)
}
