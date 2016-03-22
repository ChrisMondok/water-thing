function World(canvas) {
	this.renderers = [];
	this.actors = [];

	this.gl = window.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

	this._tick = this.tick.bind(this);

	this.createComponents();

	this.ambient = [0.1, 0.1, 0.1];

	requestAnimationFrame(this._tick);
}

World.prototype.sceneRoot = null;
World.prototype.camera = null;

World.prototype.latitude = 40;
World.prototype.timeOfDay = 0.6; //0-1 => 0h-24h

World.prototype.createComponents = function() {
	this.camera = new Camera();
	this.sceneRoot = new SceneGraphNode();
};

(function() {
	var northVector = Line.create([0, 0, 0], [0, 1, 0]);
	var eastVector = Line.create([0, 0, 0], [1, 0, 0]);

	function computeSunIntensity(timeOfDay) {
		var c = -1 * Math.cos(Math.PI * 2 * timeOfDay);
		if(c < 0)
			return 0;
		return Math.pow(c, 0.25);
	}

	World.prototype.tick = function tick(ts) {
		this.sun = Vector.create([0, 0, -1 * computeSunIntensity(this.timeOfDay)])
			.rotate(-this.timeOfDay * Math.PI * 2, northVector)
			.rotate(this.latitude / 180 * Math.PI, eastVector);

		for(var i = 0; i < this.actors.length; i++)
			this.actors[i].tick(ts);
		this.draw(ts);
		requestAnimationFrame(this._tick);
	};
})();

World.prototype.draw = function draw(ts) {
	for(var i = 0; i < this.renderers.length; i++)
		this.renderers[i].render(this.sceneRoot, this.camera, ts);
};

(function() {
	World.prototype.addRenderer = function(vertexPath, fragmentPath) {
		var self = this;

		return Promise.all([
			getShader(gl, vertexPath, gl.VERTEX_SHADER),
			getShader(gl, fragmentPath, gl.FRAGMENT_SHADER)
		]).then(function(shaders) {
			var program = gl.createProgram();
			shaders.forEach(function(shader) {
				gl.attachShader(program, shader);
			});
			return program;
		}).then(function(program) {
			gl.linkProgram(program);
			return program;
		}).then(function(program) {
			if(!gl.getProgramParameter(program, gl.LINK_STATUS))
				throw "Error in program: "+gl.getProgramInfoLog(program);
			return program;
		}).then(function(program) {
			var renderer = new Renderer(self, program);
			self.renderers.push(renderer);
			return renderer;
		});
	};

	function getShader(gl, url, type) {
		return http.get(url).then(function(glsl) {
			var shader = gl.createShader(type);
			gl.shaderSource(shader, glsl);
			gl.compileShader(shader);

			if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
				throw "Error in shader "+url+": "+gl.getShaderInfoLog(shader);

			return shader;
		});
	}
})();
