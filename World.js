function World(canvas) {
	this.renderers = [];
	this.actors = [];

	this.gl = window.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

	var tick = this._tick = this.tick.bind(this);

	this.createComponents();

	this.ambient = [0.1, 0.1, 0.1];

	this.lightmap = createTexture(this.gl, 1024, 1024);

	this.ready = this.addRenderer(LightmapRenderer)
		.then(this.addRenderer.bind(this, SceneRenderer))
		.then(this.addRenderer.bind(this, TextureRenderer))
		.then(function() {
		requestAnimationFrame(tick);
	}, function(error) {
		debugger;
	});
}

World.prototype.sceneRoot = null;
World.prototype.camera = null;

World.prototype.latitude = 40;
World.prototype.timeOfDay = 0.6; //0-1 => 0h-24h
World.prototype.timeScale = 1;

World.prototype.east = Vector.create([1, 0, 0]);
World.prototype.north = Vector.create([0, 1, 0]);
World.prototype.up = Vector.create([0, 0, 1]);

World.prototype.createComponents = function() {
	this.camera = new Camera();
	this.sceneRoot = new SceneGraphNode();
};

(function() {
	var northLine = Line.create([0, 0, 0], World.prototype.north);
	var eastLine = Line.create([0, 0, 0], World.prototype.east);

	function computeSunIntensity(timeOfDay) {
		var c = -1 * Math.cos(Math.PI * 2 * timeOfDay);
		if(c < 0)
			return 0;
		return Math.pow(c, 0.25);
	}

	World.prototype.tick = function tick(ts) {
		ts *= this.timeScale;
		this.sun = Vector.create([0, 0, -1 * computeSunIntensity(this.timeOfDay)])
			.rotate(-this.timeOfDay * Math.PI * 2, northLine)
			.rotate(this.latitude / 180 * Math.PI, eastLine);

		for(var i = 0; i < this.actors.length; i++)
			this.actors[i].tick(ts);
		this.draw(ts);
		requestAnimationFrame(this._tick);
	};
})();

World.prototype.draw = function draw(ts) {
	for(var i = 0; i < this.renderers.length; i++) {
		this.renderers[i].render(this.sceneRoot, this.camera, ts);
	}
};

World.prototype.addRenderer = function(type) {

	return Renderer.create(type, this).then(function(r) {
		this.renderers.push(r);
	}.bind(this));
};
