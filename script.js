addEventListener('load', start);

var transformation = Matrix.I(4);

var pyramidVerts = new Float32Array([
	-0.5, -0.5,  0.0, //lower left
	 0.5, -0.5,  0.0, //lower right
	 0.0,  0.5,  0.0, //top
	 0.0,  0.0,  0.25, //center
	-0.5, -0.5,  0.0, //lower left
	 0.5, -0.5,  0.0 //lower right
]);

function start() {
	var canvas = document.querySelector('canvas');
	var gl = window.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

	var renderer;

	var camera = window.camera = new Camera();

	var actors = [];


	function tick(ts) {
		for(var i = 0; i < actors.length; i++)
			actors[i].tick(ts);
		draw(ts);
		requestAnimationFrame(tick);
	}

	function draw(ts) {
		renderer.render(camera, ts);

		var angle = ts / 10000;
		camera.x = Math.sin(angle) * 200;
		camera.y = Math.cos(angle) * 200;
		camera.z = Math.sin(ts / 7000) * 50 + 75;
	}

	getProgram(gl).then(function(program) {
		window.renderer = renderer = new Renderer(gl, program);

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

		var b = new Buoy(gl, water, [0, 0.5, 0.2]);
		window.b = b;
		renderer.sceneRoot.addComponent(b);
		b.x = -100;
		actors.push(b);

		new MaterialEditor(b.material, 'Green Buoy');

		b = new Buoy(gl, water, [0.8, 0, 0]);
		renderer.sceneRoot.addComponent(b);
		b.x = 100;
		actors.push(b);

		new MaterialEditor(b.material, 'Red Buoy');

		var waterSurface = window.waterSurface = new WaterSurface(gl, water, 512, 16);
		renderer.sceneRoot.addComponent(waterSurface);
		actors.push(waterSurface);

		new MaterialEditor(waterSurface.material);

		loadMesh("models/dinghy.obj").then(function(mesh) {
			Boat.mesh = mesh;
			var boat = window.boat = new Boat(gl, water);
			actors.push(boat);
			renderer.sceneRoot.addComponent(boat);
			new MaterialEditor(boat.material);
		}, function(error) {
			debugger;
		});

		requestAnimationFrame(tick);
	}).then(null, function(e) {
		console.error(e);
	});
}

function getProgram(gl) {
	var program = gl.createProgram();

	return Promise.all([
		getShader(gl, 'vertex.glsl', gl.VERTEX_SHADER),
		getShader(gl, 'fragment.glsl', gl.FRAGMENT_SHADER)
	]).then(function(shaders) {
		shaders.forEach(function(shader) {
			gl.attachShader(program, shader);
		});
		gl.linkProgram(program);

		if(!gl.getProgramParameter(program, gl.LINK_STATUS))
			throw "Error in program: "+gl.getProgramInfoLog(program);

		return program;
	});
}

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
